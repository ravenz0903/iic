from typing import Dict, Any
from services.price_engine import estimate_price
from services.market_intelligence import compare_markets, calculate_trends, generate_price_history
from agents.market_prediction import predict_price

def get_best_decision(produce_type: str, grade: str, quality_score: float, quantity_quintals: float, farmer_lat: float, farmer_lon: float) -> Dict[str, Any]:
    """Composite decision engine that combines all signals into a single recommendation."""
    
    # Get all data
    price_est = estimate_price(produce_type, grade, quantity_quintals, farmer_lat, farmer_lon)
    markets = compare_markets(produce_type, grade, farmer_lat, farmer_lon, quantity_quintals)
    prediction = predict_price(produce_type, 7)
    trends = calculate_trends(generate_price_history(produce_type, 90))
    
    best_market = markets[0] if markets else None
    nearest_market = min(markets, key=lambda m: m["distance_km"]) if markets else None
    
    # Calculate baseline (sell now at nearest)
    baseline_net = nearest_market["net_earnings"] if nearest_market else 0
    best_net = best_market["net_earnings"] if best_market else 0
    advantage = best_net - baseline_net
    
    # Timing signal
    if prediction["direction"] == "rising" and prediction["price_change_pct"] > 3:
        timing = "wait"
        timing_detail = f"Prices predicted to rise {prediction['price_change_pct']:.1f}% in {prediction['days_ahead']} days"
    elif prediction["direction"] == "falling":
        timing = "sell_now"
        timing_detail = f"Prices may drop {abs(prediction['price_change_pct']):.1f}% — sell immediately"
    else:
        timing = "sell_now"
        timing_detail = "Prices stable — no strong reason to delay"
    
    # Composite confidence
    confidence = round((price_est["confidence"] + prediction["confidence"]) / 2, 2)
    
    # Build recommendation
    recommendation = {
        "action": timing,
        "best_market": best_market,
        "expected_net": best_net,
        "baseline_net": baseline_net,
        "advantage_over_nearest": round(advantage, 2),
        "timing_advice": timing_detail,
        "price_prediction": prediction,
        "confidence": confidence,
        "summary": ""
    }
    
    if timing == "wait":
        recommendation["summary"] = f"HOLD: Wait {prediction['days_ahead']} days. Predicted net at {best_market['name']}: ₹{best_net * (1 + prediction['price_change_pct']/100):,.0f}"
    else:
        recommendation["summary"] = f"SELL NOW at {best_market['name']} for ₹{best_net:,.0f} net. This is ₹{advantage:,.0f} more than your nearest market."
    
    return recommendation
