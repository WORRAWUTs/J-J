from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from .. import models, schemas, auth
from ..database import get_db
import os
import shutil
from datetime import datetime

router = APIRouter(
    prefix="/inventory",
    tags=["inventory"],
    responses={404: {"description": "Not found"}},
)

# Get all inventory items with filtering
@router.get("/", response_model=List[schemas.InventoryResponse])
def get_inventory(
    location: Optional[str] = None,
    type: Optional[str] = None,
    name: Optional[str] = None,
    part_number: Optional[str] = None,
    serial_number: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    query = db.query(models.Inventory)
    
    # Apply filters if provided
    if location:
        query = query.filter(models.Inventory.location == location)
    if type:
        query = query.filter(models.Inventory.type == type)
    if name:
        query = query.filter(models.Inventory.name_product.like(f"%{name}%"))
    if part_number:
        query = query.filter(models.Inventory.part_number.like(f"%{part_number}%"))
    if serial_number:
        query = query.filter(models.Inventory.serial_number.like(f"%{serial_number}%"))
    
    items = query.offset(skip).limit(limit).all()
    return items

# Search inventory
@router.get("/search/", response_model=List[schemas.InventoryResponse])
def search_inventory(
    query: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    search = f"%{query}%"
    items = db.query(models.Inventory).filter(
        models.Inventory.name_product.like(search) |
        models.Inventory.part_number.like(search) |
        models.Inventory.serial_number.like(search) |
        models.Inventory.type.like(search) |
        models.Inventory.location.like(search) |
        models.Inventory.sub_location.like(search)
    ).all()
    
    return items

# Get inventory by location
@router.get("/location/{location}", response_model=List[schemas.InventoryResponse])
def get_inventory_by_location(
    location: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    items = db.query(models.Inventory).filter(models.Inventory.location == location).all()
    return items

# Get inventory by ID
@router.get("/{part_id}", response_model=schemas.InventoryResponse)
def get_inventory_item(
    part_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    item = db.query(models.Inventory).filter(models.Inventory.part_id == part_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    return item

# Add new inventory item (logistic or admin)
@router.post("/", response_model=schemas.InventoryResponse, status_code=status.HTTP_201_CREATED)
def create_inventory_item(
    item: schemas.InventoryCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_user_with_role("logistic"))
):
    # Check if serial number already exists
    existing_item = db.query(models.Inventory).filter(
        models.Inventory.serial_number == item.serial_number
    ).first()
    
    if existing_item:
        raise HTTPException(status_code=400, detail="Serial number already exists")
    
    # Create new inventory item
    db_item = models.Inventory(
        type=item.type,
        name_product=item.name_product,
        part_number=item.part_number,
        serial_number=item.serial_number,
        location=item.location,
        sub_location=item.sub_location,
        status="Pending test"
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    
    # Log activity
    activity_log = models.ActivityLog(
        user_id=current_user.user_id,
        action="ADD_INVENTORY",
        details=f"Added {item.type} - {item.name_product} to inventory at {item.location}"
    )
    db.add(activity_log)
    db.commit()
    
    return db_item

# Send item for engineering test
@router.post("/{part_id}/engineer-test", status_code=status.HTTP_200_OK)
def send_for_engineering_test(
    part_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_user_with_role("logistic"))
):
    # Check if part exists
    part = db.query(models.Inventory).filter(models.Inventory.part_id == part_id).first()
    if not part:
        raise HTTPException(status_code=404, detail="Part not found")
    
    # Find engineers to notify
    engineers = db.query(models.User).filter(models.User.role == "engineer", models.User.is_deleted == False).all()
    
    if not engineers:
        raise HTTPException(status_code=404, detail="No engineers found to notify")
    
    # Create notification for each engineer
    for engineer in engineers:
        notification = models.Notification(
            user_id=engineer.user_id,
            message=f"You have a {part.type} to test click here"
        )
        db.add(notification)
    
    db.commit()
    
    # Log activity
    activity_log = models.ActivityLog(
        user_id=current_user.user_id,
        action="SEND_FOR_TEST",
        details=f"Sent {part.type} - {part.name_product} for engineering test"
    )
    db.add(activity_log)
    db.commit()
    
    return {"message": "Part sent for engineering test"}

# Update inventory status (engineer or admin)
@router.put("/{part_id}/status", response_model=schemas.InventoryResponse)
def update_inventory_status(
    part_id: int,
    health: str = Form(...),
    status: str = Form(...),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_user_with_role("engineer"))
):
    # Check if part exists
    part = db.query(models.Inventory).filter(models.Inventory.part_id == part_id).first()
    if not part:
        raise HTTPException(status_code=404, detail="Part not found")
    
    # Save file if provided
    file_path = None
    if file:
        # Create uploads directory if it doesn't exist
        upload_dir = "uploads/test_files"
        os.makedirs(upload_dir, exist_ok=True)
        
        # Generate unique filename
        file_extension = file.filename.split(".")[-1]
        filename = f"part_{part_id}_{datetime.now().strftime('%Y%m%d%H%M%S')}.{file_extension}"
        file_path = os.path.join(upload_dir, filename)
        
        # Save file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    
    # Create test record
    test = models.Test(
        part_id=part_id,
        name=f"Test for {part.name_product}",
        description=f"Test performed by {current_user.first_name} {current_user.last_name}",
        result=status,
        attachment_path=file_path,
        tested_by=current_user.user_id
    )
    db.add(test)
    
    # Create status log
    status_log = models.StatusLog(
        part_id=part_id,
        status_before=part.status,
        status_after=status,
        updated_by=current_user.user_id
    )
    db.add(status_log)
    
    # Update part status and health
    previous_status = part.status
    part.status = status
    part.health = health
    db.commit()
    db.refresh(part)
    
    # Notify logistics
    logistics = db.query(models.User).filter(models.User.role == "logistic", models.User.is_deleted == False).all()
    
    if logistics:
        for logistic in logistics:
            notification = models.Notification(
                user_id=logistic.user_id,
                message=f"{part.type} test completed click here"
            )
            db.add(notification)
        
        db.commit()
    
    # Log activity
    activity_log = models.ActivityLog(
        user_id=current_user.user_id,
        action="UPDATE_STATUS",
        details=f"Updated status of {part.type} - {part.name_product} from {previous_status} to {status}"
    )
    db.add(activity_log)
    db.commit()
    
    return part

# Delete inventory item (admin only)
@router.delete("/{part_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_inventory_item(
    part_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_user_with_role("admin"))
):
    part = db.query(models.Inventory).filter(models.Inventory.part_id == part_id).first()
    if not part:
        raise HTTPException(status_code=404, detail="Part not found")
    
    # Log before deletion
    activity_log = models.ActivityLog(
        user_id=current_user.user_id,
        action="DELETE_INVENTORY",
        details=f"Deleted {part.type} - {part.name_product} from inventory"
    )
    db.add(activity_log)
    
    # Delete the item
    db.delete(part)
    db.commit()
    
    return {"message": "Part deleted successfully"}

# Get all inventory items
@router.get("/items", response_model=List[schemas.InventoryResponse])
def get_inventory_items(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    items = db.query(models.InventoryItem).filter(
        models.InventoryItem.is_deleted == False
    ).offset(skip).limit(limit).all()
    return items

# Get inventory item by ID
@router.get("/items/{item_id}", response_model=schemas.InventoryResponse)
def get_inventory_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    item = db.query(models.InventoryItem).filter(
        models.InventoryItem.item_id == item_id,
        models.InventoryItem.is_deleted == False
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item

# Create new inventory item (admin/staff only)
@router.post("/items", response_model=schemas.InventoryResponse)
def create_inventory_item(
    item: schemas.InventoryCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_user_with_role(["admin", "staff"]))
):
    db_item = models.InventoryItem(
        name=item.name,
        description=item.description,
        quantity=item.quantity,
        unit_price=item.unit_price,
        category=item.category,
        created_by=current_user.user_id
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    
    # Log activity
    activity_log = models.ActivityLog(
        user_id=current_user.user_id,
        action="CREATE_INVENTORY_ITEM",
        details=f"Created new inventory item: {item.name}"
    )
    db.add(activity_log)
    db.commit()
    
    return db_item

# Update inventory item (admin/staff only)
@router.put("/items/{item_id}", response_model=schemas.InventoryResponse)
def update_inventory_item(
    item_id: int,
    item_update: schemas.InventoryUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_user_with_role(["admin", "staff"]))
):
    db_item = db.query(models.InventoryItem).filter(
        models.InventoryItem.item_id == item_id,
        models.InventoryItem.is_deleted == False
    ).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    # Update item
    for key, value in item_update.dict(exclude_unset=True).items():
        setattr(db_item, key, value)
    
    db_item.last_modified_by = current_user.user_id
    db.commit()
    db.refresh(db_item)
    
    # Log activity
    activity_log = models.ActivityLog(
        user_id=current_user.user_id,
        action="UPDATE_INVENTORY_ITEM",
        details=f"Updated inventory item: {db_item.name}"
    )
    db.add(activity_log)
    db.commit()
    
    return db_item

# Delete inventory item (soft delete, admin only)
@router.delete("/items/{item_id}")
def delete_inventory_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_user_with_role("admin"))
):
    db_item = db.query(models.InventoryItem).filter(
        models.InventoryItem.item_id == item_id,
        models.InventoryItem.is_deleted == False
    ).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    # Soft delete
    db_item.is_deleted = True
    db_item.last_modified_by = current_user.user_id
    db.commit()
    
    # Log activity
    activity_log = models.ActivityLog(
        user_id=current_user.user_id,
        action="DELETE_INVENTORY_ITEM",
        details=f"Deleted inventory item: {db_item.name}"
    )
    db.add(activity_log)
    db.commit()
    
    return {"message": "Item deleted successfully"}

# Search inventory items
@router.get("/search/{query}", response_model=List[schemas.InventoryResponse])
def search_inventory_items(
    query: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    search = f"%{query}%"
    items = db.query(models.InventoryItem).filter(
        models.InventoryItem.is_deleted == False,
        (
            models.InventoryItem.name.ilike(search) |
            models.InventoryItem.description.ilike(search) |
            models.InventoryItem.category.ilike(search)
        )
    ).all()
    return items

# Update inventory item quantity
@router.put("/items/{item_id}/quantity")
def update_item_quantity(
    item_id: int,
    quantity_update: schemas.QuantityUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_user_with_role(["admin", "staff"]))
):
    db_item = db.query(models.InventoryItem).filter(
        models.InventoryItem.item_id == item_id,
        models.InventoryItem.is_deleted == False
    ).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    old_quantity = db_item.quantity
    db_item.quantity = quantity_update.new_quantity
    db_item.last_modified_by = current_user.user_id
    db.commit()
    
    # Log activity
    activity_log = models.ActivityLog(
        user_id=current_user.user_id,
        action="UPDATE_INVENTORY_QUANTITY",
        details=f"Updated quantity for {db_item.name} from {old_quantity} to {quantity_update.new_quantity}"
    )
    db.add(activity_log)
    db.commit()
    
    return {"message": "Quantity updated successfully"}