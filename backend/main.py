from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

from router_engine import calculate_best_market

app = FastAPI(title="AI Produce Intelligence Platform API")

# Add CORS Middleware to allow connections from React Native frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for Requests
class RouteOptimizationRequest(BaseModel):
    farmer_lat: float
    farmer_lon: float
    batch_weight_quintals: float
    quality_score: float
    vehicle_type: str

# Pydantic models for Responses
class MarketRouteResult(BaseModel):
    id: str
    name: str
    distance_km: float
    base_price_per_quintal: float
    toll_fees: float
    loading_charge: float
    cess_percent: float
    r_net: float
    realized_price: float
    deductions: float

@app.post("/api/v1/optimize-route", response_model=List[MarketRouteResult])
def optimize_route(request: RouteOptimizationRequest):
    """
    Endpoint to calculate the most profitable market routes based on weight, 
    quality, and transport factors.
    """
    sorted_markets = calculate_best_market(
        batch_weight_quintals=request.batch_weight_quintals,
        quality_score=request.quality_score,
        vehicle_type=request.vehicle_type
    )
    
    return sorted_markets
