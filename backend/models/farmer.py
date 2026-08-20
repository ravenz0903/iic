from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime
from database import Base

class Farmer(Base):
    __tablename__ = "farmers"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    name = Column(String, index=True)
    phone = Column(String, unique=True, index=True)
    lat = Column(Float)
    lon = Column(Float)
    language_pref = Column(String, default="en")
    created_at = Column(DateTime, default=datetime.utcnow)
