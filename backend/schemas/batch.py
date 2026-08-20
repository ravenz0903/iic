from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class BatchBase(BaseModel):
    farmer_id: int
    produce_type: str
    quantity_quintals: float

class BatchCreate(BatchBase):
    pass

class BatchUpdate(BaseModel):
    status: Optional[str] = None
    quality_score: Optional[float] = None
    grade: Optional[str] = None

class BatchRead(BatchBase):
    id: str
    quality_score: Optional[float] = None
    grade: Optional[str] = None
    scan_image_path: Optional[str] = None
    defects_json: Optional[str] = None
    status: str
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)
