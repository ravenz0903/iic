import logging
from datetime import datetime
import random
from typing import Dict, Any

logger = logging.getLogger(__name__)

P_BASE = {
    "wheat": 2500,
    "rice": 3200,
    "tomato": 4000,
    "onion": 2800,
    "potato": 1800
}

Q_FACTOR = {
    "A": 1.0,
    "B": 0.85,
    "C": 0.65,
    "Rejected": 0.30
}

def get_seasonal_factor(produce_type: str, month: int) -> float:
    # Define peak months for each produce
    peak_months = {
        "wheat": [11, 12, 1, 2],
        "rice": [10, 11, 12, 1],
        "tomato": [6, 7, 8],
        "onion": [3, 4, 5, 10, 11],
        "potato": [2, 3, 4, 10, 11]
    }
    shoulder_months = {
        "wheat": [3, 4, 10],
        "rice": [9, 2],
        "tomato": [5, 9],
        "onion": [2, 6, 9, 12],
        "potato": [1, 5, 9, 12]
    }
    
    peaks = peak_months.get(produce_type.lower(), [])
    shoulders = shoulder_months.get(produce_type.lower(), [])
    
    if month in peaks:
        return 1.10
    elif month in shoulders:
        return 1.00
    else:
        return 0.90

def estimate_price(produce_type: str, grade: str, quantity_quintals: float, farmer_lat: float, farmer_lon: float) -> Dict[str, Any]:
    p_base = P_BASE.get(produce_type.lower(), 2500)
    q_factor = Q_FACTOR.get(grade, 0.65)
    
    current_month = datetime.now().month
    s_seasonal = get_seasonal_factor(produce_type, current_month)
    
    d_demand = round(random.uniform(0.92, 1.08), 3)
    
    p_estimated = p_base * q_factor * s_seasonal * d_demand
    
    min_price = p_estimated * 0.92
    max_price = p_estimated * 1.08
    
    logger.info(f"Price calculation for {produce_type} (Grade {grade}): Base={p_base}, Q={q_factor}, S={s_seasonal}, D={d_demand} -> Estimated={p_estimated}")
    
    return {
        "estimated_price_per_quintal": round(p_estimated, 2),
        "price_range": {
            "min": round(min_price, 2),
            "max": round(max_price, 2)
        },
        "confidence": round(random.uniform(0.7, 0.9), 2),
        "contributing_factors": {
            "base_price": p_base,
            "quality_multiplier": q_factor,
            "seasonal_multiplier": s_seasonal,
            "demand_multiplier": d_demand
        },
        "produce_type": produce_type,
        "grade": grade
    }
