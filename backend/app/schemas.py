from pydantic import BaseModel
from typing import List, Optional

class OriginResponse(BaseModel):
    origin_id: int
    origin_name: str

    class Config:
        orm_mode = True

class ImageResponse(BaseModel):
    fi_id: int
    fi_path: str  

    class Config:
        orm_mode = True

class BenefitResponse(BaseModel):
    benefit_id: int
    benefit_name: str 

    class Config:
        orm_mode = True

class CategoryResponse(BaseModel):
    category_id: int
    category_name: str
    category_description: Optional[str] = None

    class Config:
        orm_mode = True

class NutritionUnitResponse(BaseModel):
    nu_id: int
    nu_name: str
    nu_description: Optional[str] = None

    class Config:
        orm_mode = True

class NutritionCategoryResponse(BaseModel):
    nc_id: int
    nc_name: str
    nc_description: Optional[str] = None

    class Config:
        orm_mode = True

class NutritionResponse(BaseModel):
    nutrition_id: int 
    nutrition_nutrientname: str
    nutrition_amountvalue: float 
    nutrition_dailyvaluepercent: float 
    unit: Optional[NutritionUnitResponse] = None
    nu_category: Optional[NutritionCategoryResponse] = None

    class Config:
        orm_mode = True

class MonthResponse(BaseModel):
    month_stt: int
    month_name: str

    class Config:
        orm_mode = True

class RegionInVietnamResponse(BaseModel):
    riv_id: int
    riv_name: str

    class Config:
        orm_mode = True

class AvailabilityResponse(BaseModel):
    availability_id: int 
    region: Optional[RegionInVietnamResponse] = []
    months: List[MonthResponse] = [] 
    availability_isyearround: bool

    class Config:
        orm_mode = True

class FruitResponse(BaseModel):
    fruit_id: int
    fruit_name: str
    fruit_scientificname: Optional[str] = None
    fruit_description: Optional[str] = None
    images: List[ImageResponse] = []
    benefits: List[BenefitResponse] = []
    nutritions: List[NutritionResponse] = []
    availabilities: List[AvailabilityResponse] = []
    categories: List[CategoryResponse] = []
    origins: List[OriginResponse] = [] 

    class Config:
        orm_mode = True