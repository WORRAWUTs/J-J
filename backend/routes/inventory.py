from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import Inventory
from backend.schemas import InventoryCreate
from backend.auth import get_current_user

router = APIRouter()

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_inventory(
    inventory: InventoryCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # ตรวจสอบว่า part_number ซ้ำหรือไม่
    existing_part = db.query(Inventory).filter(
        Inventory.part_number == inventory.part_number
    ).first()
    if existing_part:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Part number already exists"
        )

    # ตรวจสอบว่า serial_number ซ้ำหรือไม่
    existing_serial = db.query(Inventory).filter(
        Inventory.serial_number == inventory.serial_number
    ).first()
    if existing_serial:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Serial number already exists"
        )

    # สร้าง inventory ใหม่
    new_inventory = Inventory(
        type=inventory.type,
        name_product=inventory.name_product,
        part_number=inventory.part_number,
        serial_number=inventory.serial_number,
        location=inventory.location,
        sub_location=inventory.sub_location,
        status=inventory.status,
        health=inventory.health
    )

    db.add(new_inventory)
    db.commit()
    db.refresh(new_inventory)

    return new_inventory
