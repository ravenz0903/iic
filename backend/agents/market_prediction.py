import statistics
from typing import Dict, Any
from services.market_intelligence import generate_price_history, calculate_trends

def predict_price(produce_type: str, days_ahead: int = 7) -> Dict[str, Any]:
    """Simple linear regression prediction on mock historical data."""
    history = generate_price_history(produce_type, 90)
    prices = [h["price"] for h in history]
    
    # Simple linear regression using last 30 days
    n = 30
    recent = prices[-n:]
    x_values = list(range(n))
    x_mean = sum(x_values) / n
    y_mean = sum(recent) / n
    
    numerator = sum((x - x_mean) * (y - y_mean) for x, y in zip(x_values, recent))
    denominator = sum((x - x_mean) ** 2 for x in x_values)
    
    slope = numerator / denominator if denominator != 0 else 0
    intercept = y_mean - slope * x_mean
    
    # Predict future
    predicted_price = intercept + slope * (n + days_ahead)
    current_price = prices[-1]
    price_change_pct = ((predicted_price - current_price) / current_price) * 100
    
    if price_change_pct > 2:
        direction = "rising"
        advice = f"Prices likely to increase by {price_change_pct:.1f}%. Consider waiting {days_ahead} days for better returns."
    elif price_change_pct < -2:
        direction = "falling" 
        advice = f"Prices may decrease by {abs(price_change_pct):.1f}%. Consider selling soon."
    else:
        direction = "stable"
        advice = "Prices expected to remain stable. Current time is reasonable for selling."
    
    confidence = max(0.5, min(0.9, 0.8 - abs(price_change_pct) * 0.02))
    
    return {
        "produce_type": produce_type,
        "current_price": round(current_price, 2),
        "predicted_price": round(predicted_price, 2),
        "days_ahead": days_ahead,
        "direction": direction,
        "price_change_pct": round(price_change_pct, 2),
        "confidence": round(confidence, 2),
        "advice": advice
    }
