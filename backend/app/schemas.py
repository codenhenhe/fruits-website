from pydantic import BaseModel
from typing import List, Optional

class ImageResponse(BaseModel):
    image_id: int
    image_url: str
    description: Optional[str] = None

class BenefitResponse(BaseModel):
    benefit_id: int
    benefit: str
    # description: Optional[str] = None

class CategoryResponse(BaseModel):
    category_id: int
    category_name: str
    description: Optional[str] = None

class NutritionResponse(BaseModel):
    id: int
    category: str
    nutrient_name: str
    amount: str
    daily_value: Optional[str] = None

class AvailabilityResponse(BaseModel):
    region_name: str
    month: Optional[int] = None
    is_year_round: bool

class FruitResponse(BaseModel):
    fruit_id: int
    fruit_name: str
    scientific_name: Optional[str] = None
    description: Optional[str] = None
    images: List[ImageResponse] = []
    benefits: List[BenefitResponse] = []
    nutrition: List[NutritionResponse] = []
    availability: List[AvailabilityResponse] = []
    categories: List[CategoryResponse] = []

    class Config:
        orm_mode = True
