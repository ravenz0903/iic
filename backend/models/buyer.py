from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime
from database import Base

class Buyer(Base):
    __tablename__ = "buyers"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    name = Column(String, index=True)
    business_name = Column(String)
    phone = Column(String, unique=True, index=True)
    lat = Column(Float)
    lon = Column(Float)
    reliability_score = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
