from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from database import get_db
from schemas.batch import BatchRead, BatchUpdate
from services import batch_service

router = APIRouter(prefix="/api/v1/batches", tags=["batches"])

@router.get("", response_model=List[BatchRead])
def get_batches(farmer_id: Optional[int] = None, skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    return batch_service.list_batches(db, farmer_id=farmer_id, skip=skip, limit=limit)

@router.get("/{batch_id}", response_model=BatchRead)
def get_batch(batch_id: str, db: Session = Depends(get_db)):
    batch = batch_service.get_batch(db, batch_id)
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")
    return batch

@router.put("/{batch_id}", response_model=BatchRead)
def update_batch(batch_id: str, update_data: BatchUpdate, db: Session = Depends(get_db)):
    batch = batch_service.update_batch(
        db, 
        batch_id, 
        status=update_data.status,
        quality_score=update_data.quality_score,
        grade=update_data.grade
    )
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")
    return batch
