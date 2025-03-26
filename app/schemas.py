from typing import List, Optional, Dict, Any, ForwardRef
from pydantic import BaseModel, EmailStr, Field, validator, constr
from datetime import datetime
import re
from enum import Enum
from .models import NotificationType, TicketStatus, TicketPriority, TicketCategory, TestStatus, TestType

# Base Models
class UserBase(BaseModel):
    username: str
    email: EmailStr
    first_name: str
    last_name: str
    phone: str = Field(pattern=r'^\+?1?\d{9,15}$')
    role: str = "user"

    @validator('role')
    def validate_role(cls, v):
        allowed_roles = ['user', 'staff', 'admin']
        if v not in allowed_roles:
            raise ValueError(f"Role must be one of: {', '.join(allowed_roles)}")
        return v

# Authentication schemas
class UserCreate(UserBase):
    password: str
    
    @validator('password')
    def password_validation(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        return v

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
    scopes: List[str] = []

class PasswordReset(BaseModel):
    email_or_phone: str
    otp: Optional[str] = None
    new_password: Optional[str] = None

# User Response Model
class UserResponse(UserBase):
    user_id: int
    is_active: bool
    profile_pic: Optional[str] = None
    created_at: datetime
    last_login: Optional[datetime] = None

    class Config:
        from_attributes = True

# Inventory Schemas
class InventoryBase(BaseModel):
    name: str
    description: Optional[str] = None
    quantity: int = Field(ge=0)
    unit_price: float = Field(ge=0)
    category: str

class InventoryCreate(InventoryBase):
    pass

class InventoryUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    quantity: Optional[int] = Field(None, ge=0)
    unit_price: Optional[float] = Field(None, ge=0)
    category: Optional[str] = None

class InventoryResponse(InventoryBase):
    item_id: int
    created_at: datetime
    created_by: int
    last_modified_by: Optional[int] = None
    is_deleted: bool = False

    class Config:
        from_attributes = True

# Test Schemas
class TestBase(BaseModel):
    title: str
    description: str
    test_type: TestType

class TestCreate(TestBase):
    pass

class TestUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    test_type: Optional[TestType] = None
    status: Optional[TestStatus] = None

# Forward references
AttachmentResponse = ForwardRef('AttachmentResponse')
TestResultResponse = ForwardRef('TestResultResponse')
CommentResponse = ForwardRef('CommentResponse')

class TestResponse(TestBase):
    test_id: int
    status: TestStatus
    created_at: datetime
    created_by: int
    last_modified_by: Optional[int] = None
    is_deleted: bool = False
    attachments: List[AttachmentResponse] = []
    results: List[TestResultResponse] = []

    class Config:
        from_attributes = True

# Status Log Schemas
class StatusLogBase(BaseModel):
    part_id: int
    status_before: str
    status_after: str

class StatusLogCreate(StatusLogBase):
    pass

class StatusLogResponse(StatusLogBase):
    log_id: int
    updated_by: int
    updated_at: datetime

    class Config:
        from_attributes = True

# Notification Schemas
class NotificationBase(BaseModel):
    title: str
    message: str
    notification_type: NotificationType = NotificationType.INFO

class NotificationCreate(NotificationBase):
    user_id: int

class NotificationResponse(NotificationBase):
    notification_id: int
    user_id: int
    created_at: datetime
    created_by: int
    is_read: bool = False
    is_deleted: bool = False

    class Config:
        from_attributes = True

# Ticket Schemas
class TicketBase(BaseModel):
    title: str
    description: str
    category: TicketCategory
    priority: TicketPriority = TicketPriority.MEDIUM

class TicketCreate(TicketBase):
    pass

class TicketUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[TicketCategory] = None
    priority: Optional[TicketPriority] = None
    status: Optional[TicketStatus] = None

class TicketResponse(TicketBase):
    ticket_id: int
    status: TicketStatus
    created_at: datetime
    created_by: int
    last_modified_by: Optional[int] = None
    is_deleted: bool = False
    attachments: List[AttachmentResponse] = []
    comments: List[CommentResponse] = []

    class Config:
        from_attributes = True

class CommentBase(BaseModel):
    content: str

class CommentCreate(CommentBase):
    pass

class CommentResponse(CommentBase):
    comment_id: int
    ticket_id: int
    created_at: datetime
    created_by: int
    is_deleted: bool = False

    class Config:
        from_attributes = True

class AttachmentBase(BaseModel):
    file_name: str
    file_path: str

class AttachmentCreate(AttachmentBase):
    pass

class AttachmentResponse(AttachmentBase):
    attachment_id: int
    ticket_id: int
    created_at: datetime
    created_by: int

    class Config:
        from_attributes = True

# Role Update Schema
class RoleUpdate(BaseModel):
    new_role: str
    
    @validator('new_role')
    def validate_role(cls, v):
        allowed_roles = ['user', 'staff', 'admin']
        if v not in allowed_roles:
            raise ValueError(f"Role must be one of: {', '.join(allowed_roles)}")
        return v

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = Field(None, pattern=r'^\+?1?\d{9,15}$')
    role: Optional[str] = None

    @validator('role')
    def validate_role(cls, v):
        if v is not None:
            allowed_roles = ['user', 'staff', 'admin']
            if v not in allowed_roles:
                raise ValueError(f"Role must be one of: {', '.join(allowed_roles)}")
        return v

class QuantityUpdate(BaseModel):
    new_quantity: int = Field(ge=0)

class TestResultBase(BaseModel):
    result: str
    notes: Optional[str] = None

class TestResultCreate(TestResultBase):
    pass

class TestResultResponse(TestResultBase):
    result_id: int
    test_id: int
    created_at: datetime
    created_by: int

    class Config:
        from_attributes = True

# Update forward references
TestResponse.model_rebuild()
TicketResponse.model_rebuild()