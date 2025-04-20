from fastapi import FastAPI, Depends, HTTPException, File, UploadFile
from .database import engine, get_session
from .models import Base, Origin, Fruit, HealthBenefit, Nutrition, FruitAvailabilityInVietnam, RegionInVietnam, Category, FruitCategory
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.middleware.cors import CORSMiddleware
from .yolo_model import model 
import numpy as np
import cv2
from .schemas import FruitResponse
import logging
from sqlalchemy.orm import selectinload
from typing import Optional

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Thêm middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Cho phép Next.js truy cập
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
    return {"message": "Hello World"}

@app.get("/origin/")
async def search_origins(id: int = None, db: AsyncSession = Depends(get_session)):
    try:
        query = select(Origin)
        logger.info(f"Querying with id: {id}")
        if id is not None:
            query = query.filter(Origin.origin_id == id)
        result = await db.execute(query)
        origins = result.scalars().all()
        logger.info(f"Found origins: {[o.to_dict() for o in origins]}")  # Log dữ liệu tìm thấy
        if not origins:
            raise HTTPException(status_code=404, detail="No origins found")
        return {"status": "success", "total": len(origins), "data": [origin.to_dict() for origin in origins]}
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


# @app.get("/fruits")
# async def search_fruits(name: str = "", db: AsyncSession = Depends(get_session)):
#     try:
#         query = select(Fruit)
#         if name:
#             query = query.filter(Fruit.fruit_name.ilike(f"%{name.lower()}%"))

#         result = await db.execute(query)
#         fruits = result.scalars().all()

#         # if not fruits:
#         #     raise HTTPException(status_code=404, detail="No fruits found")

#         return {"data": [fruit.to_dict() for fruit in fruits]}
#     except Exception as e:
#         logger.error(f"Error in search_fruits: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    
@app.get("/get-fruit-info", response_model=FruitResponse)
async def get_fruit_info(fruit_id: int, db: AsyncSession = Depends(get_session)):
    # Truy vấn Fruit với tất cả các mối quan hệ
    stmt = (
        select(Fruit)
        .options(
            selectinload(Fruit.images),  # Tải images
            selectinload(Fruit.benefits),  # Tải benefits
            selectinload(Fruit.categories),  # Tải categories
        )
        .where(Fruit.fruit_id == fruit_id)
    )
    result = await db.execute(stmt)
    fruit = result.scalars().first()

    if not fruit:
        raise HTTPException(status_code=404, detail="Fruit not found")

    # Lấy thông tin Nutrition
    nutrition_stmt = select(Nutrition).where(Nutrition.fruit_id == fruit_id)
    nutrition_result = await db.execute(nutrition_stmt)
    nutrition = nutrition_result.scalars().all()

    # Lấy thông tin Availability và join với RegionInVietnam
    availability_stmt = (
        select(FruitAvailabilityInVietnam, RegionInVietnam)
        .join(RegionInVietnam, FruitAvailabilityInVietnam.riv_id == RegionInVietnam.region_id)
        .where(FruitAvailabilityInVietnam.fruit_id == fruit_id)
    )
    availability_result = await db.execute(availability_stmt)
    availability = availability_result.all()

    # Xây dựng response
    response = {
        "fruit_id": fruit.fruit_id,
        "fruit_name": fruit.fruit_name,
        "scientific_name": fruit.scientific_name,
        "description": fruit.description,
        "images": [{"image_id": img.image_id, "image_url": img.image_url, "description": img.description} for img in fruit.images],
        "benefits": [{"benefit_id": b.benefit_id, "benefit": b.benefit, "description": hb.description} 
                     for b, hb in [(b, (await db.execute(select(HealthBenefit).filter_by(fruit_id=fruit.fruit_id, benefit_id=b.benefit_id))).scalars().first()) 
                                   for b in fruit.benefits]],
        "nutrition": [{"id": n.id, "category": n.category, "nutrient_name": n.nutrient_name, "amount": n.amount, "daily_value": n.daily_value} 
                      for n in nutrition],
        "availability": [{"region_name": region.region_name, "month": avail.month, "is_year_round": avail.is_year_round} 
                         for avail, region in availability],
        # "categories": "hello",
        "categories": [{"category_id": cate.category_id, "category_name": cate.category_name, "description": cate.description} 
                        for cate in fruit.categories],
    }

    return response

@app.get("/categories")
async def search_fruits(category_id: Optional[int] = None, db: AsyncSession = Depends(get_session)):
    try:
        query = select(Category)
        if category_id:
            query = query.filter(Category.category_id == category_id)

        result = await db.execute(query)
        cate = result.scalars().all()
        return {"categories": cate}
    except Exception as e:
        logger.error(f"Error in search_categories: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
