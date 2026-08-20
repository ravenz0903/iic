from fastapi import APIRouter, Query
from typing import List, Dict, Any
from pydantic import BaseModel

from services.price_engine import estimate_price
from services.market_intelligence import generate_price_history, calculate_trends, compare_markets

router = APIRouter(prefix="/api/v1", tags=["prices"])

class PriceEstimateRequest(BaseModel):
    produce_type: str
    grade: str
    quantity_quintals: float
    farmer_lat: float
    farmer_lon: float

@router.post("/estimate-price")
def estimate_price_endpoint(request: PriceEstimateRequest):
    return estimate_price(
        request.produce_type,
        request.grade,
        request.quantity_quintals,
        request.farmer_lat,
        request.farmer_lon
    )

@router.get("/prices/history/{produce_type}")
def get_price_history(produce_type: str, days: int = Query(90)):
    return generate_price_history(produce_type, days)

@router.get("/prices/trends/{produce_type}")
def get_price_trends(produce_type: str):
    history = generate_price_history(produce_type, 90)
    return calculate_trends(history)

@router.get("/markets/compare")
def get_markets_compare(
    produce_type: str,
    grade: str,
    farmer_lat: float,
    farmer_lon: float,
    batch_weight: float
):
    return compare_markets(produce_type, grade, farmer_lat, farmer_lon, batch_weight)
