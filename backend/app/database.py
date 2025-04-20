from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv
from typing import AsyncGenerator
from contextlib import asynccontextmanager

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

@asynccontextmanager
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

async def get_session():
    async with get_db() as session:
        yield session
