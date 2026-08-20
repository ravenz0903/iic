from pydantic import BaseModel, ConfigDict
from datetime import datetime

class BuyerBase(BaseModel):
    name: str
    business_name: str
    phone: str
    lat: float
    lon: float

class BuyerCreate(BuyerBase):
    pass

class BuyerRead(BuyerBase):
    id: int
    reliability_score: float
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
