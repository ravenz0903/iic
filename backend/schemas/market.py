from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class MarketRead(BaseModel):
    id: str
    name: str
    lat: float
    lon: float
    address: str
    current_prices_json: Optional[str] = None
    demand_level: str
    last_updated: datetime
    model_config = ConfigDict(from_attributes=True)

class MarketComparison(BaseModel):
    name: str
    distance_km: float
    base_price: float
    transport_cost: float
    net_earnings: float
    demand_level: str
    trend_direction: str
