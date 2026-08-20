import random
from typing import List, Dict, Any

def match_buyers_for_batch(produce_type: str, grade: str, quality_score: float, quantity_quintals: float, farmer_lat: float, farmer_lon: float) -> List[Dict[str, Any]]:
    """AI Buyer Matching using weighted scoring."""
    
    # Mock buyer pool
    buyers = [
        {"id": 1, "name": "Delhi Buyer #14", "business": "Kumar Agro Traders", "lat": 28.7041, "lon": 77.1025, "preferred_produce": ["wheat", "rice"], "min_grade": "A", "max_quantity": 50, "price_range": (2300, 2800), "reliability": 4.2},
        {"id": 2, "name": "Gurgaon Trader #7", "business": "Sharma & Sons", "lat": 28.4595, "lon": 77.0266, "preferred_produce": ["wheat", "onion"], "min_grade": "B", "max_quantity": 100, "price_range": (2100, 2600), "reliability": 4.5},
        {"id": 3, "name": "Noida Wholesaler #3", "business": "Agri Fresh Ltd", "lat": 28.5355, "lon": 77.3910, "preferred_produce": ["tomato", "onion", "potato"], "min_grade": "A", "max_quantity": 30, "price_range": (2400, 3500), "reliability": 3.8},
        {"id": 4, "name": "Faridabad Trader #9", "business": "Green Valley Exports", "lat": 28.4089, "lon": 77.3178, "preferred_produce": ["wheat", "rice", "potato"], "min_grade": "B", "max_quantity": 200, "price_range": (2000, 2900), "reliability": 4.0},
        {"id": 5, "name": "Ghaziabad Buyer #21", "business": "NCR Grain Market", "lat": 28.6692, "lon": 77.4538, "preferred_produce": ["wheat", "rice"], "min_grade": "A", "max_quantity": 80, "price_range": (2200, 2700), "reliability": 4.3}
    ]
    
    import math
    def haversine(lat1, lon1, lat2, lon2):
        R = 6371
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon/2)**2
        return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    
    # Weights
    w1, w2, w3, w4, w5, w6 = 0.20, 0.20, 0.15, 0.15, 0.20, 0.10
    grade_order = {"A": 3, "B": 2, "C": 1, "Rejected": 0}
    
    matches = []
    for buyer in buyers:
        # Produce match (0 or 1)
        produce_match = 1.0 if produce_type.lower() in buyer["preferred_produce"] else 0.3
        
        # Quality fit
        buyer_min = grade_order.get(buyer["min_grade"], 0)
        batch_grade = grade_order.get(grade, 0)
        quality_fit = 1.0 if batch_grade >= buyer_min else 0.3
        
        # Quantity fit
        quantity_fit = 1.0 if quantity_quintals <= buyer["max_quantity"] else 0.5
        
        # Proximity (normalize: 0km=1.0, 200km=0.0)
        distance = haversine(farmer_lat, farmer_lon, buyer["lat"], buyer["lon"])
        proximity = max(0, 1 - distance / 200)
        
        # Price compatibility
        mid_price = (buyer["price_range"][0] + buyer["price_range"][1]) / 2
        expected_price = mid_price * (quality_score / 100)
        price_compat = min(1.0, expected_price / mid_price) if mid_price > 0 else 0.5
        
        # Reliability (normalize to 0-1)
        reliability = buyer["reliability"] / 5.0
        
        # Composite score
        match_score = (w1 * produce_match + w2 * quality_fit + w3 * quantity_fit + w4 * proximity + w5 * price_compat + w6 * reliability)
        match_pct = round(match_score * 100, 1)
        
        # Estimated net earning
        transport_cost = distance * 15 * 2  # mini-truck round trip
        net_earning = round(expected_price - transport_cost / quantity_quintals, 2)
        
        matches.append({
            "buyer_id": buyer["id"],
            "buyer_name": buyer["name"],
            "business_name": buyer["business"],
            "match_percentage": match_pct,
            "expected_price": round(expected_price, 2),
            "distance_km": round(distance, 1),
            "net_earning_per_qtl": net_earning,
            "reliability_score": buyer["reliability"],
            "preferred_produce": buyer["preferred_produce"],
            "max_quantity": buyer["max_quantity"]
        })
    
    matches.sort(key=lambda x: x["match_percentage"], reverse=True)
    return matches[:5]
