import os
import hashlib
import random
import datetime
import logging
from typing import Dict, Any

from schemas.quality_report import QualityReport, DefectDetail

logger = logging.getLogger(__name__)

class VisionService:
    def __init__(self):
        self.mock_mode = True
        model_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "models", "produce_seg.pt")
        try:
            from ultralytics import YOLO
            if os.path.exists(model_path):
                self.model = YOLO(model_path)
                self.mock_mode = False
                logger.info(f"Loaded YOLO model from {model_path}")
            else:
                logger.critical(f"Model not found at {model_path}, falling back to mock mode")
        except ImportError:
            logger.critical("ultralytics not installed, falling back to mock mode")

    def analyze_image(self, image_path: str, batch_id: str) -> QualityReport:
        if self.mock_mode:
            return self._mock_analysis(image_path, batch_id)
        # Real logic would go here
        return self._mock_analysis(image_path, batch_id)

    def _mock_analysis(self, image_path: str, batch_id: str) -> QualityReport:
        path_hash = int(hashlib.md5(image_path.encode()).hexdigest(), 16)
        produce_types = ["wheat", "rice", "tomato", "onion", "potato"]
        produce_type = produce_types[path_hash % len(produce_types)]
        
        defect_types = ["bruising", "discoloration", "pest_damage", "foreign_material", "mechanical_damage"]
        num_defects = random.randint(2, 4)
        selected_defects = random.sample(defect_types, num_defects)
        
        total_area = random.randint(12000, 18000)
        
        defects = []
        total_defect_area = 0
        for dtype in selected_defects:
            area = random.randint(100, 1500)
            total_defect_area += area
            defects.append(DefectDetail(
                type=dtype,
                area_pixels=area,
                severity=random.choice(["minor", "moderate", "severe"]),
                percentage=round(area / total_area * 100, 2) if total_area else 0
            ))
            
        color_uniformity = round(random.uniform(0.7, 0.98), 2)
        
        if total_area == 0:
            quality_score = 0
        else:
            defect_penalty = sum(1.0 * (d.area_pixels / total_area) for d in defects)
            quality_score = max(0, min(100, 100 * (1 - defect_penalty) * color_uniformity))
            
        if quality_score >= 85:
            grade = "A"
            handling = "Standard handling"
        elif quality_score >= 65:
            grade = "B"
            handling = "Handle with care, sell within 48h"
        elif quality_score >= 40:
            grade = "C"
            handling = "Immediate sale recommended"
        else:
            grade = "Rejected"
            handling = "Consider alternative use"
            
        logger.info(f"Mock analysis values: total_area={total_area}, defect_area={total_defect_area}, uniformity={color_uniformity}, score={quality_score}")
        
        s1 = random.uniform(10, 30)
        s2 = random.uniform(20, 50)
        s3 = 100 - s1 - s2
        size_analysis = {
            "small_pct": round(s1, 2),
            "medium_pct": round(s2, 2),
            "large_pct": round(s3, 2)
        }
        
        return QualityReport(
            batch_id=batch_id,
            produce_type=produce_type,
            quality_score=round(quality_score, 2),
            grade=grade,
            detected_defects=defects,
            defect_percentage=round(total_defect_area / total_area * 100, 2) if total_area else 0,
            total_surface_area=total_area,
            size_analysis=size_analysis,
            color_uniformity=color_uniformity,
            recommended_handling=handling,
            confidence_score=round(random.uniform(0.75, 0.95), 2),
            timestamp=datetime.datetime.utcnow().isoformat(),
            heatmap_url=f"/api/v1/scan/{batch_id}/heatmap"
        )
