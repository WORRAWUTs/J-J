from sqlalchemy import Column, Integer, String, Enum, ForeignKey, Text, TIMESTAMP, Boolean
from sqlalchemy.orm import relationship
from backend.database import Base
from passlib.context import CryptContext
from sqlalchemy.sql import text

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class User(Base):
    __tablename__ = "users"
    user_id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    first_name = Column(String(50))
    last_name = Column(String(50))
    email = Column(String(100), unique=True, nullable=False)
    role = Column(Enum("User", "Engineer", "Logistic", "Admin"), nullable=False, default="User")
    profile_picture = Column(String(255))
    is_deleted = Column(Boolean, default=False)
    created_at = Column(TIMESTAMP, nullable=False, server_default=text("CURRENT_TIMESTAMP"))

    def verify_password(self, password: str):
        return pwd_context.verify(password, self.password_hash)

    def set_password(self, password: str):
        self.password_hash = pwd_context.hash(password)

class Inventory(Base):
    __tablename__ = "inventory"
    part_id = Column(Integer, primary_key=True, index=True)
    type = Column(Enum("HDD", "RAM", "Switch", "Server", "Storage", "Other Module"), nullable=False)
    name_product = Column(String(100), nullable=False)
    part_number = Column(String(50), unique=True, nullable=False)
    serial_number = Column(String(50), unique=True, nullable=False)
    location = Column(Enum("1st", "3rd", "Faulty"), nullable=False)
    sub_location = Column(String(50), nullable=False)
    status = Column(Enum("Available", "Used", "Pending Test"), nullable=False)
    health = Column(String(10), nullable=False)
    created_at = Column(TIMESTAMP, nullable=False, server_default=text("CURRENT_TIMESTAMP"))

class Ticket(Base):
    __tablename__ = "tickets"
    ticket_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"))
    part_id = Column(Integer, ForeignKey("inventory.part_id"))
    use_location = Column(String(50))
    start_date = Column(TIMESTAMP)
    end_date = Column(TIMESTAMP)
    status = Column(Enum("Open", "In Progress", "Closed"))

class Test(Base):
    __tablename__ = "tests"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), index=True)
    description = Column(String(255), index=True)

class Notification(Base):
    __tablename__ = "notifications"
    notification_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"))
    message = Column(String(1000), index=True)
    created_at = Column(TIMESTAMP, nullable=False, server_default=text("CURRENT_TIMESTAMP"))

class Warranty(Base):
    __tablename__ = "warranty"
    warranty_id = Column(Integer, primary_key=True, index=True)
    part_id = Column(Integer, ForeignKey("inventory.part_id"))
    start_date = Column(TIMESTAMP)
    end_date = Column(TIMESTAMP)
    status = Column(Enum("Active", "Expired"))
    provider = Column(String(100))
    conditions = Column(Text)
    created_at = Column(TIMESTAMP, nullable=False, server_default=text("CURRENT_TIMESTAMP"))


