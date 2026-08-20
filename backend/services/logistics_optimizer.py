import logging
from typing import List, Dict, Any
from services.market_intelligence import haversine_distance

logger = logging.getLogger(__name__)

VEHICLE_OPTIONS = {
    "mini-truck": {"cost_per_km": 15, "capacity_qtl": 20, "label": "Mini Truck", "eta_factor": 1.0},
    "large-truck": {"cost_per_km": 25, "capacity_qtl": 80, "label": "Large Truck", "eta_factor": 0.8},
    "shared-transport": {"cost_per_km": 10, "capacity_qtl": 10, "label": "Shared Transport", "eta_factor": 1.5}
}

def get_transport_options(distance_km: float, quantity_quintals: float) -> List[Dict[str, Any]]:
    """Generate transport options for a given route."""
    options = []
    for vehicle_type, config in VEHICLE_OPTIONS.items():
        if quantity_quintals > config["capacity_qtl"]:
            trips = -(-int(quantity_quintals) // config["capacity_qtl"])  # ceil division
        else:
            trips = 1
        
        base_cost = 500  # fixed base cost
        distance_cost = config["cost_per_km"] * 2 * distance_km  # round trip
        total_cost = (base_cost + distance_cost) * trips
        eta_hours = round(distance_km / 40 * config["eta_factor"] * 2, 1)  # assume 40km/h avg
        
        options.append({
            "vehicle_type": vehicle_type,
            "label": config["label"],
            "capacity_qtl": config["capacity_qtl"],
            "trips_required": trips,
            "cost": round(total_cost, 2),
            "cost_per_quintal": round(total_cost / quantity_quintals, 2),
            "eta_hours": eta_hours,
            "distance_km": round(distance_km, 1)
        })
    
    options.sort(key=lambda x: x["cost"])
    return options

def compare_buyer_transport_combos(buyers: List[Dict], farmer_lat: float, farmer_lon: float, quantity_quintals: float, quality_score: float) -> List[Dict[str, Any]]:
    """Compare multiple buyer + transport combinations and rank by net profit."""
    combos = []
    
    # Mock buyers if none provided
    if not buyers:
        buyers = [
            {"name": "Delhi Buyer #14", "price_per_qtl": 2520, "lat": 28.7041, "lon": 77.1025},
            {"name": "Gurgaon Trader #7", "price_per_qtl": 2680, "lat": 28.4595, "lon": 77.0266},
            {"name": "Noida Wholesaler #3", "price_per_qtl": 2450, "lat": 28.5355, "lon": 77.3910}
        ]
    
    for buyer in buyers:
        distance = haversine_distance(farmer_lat, farmer_lon, buyer["lat"], buyer["lon"])
        transport_options = get_transport_options(distance, quantity_quintals)
        
        for transport in transport_options:
            gross = buyer["price_per_qtl"] * quantity_quintals
            marketplace_fee = gross * 0.02
            loading = 50 * quantity_quintals
            net = gross - transport["cost"] - marketplace_fee - loading
            
            combos.append({
                "buyer_name": buyer["name"],
                "buyer_price": buyer["price_per_qtl"],
                "vehicle": transport["label"],
                "vehicle_type": transport["vehicle_type"],
                "distance_km": round(distance, 1),
                "transport_cost": transport["cost"],
                "marketplace_fee": round(marketplace_fee, 2),
                "loading_cost": round(loading, 2),
                "gross_revenue": round(gross, 2),
                "net_profit": round(net, 2),
                "eta_hours": transport["eta_hours"]
            })
    
    combos.sort(key=lambda x: x["net_profit"], reverse=True)
    return combos
