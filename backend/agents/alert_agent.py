import datetime
import random
from typing import List, Dict, Any
from services.market_intelligence import generate_price_history, calculate_trends
from services.price_engine import P_BASE

def generate_alerts(produce_type: str = "wheat", farmer_lat: float = 28.6139, farmer_lon: float = 77.2090) -> List[Dict[str, Any]]:
    """Generate mock alerts based on market conditions."""
    alerts = []
    now = datetime.datetime.utcnow()
    
    # Price trend alert
    history = generate_price_history(produce_type, 30)
    trends = calculate_trends(generate_price_history(produce_type, 90))
    change = trends.get("price_change_7d_pct", 0)
    
    if change > 3:
        alerts.append({
            "id": f"alert_{now.strftime('%Y%m%d')}_001",
            "type": "price_increase",
            "severity": "positive",
            "title": f"{produce_type.title()} prices up {change:.1f}% this week",
            "message": f"Current 7-day average: ₹{trends.get('moving_avg_7d', 0):,.0f}/qtl. Consider exploring buyer options.",
            "timestamp": now.isoformat(),
            "action": {"type": "navigate", "screen": "MarketIntelligence"},
            "dismissed": False
        })
    elif change < -3:
        alerts.append({
            "id": f"alert_{now.strftime('%Y%m%d')}_002",
            "type": "price_decrease",
            "severity": "warning",
            "title": f"{produce_type.title()} prices down {abs(change):.1f}%",
            "message": "Prices are declining. Consider selling soon to avoid further losses.",
            "timestamp": now.isoformat(),
            "action": {"type": "navigate", "screen": "PriceEstimator"},
            "dismissed": False
        })
    
    # New buyer alert (mock)
    alerts.append({
        "id": f"alert_{now.strftime('%Y%m%d')}_003",
        "type": "new_buyer",
        "severity": "info",
        "title": "New buyer matched within 40km",
        "message": f"A buyer in Gurgaon is looking for Grade A {produce_type}. Expected price: ₹{P_BASE.get(produce_type, 2500) * 1.05:,.0f}/qtl.",
        "timestamp": (now - datetime.timedelta(hours=2)).isoformat(),
        "action": {"type": "navigate", "screen": "BuyerMatch"},
        "dismissed": False
    })
    
    # Better market alert (mock)
    alerts.append({
        "id": f"alert_{now.strftime('%Y%m%d')}_004",
        "type": "better_market",
        "severity": "positive",
        "title": "Better market option found",
        "message": "Azadpur Mandi is offering 8% higher prices than your nearest market today.",
        "timestamp": (now - datetime.timedelta(hours=5)).isoformat(),
        "action": {"type": "navigate", "screen": "MarketMap"},
        "dismissed": False
    })
    
    # Seasonal opportunity
    alerts.append({
        "id": f"alert_{now.strftime('%Y%m%d')}_005",
        "type": "seasonal",
        "severity": "info",
        "title": "Favorable selling window",
        "message": f"Demand for {produce_type} is historically high this month. Good time to sell.",
        "timestamp": (now - datetime.timedelta(hours=12)).isoformat(),
        "action": {"type": "navigate", "screen": "PriceEstimator"},
        "dismissed": False
    })
    
    return alerts
