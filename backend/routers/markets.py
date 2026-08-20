from fastapi import APIRouter
from typing import List

try:
    from router_engine import calculate_best_market
except ImportError:
    # Fallback if router_engine is not correctly implemented
    def calculate_best_market(*args, **kwargs):
        return {"error": "Not implemented"}

router = APIRouter(prefix="/api/v1", tags=["markets"])

@router.post("/optimize-route")
def optimize_route(data: dict):
    # Wrapper for existing logic
    return calculate_best_market(data)

@router.get("/markets")
def get_markets():
    return [
        {"id": "M1", "name": "Market A", "lat": 28.7041, "lon": 77.1025},
        {"id": "M2", "name": "Market B", "lat": 28.5355, "lon": 77.3910},
        {"id": "M3", "name": "Market C", "lat": 28.4595, "lon": 77.0266}
    ]
