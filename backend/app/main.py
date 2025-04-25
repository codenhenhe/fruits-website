from fastapi import FastAPI, Depends, HTTPException, File, UploadFile
from .database import engine, get_session
from .models import Base, Origin, Fruit, RegionInVietnam, Availability, Category, Benefit, FruitBenefit, Nutrition, FruitCategory, FruitOrigin
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.middleware.cors import CORSMiddleware
from .yolo_model import model 
import numpy as np
import cv2
from .schemas import FruitResponse
import logging
from sqlalchemy.orm import selectinload
from typing import Optional, List
from pydantic import BaseModel

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Thêm middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Sự kiện startup và shutdown
@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

@app.on_event("shutdown")
async def shutdown():
    await engine.dispose()  # Đóng engine khi ứng dụng dừng

@app.post("/detect-fruit/")
async def detect_fruit(file: UploadFile = File(...)):
    # Đọc file ảnh
    contents = await file.read()
    nparray = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparray, cv2.IMREAD_COLOR)

    # Chạy YOLO để phát hiện quả
    results = model.predict(source=img, conf=0.2)
    detected_fruits = []

    # Lấy tên quả từ kết quả
    for result in results[0].boxes:
        class_id = int(result.cls[0])  # ID của lớp (quả)
        class_name = model.names[class_id]  # Tên quả dựa trên danh sách lớp
        confidence = result.conf[0].item()  # Độ tin cậy
        if not any(obj.get("id")==(class_id+1) for obj in detected_fruits):
            detected_fruits.append({"id": class_id+1,"name": class_name, "confidence": round(confidence, 2)})
        else:
            for fruit in detected_fruits:
                if fruit["id"] == class_id+1:
                    fruit["confidence"] = round(max(fruit["confidence"], confidence), 2)
                    break

    return {"fruits": detected_fruits}

@app.get("/")
async def root():
    return {"message": "Hi guy!"}

