from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import Test
from backend.schemas import TestCreate

router = APIRouter()

@router.post("/")
def create_test(test: TestCreate, db: Session = Depends(get_db)):
    new_test = Test(**test.dict())
    db.add(new_test)
    db.commit()
    db.refresh(new_test)
    return new_test

@router.get("/{test_id}")
def read_test(test_id: int, db: Session = Depends(get_db)):
    test = db.query(Test).filter(Test.id == test_id).first()
    if not test:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Test not found")
    return test