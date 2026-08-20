from pydantic import BaseModel, ConfigDict
from datetime import datetime

class TransactionBase(BaseModel):
    batch_id: str
    buyer_id: int
    seller_price: float
    transport_cost: float
    fees: float
    net_income: float

class TransactionCreate(TransactionBase):
    pass

class TransactionRead(TransactionBase):
    id: int
    status: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
