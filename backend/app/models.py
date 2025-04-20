from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, CheckConstraint, UniqueConstraint, Table
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

# Bảng Origin (Nguồn gốc trái cây)
class Origin(Base):
    __tablename__ = "origins"

    origin_id = Column(Integer, primary_key=True, index=True)
    origin_name = Column(Text, nullable=False)

    def to_dict(self):
        return {"id": self.origin_id, "name": self.origin_name}

# Bảng Fruit (Trái cây)
class Fruit(Base):
    __tablename__ = "FRUIT"

    FRUIT_ID = Column(Integer, primary_key=True, index=True)
    FRUIT_Name = Column(String(50), unique=True, nullable=False)
    FRUIT_ScientificName = Column(String(50), unique=True, nullable=False)
    FRUIT_Description = Column(Text, nullable=True)

    images = relationship("FruitImage", back_populates="FRUIT")
    benefits = relationship("Benefit", secondary="FRUIT_BENEFIT",back_populates="FRUIT")
    categories = relationship("Category", secondary="FRUIT_CATEGORY",back_populates="FRUIT")
    origins = relationship("Origin", secondary="FRUIT_ORIGIN",back_populates="FRUIT")
    availability = relationship("Availability", back_populates="FRUIT")
    nutritions = relationship("Nutrition", back_populates="FRUIT")

    # def to_dict(self):
    #     return {
    #         "id": self.fruit_id, 
    #         "name": self.fruit_name, 
    #         "scientific_name": self.scientific_name,
    #         "description": self.description
    #         }

# Bảng lưu ảnh trái cây
class FruitImage(Base):
    __tablename__ = "FRUIT_IMAGE"
    
    FI_ID = Column(Integer, primary_key=True, index=True)
    FRUIT_ID = Column(Integer, ForeignKey("fruit.FRUIT_ID"), ondelete='CASCADE')
    FI_Path = Column(Text, nullable=False)

    fruit = relationship("Fruit", back_populates="images")

# Bảng Vùng miền ở Việt Nam
class RegionInVietnam(Base):
    __tablename__ = "regions_in_vietnam"

    region_id = Column(Integer, primary_key=True, index=True)
    region_name = Column(String(10), nullable=False)

# Bảng Trái cây có sẵn theo mùa ở các vùng miền
class FruitAvailabilityInVietnam(Base):
    __tablename__ = "fruits_availability_in_vietnam"

    id = Column(Integer, primary_key=True, index=True)
    fruit_id = Column(Integer, ForeignKey("fruits.fruit_id"), nullable=False)
    riv_id = Column(Integer, ForeignKey("regions_in_vietnam.region_id"), nullable=False)
    month = Column(Integer, nullable=True)
    is_year_round = Column(Boolean, default=False, nullable=False)

    __table_args__ = (
        UniqueConstraint("fruit_id", "riv_id", "month"),
        CheckConstraint("(is_year_round = TRUE AND month IS NULL) OR (is_year_round = FALSE AND month IS NOT NULL)", 
                        name="check_year_round_validity"),
    )

# Bảng Category (Danh mục trái cây)
class Category(Base):
    __tablename__ = "categories"

    category_id = Column(Integer, primary_key=True, index=True)
    category_name = Column(String(100), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    
    # Quan hệ nhiều-nhiều với Fruits
    fruits = relationship("Fruit", secondary="fruit_categories", back_populates="categories")

# Bảng Benefit (Lợi ích sức khỏe của trái cây)
class Benefit(Base):
    __tablename__ = "benefits"

    benefit_id = Column(Integer, primary_key=True, index=True)
    benefit = Column(Text, nullable=False)

    # Quan hệ nhiều-nhiều với Fruits
    fruits = relationship("Fruit", secondary="health_benefits", back_populates="benefits")

# Bảng trung gian Health Benefits (Trái cây và lợi ích sức khỏe)
class HealthBenefit(Base):
    __tablename__ = "health_benefits"

    fruit_id = Column(Integer, ForeignKey("fruits.fruit_id", ondelete="CASCADE"), primary_key=True)
    benefit_id = Column(Integer, ForeignKey("benefits.benefit_id", ondelete="CASCADE"), primary_key=True)
    description = Column(Text, nullable=True)

# Bảng Nutrition (Dinh dưỡng của trái cây)
class Nutrition(Base):
    __tablename__ = "nutrition"

    id = Column(Integer, primary_key=True, index=True)
    fruit_id = Column(Integer, ForeignKey("fruits.fruit_id", ondelete="CASCADE"), nullable=False)
    category = Column(Text, nullable=False)       # Nhóm dinh dưỡng (Energy, Carbohydrates, Vitamins, ...)
    nutrient_name = Column(Text, nullable=False)  # Tên chất dinh dưỡng (Vitamin C, Calcium, ...)
    amount = Column(Text, nullable=False)         # Lượng dinh dưỡng (36.4 mg, 11 mg, ...)
    daily_value = Column(Text, nullable=True)     # % giá trị hàng ngày (44%)

# Bảng trung gian Health Benefits (Trái cây và lợi ích sức khỏe)
class FruitCategory(Base):
    __tablename__ = "fruit_categories"

    fruit_id = Column(Integer, ForeignKey("fruits.fruit_id", ondelete="CASCADE"), primary_key=True)
    category_id = Column(Integer, ForeignKey("categories.category_id", ondelete="CASCADE"), primary_key=True)

class FruitOrigin(Base):
    __tablename__ = "fruit_origin"

    fruit_id = Column(Integer, ForeignKey("fruits.fruit_id", ondelete="CASCADE"), primary_key=True)
    origin_id = Column(Integer, ForeignKey("origin.origin_id", ondelete="CASCADE"), primary_key=True)

class Month(Base):
    __tablename__ = "MONTH"
    
    MONTH_STT = Column(Integer, primary_key=True, index=True)
    MONTH_Name = Column(String(10), nullable=False)

    available_months = relationship("AvailableMonth", back_populates="month")
