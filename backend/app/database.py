from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

# Load biến môi trường từ .env
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

# Kết nối với database PostgreSQL (dùng asyncpg)
engine = create_async_engine(DATABASE_URL, echo=True)

# Tạo Session async
AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False
)

# Base để khai báo ORM models
Base = declarative_base()

# Dependency để lấy session database
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session