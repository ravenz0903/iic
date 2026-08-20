from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, Text
from database import Base

class Market(Base):
    __tablename__ = "markets"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    lat = Column(Float)
    lon = Column(Float)
    address = Column(String)
    current_prices_json = Column(Text, nullable=True)
    demand_level = Column(String, default="medium")
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
