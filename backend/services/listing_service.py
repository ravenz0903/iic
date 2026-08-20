import datetime
import random
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from models.listing import Listing
from models.batch import Batch

def create_listing(db: Session, batch_id: str, asking_price: float, available_date: str) -> Listing:
    listing = Listing(
        batch_id=batch_id,
        asking_price=asking_price,
        available_date=available_date,
        status="active",
        created_at=datetime.datetime.utcnow()
    )
    db.add(listing)
    db.commit()
    db.refresh(listing)
    return listing

def search_listings(db: Session, produce_type: Optional[str] = None, min_grade: Optional[str] = None, min_quantity: Optional[float] = None, max_distance_km: Optional[float] = None, price_min: Optional[float] = None, price_max: Optional[float] = None, skip: int = 0, limit: int = 20) -> List[Dict[str, Any]]:
    """Search listings with filters. Returns mock enriched data for now."""
    # Mock listings data
    mock_listings = [
        {
            "id": 1, "batch_id": "BATCH#WH-2026-0820-0042", "produce_type": "wheat", "quantity_quintals": 10,
            "grade": "A", "quality_score": 88.5, "asking_price": 2520, "available_date": "2026-08-22",
            "farmer_name": "Rajesh Kumar", "farmer_location": "Sonipat, Haryana", "distance_km": 45,
            "status": "active", "reliability_score": 4.2, "created_at": datetime.datetime.utcnow().isoformat()
        },
        {
            "id": 2, "batch_id": "BATCH#RI-2026-0819-0018", "produce_type": "rice", "quantity_quintals": 25,
            "grade": "A", "quality_score": 91.2, "asking_price": 3100, "available_date": "2026-08-21",
            "farmer_name": "Suresh Yadav", "farmer_location": "Karnal, Haryana", "distance_km": 80,
            "status": "active", "reliability_score": 4.5, "created_at": datetime.datetime.utcnow().isoformat()
        },
        {
            "id": 3, "batch_id": "BATCH#WH-2026-0818-0035", "produce_type": "wheat", "quantity_quintals": 50,
            "grade": "B", "quality_score": 72.3, "asking_price": 2180, "available_date": "2026-08-20",
            "farmer_name": "Mohan Singh", "farmer_location": "Panipat, Haryana", "distance_km": 60,
            "status": "active", "reliability_score": 3.8, "created_at": datetime.datetime.utcnow().isoformat()
        },
        {
            "id": 4, "batch_id": "BATCH#TM-2026-0820-0009", "produce_type": "tomato", "quantity_quintals": 8,
            "grade": "A", "quality_score": 85.7, "asking_price": 3800, "available_date": "2026-08-21",
            "farmer_name": "Amit Sharma", "farmer_location": "Ghaziabad, UP", "distance_km": 30,
            "status": "active", "reliability_score": 4.0, "created_at": datetime.datetime.utcnow().isoformat()
        },
        {
            "id": 5, "batch_id": "BATCH#ON-2026-0819-0022", "produce_type": "onion", "quantity_quintals": 100,
            "grade": "B", "quality_score": 68.4, "asking_price": 2350, "available_date": "2026-08-23",
            "farmer_name": "Vikram Jat", "farmer_location": "Alwar, Rajasthan", "distance_km": 120,
            "status": "active", "reliability_score": 3.5, "created_at": datetime.datetime.utcnow().isoformat()
        }
    ]
    
    results = mock_listings
    if produce_type:
        results = [l for l in results if l["produce_type"] == produce_type.lower()]
    if min_grade:
        grade_order = {"A": 3, "B": 2, "C": 1, "Rejected": 0}
        min_val = grade_order.get(min_grade, 0)
        results = [l for l in results if grade_order.get(l["grade"], 0) >= min_val]
    if min_quantity:
        results = [l for l in results if l["quantity_quintals"] >= min_quantity]
    if price_min:
        results = [l for l in results if l["asking_price"] >= price_min]
    if price_max:
        results = [l for l in results if l["asking_price"] <= price_max]
    
    return results[skip:skip+limit]

def get_listing(listing_id: int) -> Optional[Dict[str, Any]]:
    listings = search_listings(None)
    for l in listings:
        if l["id"] == listing_id:
            return l
    return None
