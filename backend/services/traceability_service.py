import datetime
from typing import Dict, Any, List

def get_batch_timeline(batch_id: str) -> List[Dict[str, Any]]:
    """Returns ordered list of events for a batch."""
    now = datetime.datetime.utcnow()
    
    # Generate realistic mock timeline
    timeline = [
        {
            "step": 1,
            "status": "scanned",
            "label": "Quality Scanned",
            "timestamp": (now - datetime.timedelta(hours=48)).isoformat(),
            "location": "Farm - Sonipat, Haryana",
            "actor": "Farmer",
            "details": "AI quality assessment completed. Grade A, Score: 88.5",
            "completed": True
        },
        {
            "step": 2,
            "status": "listed",
            "label": "Listed for Sale",
            "timestamp": (now - datetime.timedelta(hours=44)).isoformat(),
            "location": "Platform",
            "actor": "System",
            "details": "Listed on marketplace at ₹2,520/qtl. 3 buyer inquiries received.",
            "completed": True
        },
        {
            "step": 3,
            "status": "offer_received",
            "label": "Offer Accepted",
            "timestamp": (now - datetime.timedelta(hours=36)).isoformat(),
            "location": "Platform",
            "actor": "Buyer - Delhi Buyer #14",
            "details": "Offer of ₹2,480/qtl accepted. Transaction ID: TXN-2026-0042",
            "completed": True
        },
        {
            "step": 4,
            "status": "in_transit",
            "label": "In Transit",
            "timestamp": (now - datetime.timedelta(hours=12)).isoformat(),
            "location": "En route to Azadpur Mandi",
            "actor": "Transport - Mini Truck",
            "details": "Pickup completed. Estimated arrival in 3 hours.",
            "completed": True
        },
        {
            "step": 5,
            "status": "delivered",
            "label": "Delivered",
            "timestamp": None,
            "location": "Azadpur Mandi, Delhi",
            "actor": "Pending",
            "details": "Awaiting delivery confirmation",
            "completed": False
        },
        {
            "step": 6,
            "status": "payment",
            "label": "Payment Settled",
            "timestamp": None,
            "location": "Platform",
            "actor": "Pending",
            "details": "Payment will be processed after delivery confirmation",
            "completed": False
        }
    ]
    
    return timeline

def get_batch_certificate(batch_id: str) -> Dict[str, Any]:
    """Generate a digital traceability certificate."""
    now = datetime.datetime.utcnow()
    
    return {
        "certificate_id": f"CERT-{batch_id}",
        "batch_id": batch_id,
        "issue_date": now.isoformat(),
        "chain_of_custody": [
            {"stage": "Farm", "entity": "Rajesh Kumar, Sonipat", "date": (now - datetime.timedelta(days=2)).strftime("%Y-%m-%d")},
            {"stage": "Quality Check", "entity": "AI Produce Intelligence Platform", "date": (now - datetime.timedelta(days=2)).strftime("%Y-%m-%d")},
            {"stage": "Market", "entity": "Azadpur Mandi, Delhi", "date": (now - datetime.timedelta(days=1)).strftime("%Y-%m-%d")},
            {"stage": "Buyer", "entity": "Delhi Buyer #14", "date": now.strftime("%Y-%m-%d")}
        ],
        "quality_summary": {
            "grade": "A",
            "score": 88.5,
            "defect_pct": 5.2,
            "confidence": 0.89
        },
        "produce": {
            "type": "Wheat",
            "quantity": "10 quintals",
            "variety": "HD-2967"
        },
        "verification": "Digitally verified by AI Produce Intelligence Platform",
        "qr_data": f"https://agriproduce.ai/verify/{batch_id}"
    }
