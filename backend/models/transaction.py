from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from database import Base

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    batch_id = Column(String, ForeignKey("batches.id"))
    buyer_id = Column(Integer, ForeignKey("buyers.id"))
    seller_price = Column(Float)
    transport_cost = Column(Float)
    fees = Column(Float)
    net_income = Column(Float)
    status = Column(String, default="offered")
    created_at = Column(DateTime, default=datetime.utcnow)
