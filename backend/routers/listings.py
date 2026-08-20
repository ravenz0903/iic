from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from typing import Optional, List
from sqlalchemy.orm import Session
from database import get_db
from services.listing_service import create_listing, search_listings, get_listing

router = APIRouter(prefix="/api/v1", tags=["listings"])

class ListingCreateRequest(BaseModel):
    batch_id: str
    asking_price: float
    available_date: str

@router.post("/listings")
def create_new_listing(request: ListingCreateRequest, db: Session = Depends(get_db)):
    listing = create_listing(db, request.batch_id, request.asking_price, request.available_date)
    return {"id": listing.id, "batch_id": listing.batch_id, "asking_price": listing.asking_price, "status": listing.status}

@router.get("/listings")
def get_listings(
    produce_type: Optional[str] = None,
    min_grade: Optional[str] = None,
    min_quantity: Optional[float] = None,
    price_min: Optional[float] = None,
    price_max: Optional[float] = None,
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    return search_listings(db, produce_type, min_grade, min_quantity, None, price_min, price_max, skip, limit)

@router.get("/listings/{listing_id}")
def listing_detail(listing_id: int):
    result = get_listing(listing_id)
    if not result:
        return {"error": "Listing not found"}
    return result