@app.get("/fruits")
async def search_fruits(name: str = "", db: AsyncSession = Depends(get_session)):
    try:
        query = select(Fruit)
        if name:
            query = query.filter(Fruit.fruit_name.ilike(f"%{name.lower()}%"))

        result = await db.execute(query)
        fruits = result.scalars().all()

        return {"data": [fruit.to_dict() for fruit in fruits]}
    except Exception as e:
        logger.error(f"Error in search_fruits: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.get("/get-fruit-info", response_model=FruitResponse)
async def get_fruit(id: Optional[int] = None, db: AsyncSession = Depends(get_session)):
    try:
        stmt = (
            select(Fruit)
            .options(
                selectinload(Fruit.images),
                selectinload(Fruit.benefits),
                selectinload(Fruit.categories),
                selectinload(Fruit.origins),
                selectinload(Fruit.availabilities).selectinload(Availability.region),
                selectinload(Fruit.availabilities).selectinload(Availability.months),
                selectinload(Fruit.nutritions).selectinload(Nutrition.unit),
                selectinload(Fruit.nutritions).selectinload(Nutrition.nu_category)
            )
            .filter(Fruit.fruit_id == id)
        )
        result = await db.execute(stmt)
        fruit = result.scalars().first()
        
        if not fruit:
            raise HTTPException(status_code=404, detail="Fruit not found")
        
        return fruit  # Trả về đối tượng Fruit trực tiếp, FastAPI sẽ tự động chuyển đổi nó sang FruitResponse
    except Exception as e:
        logger.error(f"Error in search_fruit: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

class FruitResponse(BaseModel):
    fruit_id: int
    fruit_name: str

    class Config:
        orm_mode = True

class FilterFruitsResponse(BaseModel):
    data: List[FruitResponse]
    message: Optional[str] = None

@app.get("/filter-fruits", response_model=FilterFruitsResponse)
async def filter_fruits(
    region: Optional[str] = None,
    origin: Optional[str] = None,
    benefit: Optional[str] = None,
    category: Optional[str] = None,
    db: AsyncSession = Depends(get_session)
):
    try:
        
        query = select(Fruit).distinct()

        # region
        if region:
            query = query.join(Availability, Availability.fruit_id == Fruit.fruit_id)\
                        .join(RegionInVietnam, RegionInVietnam.riv_id == Availability.riv_id)\
                        .filter(RegionInVietnam.riv_name.ilike(f"%{region}%"))

        # origin
        if origin:
            query = query.join(FruitOrigin, FruitOrigin.fruit_id == Fruit.fruit_id)\
                        .join(Origin, Origin.origin_id == FruitOrigin.origin_id)\
                        .filter(Origin.origin_name.ilike(f"%{origin}%"))

        # benefit
        if benefit:
            query = query.join(FruitBenefit, FruitBenefit.fruit_id == Fruit.fruit_id)\
                        .join(Benefit, Benefit.benefit_id == FruitBenefit.benefit_id)\
                        .filter(Benefit.benefit_name.ilike(f"%{benefit}%"))

        # category
        if category:
            query = query.join(FruitCategory, FruitCategory.fruit_id == Fruit.fruit_id)\
                        .join(Category, Category.category_id == FruitCategory.category_id)\
                        .filter(Category.category_name.ilike(f"%{category}%"))

        result = await db.execute(query)
        fruits = result.scalars().all()

        if not fruits:
            return {
                "data": [],
                "message": "Không có trái cây nào."
            }

        return {"data": fruits}
    except Exception as e:
        logger.error(f"Error in filter_fruits: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

# Endpoint lấy danh sách regions
@app.get("/regions")
async def get_regions(db: AsyncSession = Depends(get_session)):
    try:
        result = await db.execute(select(RegionInVietnam.riv_name))
        regions = [row[0] for row in result.fetchall()]
        return {"regions": regions}
    except Exception as e:
        logger.error(f"Error in get_regions: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

# Endpoint lấy danh sách origins
@app.get("/origins")
async def get_origins(db: AsyncSession = Depends(get_session)):
    try:
        result = await db.execute(select(Origin.origin_name))
        origins = [row[0] for row in result.fetchall()]
        return {"origins": origins}
    except Exception as e:
        logger.error(f"Error in get_origins: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

# Endpoint lấy danh sách benefits
@app.get("/benefits")
async def get_benefits(db: AsyncSession = Depends(get_session)):
    try:
        result = await db.execute(select(Benefit.benefit_name))
        benefits = [row[0] for row in result.fetchall()]
        return {"benefits": benefits}
    except Exception as e:
        logger.error(f"Error in get_benefits: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.get("/categories")
async def get_categories(db: AsyncSession = Depends(get_session)):
    try:
        result = await db.execute(select(Category.category_name))
        categories = [row[0] for row in result.fetchall()]
        return {"categories": categories} 
    except Exception as e:
        logger.error(f"Error in get_categories: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
  # Pydantic model cho Category
class CategoryResponse(BaseModel):
    category_id: int
    category_name: str
    category_description: Optional[str] = None

    class Config:
        orm_mode = True

# Pydantic model cho Fruit
class FruitResponse(BaseModel):
    fruit_id: int
    fruit_name: str
    fruit_scientificname: str
    fruit_description: Optional[str]
    categories: List[CategoryResponse]  # Sử dụng CategoryResponse thay vì dict

    class Config:
        orm_mode = True

@app.get("/category", response_model=List[FruitResponse])
async def get_fruit(name: Optional[str] = None, db: AsyncSession = Depends(get_session)):
    try:
        # Xây dựng query cơ bản
        query = (
            select(Fruit)
            .options(
                selectinload(Fruit.categories)  # Load mối quan hệ categories
            )
        )

        # Nếu name được cung cấp, thêm join và filter
        if name:
            query = query.join(FruitCategory).join(Category).filter(
                Category.category_name.ilike(f"%{name}%")
            )

        # Thực thi query
        result = await db.execute(query)
        fruits = result.scalars().unique().all()  # Lấy tất cả fruits, đảm bảo không trùng lặp

        # Kiểm tra nếu không có fruit nào
        if not fruits:
            raise HTTPException(status_code=404, detail="No fruits found for the specified category")

        # Trả về danh sách fruits
        return fruits

    except Exception as e:
        logger.error(f"Error in get_fruit: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")