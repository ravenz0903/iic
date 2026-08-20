import datetime
from typing import List, Dict, Any, Optional

# In-memory mock offers store
_offers_store: List[Dict[str, Any]] = [
    {
        "id": 1, "listing_id": 1, "buyer_id": 1, "buyer_name": "Delhi Buyer #14",
        "offered_price": 2480, "asking_price": 2520, "quantity_quintals": 10,
        "status": "pending", "message": "Can we close at ₹2,480? Immediate pickup.",
        "created_at": (datetime.datetime.utcnow() - datetime.timedelta(hours=6)).isoformat()
    },
    {
        "id": 2, "listing_id": 1, "buyer_id": 2, "buyer_name": "Gurgaon Trader #7",
        "offered_price": 2550, "asking_price": 2520, "quantity_quintals": 10,
        "status": "pending", "message": "Willing to pay above asking. Need Grade A wheat urgently.",
        "created_at": (datetime.datetime.utcnow() - datetime.timedelta(hours=3)).isoformat()
    },
    {
        "id": 3, "listing_id": 2, "buyer_id": 3, "buyer_name": "Noida Wholesaler #3",
        "offered_price": 2950, "asking_price": 3100, "quantity_quintals": 25,
        "status": "rejected", "message": "Looking for bulk rice. Can you do ₹2,950?",
        "created_at": (datetime.datetime.utcnow() - datetime.timedelta(hours=12)).isoformat()
    }
]

_next_id = 4

def create_offer(listing_id: int, buyer_id: int, buyer_name: str, offered_price: float, asking_price: float, quantity: float, message: str = "") -> Dict[str, Any]:
    global _next_id
    offer = {
        "id": _next_id, "listing_id": listing_id, "buyer_id": buyer_id, "buyer_name": buyer_name,
        "offered_price": offered_price, "asking_price": asking_price, "quantity_quintals": quantity,
        "status": "pending", "message": message, "created_at": datetime.datetime.utcnow().isoformat()
    }
    _offers_store.append(offer)
    _next_id += 1
    return offer

def respond_to_offer(offer_id: int, action: str, counter_price: Optional[float] = None) -> Dict[str, Any]:
    for offer in _offers_store:
        if offer["id"] == offer_id:
            if action == "accept":
                offer["status"] = "accepted"
            elif action == "reject":
                offer["status"] = "rejected"
            elif action == "counter" and counter_price:
                offer["status"] = "countered"
                offer["counter_price"] = counter_price
            return offer
    return {"error": "Offer not found"}

def list_offers(role: str = "farmer", user_id: int = 1) -> List[Dict[str, Any]]:
    return _offers_store
