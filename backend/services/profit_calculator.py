from typing import Dict, Any, List

def calculate_profit(selling_price_per_qtl: float, quantity_quintals: float, distance_km: float, vehicle_type: str = "mini-truck", marketplace_fee_pct: float = 0.02, other_costs: float = 0) -> Dict[str, Any]:
    """Detailed P&L breakdown for a single transaction."""
    
    vehicle_costs = {"mini-truck": 15, "large-truck": 25, "shared-transport": 10}
    cost_per_km = vehicle_costs.get(vehicle_type, 15)
    
    gross_revenue = selling_price_per_qtl * quantity_quintals
    transport = 500 + (cost_per_km * 2 * distance_km)  # base + round trip
    marketplace_fee = gross_revenue * marketplace_fee_pct
    loading_unloading = 50 * quantity_quintals
    cess = gross_revenue * 0.01  # 1% cess
    
    total_deductions = transport + marketplace_fee + loading_unloading + cess + other_costs
    net_income = gross_revenue - total_deductions
    profit_margin = (net_income / gross_revenue * 100) if gross_revenue > 0 else 0
    
    return {
        "gross_revenue": round(gross_revenue, 2),
        "deductions": {
            "transport": round(transport, 2),
            "marketplace_fee": round(marketplace_fee, 2),
            "loading_unloading": round(loading_unloading, 2),
            "cess": round(cess, 2),
            "other_costs": round(other_costs, 2)
        },
        "total_deductions": round(total_deductions, 2),
        "net_income": round(net_income, 2),
        "profit_margin_pct": round(profit_margin, 2),
        "per_quintal": {
            "selling_price": selling_price_per_qtl,
            "net_per_quintal": round(net_income / quantity_quintals, 2) if quantity_quintals > 0 else 0
        }
    }

def compare_scenarios(scenarios: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Compare multiple selling scenarios."""
    results = []
    for scenario in scenarios:
        result = calculate_profit(**scenario)
        result["scenario"] = scenario
        results.append(result)
    results.sort(key=lambda x: x["net_income"], reverse=True)
    return results
