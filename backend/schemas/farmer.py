from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class FarmerBase(BaseModel):
    name: str
    phone: str
    lat: float
    lon: float
    language_pref: Optional[str] = "en"

class FarmerCreate(FarmerBase):
    pass

class FarmerRead(FarmerBase):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
