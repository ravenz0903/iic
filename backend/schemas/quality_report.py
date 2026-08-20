from pydantic import BaseModel
from typing import List, Dict, Optional

class DefectDetail(BaseModel):
    type: str
    area_pixels: int
    severity: str
    percentage: float

class QualityReport(BaseModel):
    batch_id: str
    produce_type: str
    quality_score: float
    grade: str
    detected_defects: List[DefectDetail]
    defect_percentage: float
    total_surface_area: int
    size_analysis: Dict[str, float]
    color_uniformity: float
    recommended_handling: str
    confidence_score: float
    timestamp: str
    heatmap_url: Optional[str] = None
