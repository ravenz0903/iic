from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from agents.copilot import AgriCopilot
from agents.decision_agent import get_best_decision
from agents.alert_agent import generate_alerts

router = APIRouter(prefix="/api/v1", tags=["copilot"])
copilot = AgriCopilot()

class CopilotQuery(BaseModel):
    query: str
    context: Optional[Dict[str, Any]] = None

class DecisionRequest(BaseModel):
    produce_type: str = "wheat"
    grade: str = "A"
    quality_score: float = 88.5
    quantity_quintals: float = 10.0
    farmer_lat: float = 28.6139
    farmer_lon: float = 77.2090

@router.post("/copilot/ask")
def ask_copilot(request: CopilotQuery):
    return copilot.ask(request.query, request.context)

@router.get("/copilot/suggestions")
def get_suggestions():
    return copilot.get_proactive_suggestions()

@router.post("/copilot/decision")
def get_decision(request: DecisionRequest):
    return get_best_decision(
        request.produce_type, request.grade, request.quality_score,
        request.quantity_quintals, request.farmer_lat, request.farmer_lon
    )

@router.get("/alerts")
def get_alerts(produce_type: str = "wheat"):
    return generate_alerts(produce_type)

@router.put("/alerts/{alert_id}/dismiss")
def dismiss_alert(alert_id: str):
    return {"message": f"Alert {alert_id} dismissed", "dismissed": True}
