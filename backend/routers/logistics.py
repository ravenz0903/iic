from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from services.logistics_optimizer import get_transport_options, compare_buyer_transport_combos
from services.profit_calculator import calculate_profit, compare_scenarios
from services.traceability_service import get_batch_timeline, get_batch_certificate

router = APIRouter(prefix="/api/v1", tags=["logistics"])

class TransportRequest(BaseModel):
    distance_km: float
    quantity_quintals: float

class ProfitRequest(BaseModel):
    selling_price_per_qtl: float
    quantity_quintals: float
    distance_km: float
    vehicle_type: str = "mini-truck"
    marketplace_fee_pct: float = 0.02
    other_costs: float = 0

class BuyerComboRequest(BaseModel):
    farmer_lat: float = 28.6139
    farmer_lon: float = 77.2090
    quantity_quintals: float = 10.0
    quality_score: float = 88.5

@router.post("/logistics/options")
def logistics_options(request: TransportRequest):
    return get_transport_options(request.distance_km, request.quantity_quintals)

@router.post("/logistics/compare")
def logistics_compare(request: BuyerComboRequest):
    return compare_buyer_transport_combos([], request.farmer_lat, request.farmer_lon, request.quantity_quintals, request.quality_score)

@router.post("/profit/calculate")
def profit_calculate(request: ProfitRequest):
    return calculate_profit(
        request.selling_price_per_qtl, request.quantity_quintals,
        request.distance_km, request.vehicle_type,
        request.marketplace_fee_pct, request.other_costs
    )

@router.get("/batches/{batch_id}/timeline")
def batch_timeline(batch_id: str):
    return get_batch_timeline(batch_id)

@router.get("/batches/{batch_id}/certificate")
def batch_certificate(batch_id: str):
    return get_batch_certificate(batch_id)
