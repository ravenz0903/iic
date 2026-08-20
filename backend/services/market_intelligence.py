import math
import random
from datetime import datetime, timedelta
import statistics
from typing import List, Dict, Any

from services.price_engine import P_BASE, estimate_price

def generate_price_history(produce_type: str, days: int = 90) -> List[Dict[str, Any]]:
    history = []
    base = P_BASE.get(produce_type.lower(), 2500)
    for day in range(days):
        date = (datetime.now() - timedelta(days=days-day-1)).strftime('%Y-%m-%d')
        seasonal = math.sin(2 * math.pi * day / 90) * 0.08  # 8% seasonal swing
        noise = random.uniform(-0.03, 0.03)  # 3% random noise
        price = round(base * (1 + seasonal + noise), 2)
        history.append({"date": date, "price": price, "volume": random.randint(500, 2000)})
    return history

def calculate_trends(history: List[Dict[str, Any]]) -> Dict[str, Any]:
    if not history or len(history) < 30:
        return {}
    
    prices = [h["price"] for h in history]
    
    # 7-day moving average
    last_7_prices = prices[-7:]
    moving_avg_7d = sum(last_7_prices) / len(last_7_prices)
    
    # 30-day trend direction
    last_30_prices = prices[-30:]
    avg_last_7 = moving_avg_7d
    avg_23_30 = sum(prices[-30:-23]) / len(prices[-30:-23])
    
    if avg_last_7 > avg_23_30 * 1.03:
        trend_direction = "rising"
    elif avg_last_7 < avg_23_30 * 0.97:
        trend_direction = "falling"
    else:
        trend_direction = "stable"
        
    volatility = statistics.stdev(last_30_prices) / statistics.mean(last_30_prices) if len(last_30_prices) >= 2 else 0
    
    price_change_7d_pct = ((prices[-1] - prices[-7]) / prices[-7]) * 100
    price_change_30d_pct = ((prices[-1] - prices[-30]) / prices[-30]) * 100
    
    return {
        "moving_avg_7d": round(moving_avg_7d, 2),
        "trend_direction": trend_direction,
        "volatility": round(volatility, 4),
        "price_change_7d_pct": round(price_change_7d_pct, 2),
        "price_change_30d_pct": round(price_change_30d_pct, 2)
    }

def haversine_distance(lat1, lon1, lat2, lon2):
    R = 6371  # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat/2) * math.sin(dlat/2) + math.cos(math.radians(lat1)) \
        * math.cos(math.radians(lat2)) * math.sin(dlon/2) * math.sin(dlon/2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    return R * c

def compare_markets(produce_type: str, grade: str, farmer_lat: float, farmer_lon: float, batch_weight: float) -> List[Dict[str, Any]]:
    # Mock mandis
    markets_data = [
        {"id": "M1", "name": "Market A", "lat": 28.7041, "lon": 77.1025},
        {"id": "M2", "name": "Market B", "lat": 28.5355, "lon": 77.3910},
        {"id": "M3", "name": "Market C", "lat": 28.4595, "lon": 77.0266}
    ]
    
    history = generate_price_history(produce_type, 30)
    trends = calculate_trends(history)
    trend_dir = trends.get("trend_direction", "stable")
    
    results = []
    base_estimation = estimate_price(produce_type, grade, batch_weight, farmer_lat, farmer_lon)
    base_price = base_estimation["estimated_price_per_quintal"]
    
    for market in markets_data:
        dist_km = haversine_distance(farmer_lat, farmer_lon, market["lat"], market["lon"])
        transport_cost = dist_km * 2.5 * batch_weight # mock formula
        
        # Add slight variations per market
        market_price = base_price * random.uniform(0.98, 1.05)
        
        net_earnings = (market_price * batch_weight) - transport_cost
        
        results.append({
            "name": market["name"],
            "distance_km": round(dist_km, 1),
            "current_price": round(market_price, 2),
            "transport_cost": round(transport_cost, 2),
            "net_earnings": round(net_earnings, 2),
            "demand_level": random.choice(["high", "medium", "low"]),
            "trend_direction": trend_dir
        })
        
    results.sort(key=lambda x: x["net_earnings"], reverse=True)
    return results
