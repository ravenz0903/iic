from pydantic import BaseModel, ConfigDict
from datetime import datetime

class ListingBase(BaseModel):
    batch_id: str
    asking_price: float
    available_date: str

class ListingCreate(ListingBase):
    pass

class ListingRead(ListingBase):
    id: int
    status: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
