from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import Warranty
from backend.schemas import WarrantySchema

router = APIRouter()

@router.post("/")
def create_warranty(warranty: WarrantySchema, db: Session = Depends(get_db)):
    new_warranty = Warranty(**warranty.dict())
    db.add(new_warranty)
    db.commit()
    db.refresh(new_warranty)
    return new_warranty

@router.get("/{warranty_id}")
def read_warranty(warranty_id: int, db: Session = Depends(get_db)):
    warranty = db.query(Warranty).filter(Warranty.id == warranty_id).first()
    if not warranty:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Warranty not found")
    return warranty