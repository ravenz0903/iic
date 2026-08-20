from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from database import Base

class Batch(Base):
    __tablename__ = "batches"

    id = Column(String, primary_key=True, index=True)
    farmer_id = Column(Integer, ForeignKey("farmers.id"))
    produce_type = Column(String, index=True)
    quantity_quintals = Column(Float)
    quality_score = Column(Float, nullable=True)
    grade = Column(String, nullable=True)
    scan_image_path = Column(String, nullable=True)
    defects_json = Column(Text, nullable=True)
    status = Column(String, default="scanned")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
