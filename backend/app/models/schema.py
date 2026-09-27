from sqlalchemy import Column, Integer, String, Float, Date
from app.database import Base

class FreightRate(Base):
    __tablename__ = "freight_rates"
    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date)
    origin = Column(String, index=True)
    destination = Column(String, index=True)
    commodity = Column(String)
    rate = Column(Float)

class Vessel(Base):
    __tablename__ = "vessels"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    type = Column(String)
    capacity = Column(Float)
    availability = Column(String)

class Port(Base):
    __tablename__ = "ports"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    congestion_index = Column(Float)
