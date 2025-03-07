from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.models import Inventory, Base
from backend.database import SQLALCHEMY_DATABASE_URL

# สร้าง engine และ session
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

try:
    # สร้าง inventory ใหม่
    new_inventory = Inventory(
        type="HDD",
        name_product="Seagate Barracuda 2TB",
        part_number="ST2000DM008",
        serial_number="SN87654321",
        location="1st",
        sub_location="Rack B",
        status="Available",
        health="Good"
    )

    # เพิ่มลงฐานข้อมูล
    db.add(new_inventory)
    db.commit()
    db.refresh(new_inventory)

    print("เพิ่มข้อมูล Inventory สำเร็จ!")
    print(f"Part ID: {new_inventory.part_id}")
    print(f"Type: {new_inventory.type}")
    print(f"Name: {new_inventory.name_product}")
    print(f"Part Number: {new_inventory.part_number}")
    print(f"Serial Number: {new_inventory.serial_number}")
    print(f"Location: {new_inventory.location}")
    print(f"Sub Location: {new_inventory.sub_location}")
    print(f"Status: {new_inventory.status}")
    print(f"Health: {new_inventory.health}")

except Exception as e:
    db.rollback()
    print(f"เกิดข้อผิดพลาด: {e}")

finally:
    db.close() 