from sqlalchemy import Column, Integer, String
from .database import Base

class Region(Base):
    __tablename__ = "regions_in_vietnam"

    region_id = Column(Integer, primary_key=True, index=True)
    region_name = Column(String, unique=True, index=True)
