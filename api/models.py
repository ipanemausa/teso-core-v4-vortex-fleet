from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class Company(Base):
    __tablename__ = "companies"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    payment_terms_days = Column(Integer, default=30)
    created_at = Column(DateTime, default=datetime.utcnow)

    services = relationship("Service", back_populates="company")

class Driver(Base):
    __tablename__ = "drivers"
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True) # e.g. COND-001
    name = Column(String)
    vehicle_plate = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    services = relationship("Service", back_populates="driver")

class Service(Base):
    __tablename__ = "services"
    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime, nullable=False)
    
    company_id = Column(Integer, ForeignKey("companies.id"))
    driver_id = Column(Integer, ForeignKey("drivers.id"))
    passenger_name = Column(String)
    
    fare_amount = Column(Float, default=0.0)
    toll_amount = Column(Float, default=0.0)
    teso_commission_pct = Column(Float, default=0.20)
    
    status = Column(String, default="COMPLETED")
    source = Column(String, default="MANUAL") # EXCEL, APP
    
    company = relationship("Company", back_populates="services")
    driver = relationship("Driver", back_populates="services")

class FinancialTransaction(Base):
    __tablename__ = "transactions"
    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime, nullable=False)
    type = Column(String) # INCOME, EXPENSE
    category = Column(String)
    description = Column(String)
    amount = Column(Float)
    
    created_at = Column(DateTime, default=datetime.utcnow)
