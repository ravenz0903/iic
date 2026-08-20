import random
from datetime import datetime
from sqlalchemy.orm import Session
from models.batch import Batch
from schemas.batch import BatchCreate

def generate_batch_id(produce_type: str) -> str:
    type_code = produce_type[:2].upper()
    now = datetime.utcnow()
    yyyy = now.strftime("%Y")
    mmdd = now.strftime("%m%d")
    seq = f"{random.randint(0, 9999):04d}"
    return f"BATCH#{type_code}-{yyyy}-{mmdd}-{seq}"

def create_batch(db: Session, farmer_id: int, produce_type: str, quantity: float) -> Batch:
    batch_id = generate_batch_id(produce_type)
    db_batch = Batch(
        id=batch_id,
        farmer_id=farmer_id,
        produce_type=produce_type,
        quantity_quintals=quantity,
        status="scanned"
    )
    db.add(db_batch)
    db.commit()
    db.refresh(db_batch)
    return db_batch

def get_batch(db: Session, batch_id: str) -> Batch:
    return db.query(Batch).filter(Batch.id == batch_id).first()

def list_batches(db: Session, farmer_id: int = None, skip: int = 0, limit: int = 20):
    query = db.query(Batch)
    if farmer_id is not None:
        query = query.filter(Batch.farmer_id == farmer_id)
    return query.offset(skip).limit(limit).all()

def update_batch(db: Session, batch_id: str, **kwargs) -> Batch:
    batch = get_batch(db, batch_id)
    if not batch:
        return None
    for key, value in kwargs.items():
        if hasattr(batch, key) and value is not None:
            setattr(batch, key, value)
    db.commit()
    db.refresh(batch)
    return batch
