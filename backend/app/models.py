from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, CheckConstraint, UniqueConstraint, DECIMAL
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

# Bảng Origin (Nguồn gốc trái cây)
class Origin(Base):
    __tablename__ = "origin"

    origin_id = Column(Integer, primary_key=True, index=True)
    origin_name = Column(String(50), nullable=False)

    fruits = relationship("Fruit", secondary="fruit_origin", back_populates="origins")

class Fruit(Base):
    __tablename__ = "fruit"

    fruit_id = Column(Integer, primary_key=True, index=True)
    fruit_name = Column(String(50), unique=True, nullable=False)
    fruit_scientificname = Column(String(50), unique=True, nullable=False)
    fruit_description = Column(Text, nullable=True)

    images = relationship("FruitImage", back_populates="fruit", cascade="all, delete")
    benefits = relationship("Benefit", secondary="fruit_benefit", back_populates="fruits")
    categories = relationship("Category", secondary="fruit_category", back_populates="fruits")
    origins = relationship("Origin", secondary="fruit_origin", back_populates="fruits")
    availabilities = relationship("Availability", back_populates="fruit")
    nutritions = relationship("Nutrition", back_populates="fruit")

    def to_dict(self):
        return {
            "fruit_id": self.fruit_id,
            "fruit_name": self.fruit_name,
        }

class FruitImage(Base):
    __tablename__ = "fruit_image"
    
    fi_id = Column(Integer, primary_key=True, index=True)
    fruit_id = Column(Integer, ForeignKey("fruit.fruit_id", ondelete='CASCADE'))
    fi_path = Column(Text, nullable=False)

    fruit = relationship("Fruit", back_populates="images")

class RegionInVietnam(Base):
    __tablename__ = "region_in_vietnam"

    riv_id = Column(Integer, primary_key=True, index=True)
    riv_name = Column(String(10), nullable=False)

    availabilities = relationship("Availability", back_populates="region")

class Availability(Base):
    __tablename__ = "availability"
    
    availability_id = Column(Integer, primary_key=True, index=True)
    riv_id = Column(Integer, ForeignKey("region_in_vietnam.riv_id"), nullable=False)
    fruit_id = Column(Integer, ForeignKey("fruit.fruit_id"), nullable=False)
    availability_isyearround = Column(Boolean, default=False, nullable=False)

    fruit = relationship("Fruit", back_populates="availabilities")
    region = relationship("RegionInVietnam", back_populates="availabilities")
    months = relationship("Month", secondary="available_month", back_populates="availabilities")

class Category(Base):
    __tablename__ = "category"
    
    category_id = Column(Integer, primary_key=True, index=True)
    category_name = Column(String(50), unique=True, nullable=False)
    category_description = Column(Text, nullable=True)

    fruits = relationship("Fruit", secondary="fruit_category", back_populates="categories")

class Benefit(Base):
    __tablename__ = "benefit"

    benefit_id = Column(Integer, primary_key=True, index=True)
    benefit_name = Column(Text, nullable=False)

    fruits = relationship("Fruit", secondary="fruit_benefit", back_populates="benefits")

class FruitBenefit(Base):
    __tablename__ = "fruit_benefit"

    fruit_id = Column(Integer, ForeignKey("fruit.fruit_id", ondelete="CASCADE"), primary_key=True)
    benefit_id = Column(Integer, ForeignKey("benefit.benefit_id", ondelete="CASCADE"), primary_key=True)

class Nutrition(Base):
    __tablename__ = "nutrition"

    nutrition_id = Column(Integer, primary_key=True, index=True)
    fruit_id = Column(Integer, ForeignKey("fruit.fruit_id"), nullable=False)
    nutrition_nutrientname = Column(Text, nullable=False)
    nutrition_amountvalue = Column(DECIMAL(6, 2), nullable=False)
    nutrition_dailyvaluepercent = Column(DECIMAL(5, 2), nullable=False)
    nu_id = Column(Integer, ForeignKey("nutrition_unit.nu_id"), nullable=False)
    nc_id = Column(Integer, ForeignKey("nutrition_category.nc_id"), nullable=False)

    fruit = relationship("Fruit", back_populates="nutritions")
    unit = relationship("NutritionUnit", back_populates="nutritions")
    nu_category = relationship("NutritionCategory", back_populates="nutritions")

class NutritionCategory(Base):
    __tablename__ = "nutrition_category"

    nc_id = Column(Integer, primary_key=True, index=True)
    nc_name = Column(String(50), nullable=False)
    nc_description = Column(Text, nullable=True)

    nutritions = relationship("Nutrition", back_populates="nu_category")

class FruitCategory(Base):
    __tablename__ = "fruit_category"
    
    category_id = Column(Integer, ForeignKey("category.category_id", ondelete="CASCADE"), primary_key=True)
    fruit_id = Column(Integer, ForeignKey("fruit.fruit_id", ondelete="CASCADE"), primary_key=True)

class FruitOrigin(Base):
    __tablename__ = "fruit_origin"
    
    origin_id = Column(Integer, ForeignKey("origin.origin_id", ondelete="CASCADE"), primary_key=True)
    fruit_id = Column(Integer, ForeignKey("fruit.fruit_id", ondelete="CASCADE"), primary_key=True)

class Month(Base):
    __tablename__ = "month"
    
    month_stt = Column(Integer, primary_key=True, index=True)
    month_name = Column(String(10), nullable=False)

    availabilities = relationship("Availability", secondary="available_month", back_populates="months")

    __table_args__ = (
        CheckConstraint('month_stt >= 1 AND month_stt <= 12'),
    )

class AvailableMonth(Base):
    __tablename__ = "available_month"
    
    month_stt = Column(Integer, ForeignKey("month.month_stt"), primary_key=True)
    availability_id = Column(Integer, ForeignKey("availability.availability_id"), primary_key=True)

class NutritionUnit(Base):
    __tablename__ = "nutrition_unit"

    nu_id = Column(Integer, primary_key=True, index=True)
    nu_name = Column(String(50), nullable=False)
    nu_description = Column(Text, nullable=True)

    nutritions = relationship("Nutrition", back_populates="unit")
