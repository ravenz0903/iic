from fastapi import APIRouter
from pydantic import BaseModel
from services.matching_engine import match_buyers_for_batch

router = APIRouter(prefix="/api/v1", tags=["matching"])

class MatchRequest(BaseModel):
    produce_type: str = "wheat"
    grade: str = "A"
    quality_score: float = 88.5
    quantity_quintals: float = 10.0
    farmer_lat: float = 28.6139
    farmer_lon: float = 77.2090

@router.get("/match/buyers/{batch_id}")
def match_buyers(batch_id: str, produce_type: str = "wheat", grade: str = "A", quality_score: float = 88.5, quantity_quintals: float = 10, farmer_lat: float = 28.6139, farmer_lon: float = 77.2090):
    return match_buyers_for_batch(produce_type, grade, quality_score, quantity_quintals, farmer_lat, farmer_lon)

@router.post("/match/buyers")
def match_buyers_post(request: MatchRequest):
    return match_buyers_for_batch(request.produce_type, request.grade, request.quality_score, request.quantity_quintals, request.farmer_lat, request.farmer_lon)
