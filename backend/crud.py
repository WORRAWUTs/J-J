from sqlalchemy.orm import Session
from backend.models import User, Inventory, Ticket
from backend.schemas import InventorySchema, TicketSchema

def get_user(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

def create_inventory(db: Session, item: InventorySchema):
    new_item = Inventory(**item.dict())
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

def get_inventory(db: Session, product_id: str):
    return db.query(Inventory).filter(Inventory.product_id == product_id).first()
