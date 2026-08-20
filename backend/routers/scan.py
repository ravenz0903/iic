import os
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, Body
from sqlalchemy.orm import Session
from pydantic import BaseModel
import json

from database import get_db
from services import batch_service
from services.vision_service import VisionService
from schemas.quality_report import QualityReport

router = APIRouter(prefix="/api/v1", tags=["scan"])
vision_service = VisionService()

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "uploads")

class ScanRequest(BaseModel):
    farmer_id: int = 1
    produce_type: str = "wheat"
    quantity_quintals: float = 10.0

@router.post("/scan", response_model=QualityReport)
def scan_produce(
    request: ScanRequest,
    db: Session = Depends(get_db)
):
    """Scan produce and generate quality report. Accepts JSON body."""
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    batch = batch_service.create_batch(db, request.farmer_id, request.produce_type, request.quantity_quintals)
    
    image_path = "mock_path.jpg"
            
    report = vision_service.analyze_image(image_path, batch.id)
    
    batch_service.update_batch(
        db, 
        batch.id, 
        quality_score=report.quality_score, 
        grade=report.grade,
        scan_image_path=None,
        defects_json=json.dumps([d.model_dump() for d in report.detected_defects])
    )
    
    return report

@router.post("/scan/upload", response_model=QualityReport)
async def scan_produce_with_image(
    farmer_id: int = 1,
    produce_type: str = "wheat",
    quantity_quintals: float = 10.0,
    image: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    """Scan produce with image upload. Accepts multipart/form-data."""
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    batch = batch_service.create_batch(db, farmer_id, produce_type, quantity_quintals)
    
    image_path = "mock_path.jpg"
    if image:
        image_path = os.path.join(UPLOAD_DIR, f"{batch.id}.jpg")
        with open(image_path, "wb") as f:
            content = await image.read()
            f.write(content)
            
    report = vision_service.analyze_image(image_path, batch.id)
    
    batch_service.update_batch(
        db, 
        batch.id, 
        quality_score=report.quality_score, 
        grade=report.grade,
        scan_image_path=image_path if image else None,
        defects_json=json.dumps([d.model_dump() for d in report.detected_defects])
    )
    
    return report

@router.get("/scan/{batch_id}/heatmap")
def get_heatmap(batch_id: str):
    return {"message": "Heatmap not yet generated for this batch", "batch_id": batch_id}
