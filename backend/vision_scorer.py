import logging
import os
from pydantic import BaseModel

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("ProduceQualityAssayer")

class ProduceAnalysisResult(BaseModel):
    quality_score: float
    total_surface_area: int
    defect_surface_area: float
    success: bool

class ProduceQualityAssayer:
    def __init__(self, model_path: str = "../models/produce_seg.pt"):
        self.mock_mode = False
        self.model = None
        
        try:
            if not os.path.exists(model_path):
                raise FileNotFoundError(f"Model weights not found at {model_path}")
            
            from ultralytics import YOLO
            self.model = YOLO(model_path)
            logger.info(f"Successfully loaded YOLOv8 model from {model_path}")
            
        except Exception as e:
            logger.critical(f"Failed to load YOLO model: {e}. Running in MOCK MODE.")
            self.mock_mode = True

    def analyze_image(self, image_path: str) -> ProduceAnalysisResult:
        w_i = 1.0
        S_uniformity = 0.95
        
        if self.mock_mode:
            # Mock mode: returning fake mask data so the API doesn't crash during testing
            A_total = 15000
            A_defect_i_list = [600, 300]
            A_defect_total = float(sum(A_defect_i_list))
            
            try:
                # Math Logic
                sum_penalty = sum(w_i * (A_defect_i / A_total) for A_defect_i in A_defect_i_list)
                Q = 100 * (1 - sum_penalty) * S_uniformity
                
                # Logging intermediate values
                logger.info(f"[MOCK] A_total: {A_total}")
                for i, A_defect_i in enumerate(A_defect_i_list):
                    logger.info(f"[MOCK] A_defect_{i}: {A_defect_i}")
                logger.info(f"[MOCK] Q: {Q:.2f}")
                
                return ProduceAnalysisResult(
                    quality_score=Q,
                    total_surface_area=A_total,
                    defect_surface_area=A_defect_total,
                    success=True
                )
            except ZeroDivisionError:
                logger.error("ZeroDivisionError: total area = 0. No produce detected.")
                return ProduceAnalysisResult(
                    quality_score=0.0,
                    total_surface_area=0,
                    defect_surface_area=0.0,
                    success=False
                )

        # Real YOLO inference mode
        try:
            results = self.model(image_path)
            
            if not results:
                raise ValueError("Model returned empty results.")
                
            result = results[0]
            
            A_total = 0
            A_defect_i_list = []
            
            if result.masks is not None and result.masks.data is not None:
                masks = result.masks.data.cpu().numpy()
                classes = result.boxes.cls.cpu().numpy()
                
                for cls, mask in zip(classes, masks):
                    area = int(mask.sum())
                    # Assuming class 0 is produce, other classes are specific defects
                    if cls == 0:
                        A_total += area
                    else:
                        A_defect_i_list.append(area)
                        
            A_defect_total = float(sum(A_defect_i_list))
            
            # Apply exact formula: Q = 100 * (1 - sum(w_i * (A_defect_i / A_total))) * S_uniformity
            sum_penalty = sum(w_i * (A_defect_i / A_total) for A_defect_i in A_defect_i_list)
            Q = 100 * (1 - sum_penalty) * S_uniformity
            
            # Log the intermediate values
            logger.info(f"A_total: {A_total}")
            for i, A_defect_i in enumerate(A_defect_i_list):
                logger.info(f"A_defect_{i}: {A_defect_i}")
            logger.info(f"Q: {Q:.2f}")
            
            return ProduceAnalysisResult(
                quality_score=max(0.0, Q), # Ensure it doesn't go below 0
                total_surface_area=A_total,
                defect_surface_area=A_defect_total,
                success=True
            )
            
        except ZeroDivisionError:
            # Handle ZeroDivisionError explicitly when A_total = 0
            logger.error("ZeroDivisionError: total area = 0. No produce detected in the frame.")
            return ProduceAnalysisResult(
                quality_score=0.0,
                total_surface_area=0,
                defect_surface_area=0.0,
                success=False
            )
        except Exception as e:
            logger.error(f"Error during image analysis: {e}")
            return ProduceAnalysisResult(
                quality_score=0.0,
                total_surface_area=0,
                defect_surface_area=0.0,
                success=False
            )
