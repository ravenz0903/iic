from typing import List, Dict, Any

def calculate_best_market(batch_weight_quintals: float, quality_score: float, vehicle_type: str) -> List[Dict[str, Any]]:
    """
    Calculates the True Net Realization (R_net) for nearby mandis and returns them sorted by profitability.
    """
    # Mock data for nearby mandis
    mandis = [
        {
            "id": "market_a",
            "name": "Market A",
            "distance_km": 15.0,
            "base_price_per_quintal": 2800.0,
            "toll_fees": 120.0,
            "loading_charge": 40.0,
            "cess_percent": 0.02  # 2%
        },
        {
            "id": "market_b",
            "name": "Market B",
            "distance_km": 40.0,
            "base_price_per_quintal": 3100.0,
            "toll_fees": 300.0,
            "loading_charge": 50.0,
            "cess_percent": 0.015 # 1.5%
        },
        {
            "id": "market_c",
            "name": "Market C",
            "distance_km": 8.0,
            "base_price_per_quintal": 2650.0,
            "toll_fees": 0.0,
            "loading_charge": 35.0,
            "cess_percent": 0.01  # 1%
        }
    ]

    # Constants
    C_base = 500.0
    
    # Determine cost per km based on vehicle type
    if vehicle_type.lower() == 'large-truck':
        C_km = 25.0
    else:  # Defaults to mini-truck
        C_km = 15.0

    W_batch = batch_weight_quintals
    Q = quality_score
    
    # Ensure W_batch is not zero to prevent ZeroDivisionError
    if W_batch <= 0:
        raise ValueError("Batch weight must be greater than zero")

    results = []
    
    for mandi in mandis:
        d = mandi['distance_km']
        C_toll = mandi['toll_fees']
        C_loading = mandi['loading_charge']
        r_cess = mandi['cess_percent']
        base_price = mandi['base_price_per_quintal']
        
        # P_mandi(Q) = base_price * (Q / 100)
        P_mandi_Q = base_price * (Q / 100.0)
        
        # Calculate deduction components
        # (C_base + (C_km * 2 * d) + C_toll) / W_batch
        transportation_cost = (C_base + (C_km * 2 * d) + C_toll) / W_batch
        
        # P_mandi * r_cess (Assuming cess is calculated on realized price)
        cess_cost = P_mandi_Q * r_cess
        
        total_deductions = transportation_cost + C_loading + cess_cost
        
        # R_net = P_mandi(Q) - [ deductions ]
        R_net = P_mandi_Q - total_deductions
        
        # Compile result
        result = mandi.copy()
        result['r_net'] = round(R_net, 2)
        result['realized_price'] = round(P_mandi_Q, 2)
        result['deductions'] = round(total_deductions, 2)
        
        results.append(result)
        
    # Sort by R_net in descending order (most profitable first)
    results.sort(key=lambda x: x['r_net'], reverse=True)
    
    return results
