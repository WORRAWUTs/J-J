from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    User = "User"
    Engineer = "Engineer"
    Logistic = "Logistic"
    Admin = "Admin"

class InventoryType(str, Enum):
    HDD = "HDD"
    RAM = "RAM"
    SWITCH = "Switch"
    SERVER = "Server"
    STORAGE = "Storage"
    OTHER = "Other Module"

class InventoryLocation(str, Enum):
    FirstFloor = "1st"
    ThirdFloor = "3rd"
    Faulty = "Faulty"

class InventoryStatus(str, Enum):
    Available = "Available"
    Used = "Used"
    PendingTest = "Pending Test"

class TicketStatus(str, Enum):
    Open = "Open"
    InProgress = "In Progress"
    Closed = "Closed"

class WarrantyStatus(str, Enum):
    Active = "Active"
    Expired = "Expired"

class InventorySchema(BaseModel):
    type: InventoryType
    name_product: str
    part_number: str
    serial_number: str
    location: InventoryLocation
    sub_location: str
    status: InventoryStatus
    health: str

class TicketSchema(BaseModel):
    user_id: int
    part_id: int
    use_location: str
    start_date: datetime
    end_date: Optional[datetime]
    status: TicketStatus

class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=255)
    first_name: Optional[str] = Field(None, max_length=50)
    last_name: Optional[str] = Field(None, max_length=50)
    phone_number: Optional[str] = Field(None, max_length=20)
    role: Optional[UserRole] = Field(default=UserRole.User)
    profile_picture: Optional[str] = Field(None, max_length=255)
    is_deleted: Optional[bool] = Field(default=False)

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    username: str
    password: str

class TestCreate(BaseModel):
    name: str
    description: str

class NotificationSchema(BaseModel):
    user_id: int
    message: str
    link: Optional[int] = None
    created_at: datetime

class WarrantySchema(BaseModel):
    part_id: int
    start_date: datetime
    end_date: datetime
    status: WarrantyStatus
    provider: str
    conditions: str

class LocationType(str, Enum):
    FIRST = "1st"
    THIRD = "3rd"
    FAULTY = "Faulty"

class StatusType(str, Enum):
    AVAILABLE = "Available"
    USED = "Used"
    PENDING = "Pending Test"

class InventoryCreate(BaseModel):
    type: InventoryType
    name_product: str = Field(..., max_length=100)
    part_number: str = Field(..., max_length=50)
    serial_number: str = Field(..., max_length=50)
    location: LocationType
    sub_location: str = Field(..., max_length=50)
    status: StatusType
    health: str = Field(..., max_length=10)

    class Config:
        from_attributes = True