from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from services.offer_service import create_offer, respond_to_offer, list_offers

router = APIRouter(prefix="/api/v1", tags=["offers"])

class OfferCreateRequest(BaseModel):
    listing_id: int
    buyer_id: int = 1
    buyer_name: str = "Buyer"
    offered_price: float
    asking_price: float
    quantity_quintals: float
    message: str = ""

class OfferResponseRequest(BaseModel):
    action: str  # accept, reject, counter
    counter_price: Optional[float] = None

@router.post("/offers")
def make_offer(request: OfferCreateRequest):
    return create_offer(request.listing_id, request.buyer_id, request.buyer_name, request.offered_price, request.asking_price, request.quantity_quintals, request.message)

@router.put("/offers/{offer_id}")
def respond_offer(offer_id: int, request: OfferResponseRequest):
    return respond_to_offer(offer_id, request.action, request.counter_price)

@router.get("/offers")
def get_offers(role: str = "farmer"):
    return list_offers(role)
