
import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 1. GET DATABASE URL
# Cloud Native Rule: DATABASE_URL must be set in Environment (Fly/Render/Neon)
DATABASE_URL = os.getenv("DATABASE_URL")

# Fallback for "Hybrid Mode" (if user hasn't set up Neon yet, we might fallback to SQLite locally or just fail gracefully)
# For strict adherence to "Golden Rules", if no DB, we might default to None and let the engine handle fallback.
engine = None
SessionLocal = None

if DATABASE_URL:
    try:
        # Handle "postgres://" fix for SQLAlchemy (Neon often gives postgres://)
        if DATABASE_URL.startswith("postgres://"):
            DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

        engine = create_engine(DATABASE_URL)
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        print(f"--- 🟢 DATABASE CONNECTED: {DATABASE_URL.split('@')[-1]} ---")
    except Exception as e:
        print(f"--- 🔴 DATABASE CONNECTION FAILED: {e} ---")
        engine = None
else:
    print("--- 🟡 NO DATABASE_URL FOUND. RUNNING IN 'MEMORY-ONLY' MODE (LEGACY EXCEL). ---")

Base = declarative_base()

def get_db():
    """Dependency for DB Session"""
    if SessionLocal is None:
        return None
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
