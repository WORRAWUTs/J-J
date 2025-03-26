from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, Enum, Text, TIMESTAMP, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base
import enum

# Enum definitions
class NotificationType(str, enum.Enum):
    INFO = "info"
    WARNING = "warning"
    ERROR = "error"
    SUCCESS = "success"

class TicketStatus(str, enum.Enum):
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"
    CLOSED = "closed"
    CANCELLED = "cancelled"

class TicketPriority(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"

class TicketCategory(str, enum.Enum):
    HARDWARE = "hardware"
    SOFTWARE = "software"
    NETWORK = "network"
    ACCESS = "access"
    OTHER = "other"

class TestStatus(str, enum.Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"

class TestType(str, enum.Enum):
    UNIT = "unit"
    INTEGRATION = "integration"
    SYSTEM = "system"
    ACCEPTANCE = "acceptance"
    PERFORMANCE = "performance"
    SECURITY = "security"
    FUNCTIONAL = "functional"
    REGRESSION = "regression"
    SMOKE = "smoke"
    SANITY = "sanity"

# Other enum definitions for database columns
class RoleEnum(enum.Enum):
    USER = "user"
    ENGINEER = "engineer"
    LOGISTIC = "logistic"
    ADMIN = "admin"

class LocationEnum(enum.Enum):
    FIRST_FLOOR = "1st floor"
    THIRD_FLOOR = "3rd floor"
    FAULTY = "faulty"

class TypeEnum(enum.Enum):
    HDD = "Hdd"
    RAM = "Ram"
    SWITCH = "Switch"
    SERVER = "Server"
    STORAGE = "Storage"
    BLADE_SERVER = "Blade server"
    FIREWALL = "Firewall"
    ROUTER = "Router"
    MAINBOARD = "Mainboard"
    OTHER_MODULE = "Other Module"

class StatusEnum(enum.Enum):
    PENDING_TEST = "Pending test"
    GOOD = "Good"
    NOT_GOOD = "Not good"

class SubLocationEnum(enum.Enum):
    A1 = "1st(A1)"
    A2 = "1st(A2)"
    A3 = "1st(A3)"
    C1 = "1st(C1)"
    C2 = "1st(C2)"
    E1 = "1st(E1)"
    E2 = "1st(E2)"
    B = "1st(B)"
    D1 = "1st(D1)"
    D2 = "1st(D2)"
    D3 = "1st(D3)"
    F1 = "1st(F1)"
    F2 = "1st(F2)"
    F3 = "1st(F3)"
    L = "1st(L)"
    J = "1st(J)"
    H = "1st(H)"
    S001_1 = "1st(S001-1)"
    S001_2G = "1st(S001-2G)"
    S001_3G = "1st(S001-3G)"
    S001_4 = "1st(S001-4)"
    S002_1 = "1st(S002-1)"
    S002_2 = "1st(S002-2)"
    S002_3 = "1st(S002-3)"
    S002_4 = "1st(S002-4)"
    ASUS = "1st(Asus)"
    FAULTY_G = "1st(Faulty-G)"
    RACK24 = "3rd(Rack24)"
    RACK23 = "3rd(Rack23)"
    FAULTY = "faulty"

# User model
class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    email = Column(String(100), unique=True, index=True)
    first_name = Column(String(50))
    last_name = Column(String(50))
    phone = Column(String(20))
    password_hash = Column(String(255))
    role = Column(String(20), default="user")
    is_active = Column(Boolean, default=True)
    is_deleted = Column(Boolean, default=False)
    profile_pic = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    last_login = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    tickets = relationship("Ticket", back_populates="user", foreign_keys="[Ticket.created_by]")
    notifications = relationship("Notification", back_populates="user", foreign_keys="[Notification.user_id]")
    activities = relationship("ActivityLog", back_populates="user", foreign_keys="[ActivityLog.user_id]")
    status_logs_created = relationship("StatusLog", back_populates="updated_by_user", foreign_keys="[StatusLog.updated_by]")

# Inventory model
class Inventory(Base):
    __tablename__ = "inventory"

    part_id = Column(Integer, primary_key=True, index=True)
    type = Column(String(20))
    name_product = Column(String(255))
    part_number = Column(String(50), index=True)
    serial_number = Column(String(50), unique=True, index=True)
    location = Column(String(20))
    sub_location = Column(String(50), nullable=True)
    status = Column(String(20), default="Pending test")
    health = Column(String(30), nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.now())

    # Relationships
    status_logs = relationship("StatusLog", back_populates="part")
    warranty = relationship("Warranty", back_populates="part")
    ticket_parts = relationship("TicketPart", back_populates="part")
    tests = relationship("Test", back_populates="part")

# Tests model
class Test(Base):
    __tablename__ = "tests"

    test_id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255))
    description = Column(Text)
    test_type = Column(Enum(TestType))
    status = Column(Enum(TestStatus))
    part_id = Column(Integer, ForeignKey("inventory.part_id"))
    created_by = Column(Integer, ForeignKey("users.user_id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    last_modified_by = Column(Integer, ForeignKey("users.user_id"), nullable=True)
    is_deleted = Column(Boolean, default=False)

    # Relationships
    part = relationship("Inventory", back_populates="tests")
    creator = relationship("User", foreign_keys=[created_by])
    modifier = relationship("User", foreign_keys=[last_modified_by])
    results = relationship("TestResult", back_populates="test")
    attachments = relationship("Attachment", back_populates="test")

# Status Log model
class StatusLog(Base):
    __tablename__ = "status_logs"

    log_id = Column(Integer, primary_key=True, index=True)
    part_id = Column(Integer, ForeignKey("inventory.part_id"))
    status_before = Column(String(20))
    status_after = Column(String(20))
    updated_by = Column(Integer, ForeignKey("users.user_id"))
    updated_at = Column(TIMESTAMP, server_default=func.now())

    # Relationships
    part = relationship("Inventory", back_populates="status_logs")
    updated_by_user = relationship("User", back_populates="status_logs_created", foreign_keys=[updated_by])

# Warranty model
class Warranty(Base):
    __tablename__ = "warranty"

    warranty_id = Column(Integer, primary_key=True, index=True)
    part_id = Column(Integer, ForeignKey("inventory.part_id"))
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    status = Column(String(20))
    provider = Column(String(100))
    conditions = Column(Text, nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.now())

    # Relationships
    part = relationship("Inventory", back_populates="warranty")

# Ticket model
class Ticket(Base):
    __tablename__ = "tickets"

    ticket_id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255))
    description = Column(Text)
    category = Column(Enum(TicketCategory))
    priority = Column(Enum(TicketPriority))
    status = Column(Enum(TicketStatus))
    created_by = Column(Integer, ForeignKey("users.user_id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    last_modified_by = Column(Integer, ForeignKey("users.user_id"), nullable=True)
    is_deleted = Column(Boolean, default=False)
    last_login = Column(TIMESTAMP, nullable=True)

    # Relationships
    user = relationship("User", back_populates="tickets", foreign_keys=[created_by])
    modifier = relationship("User", foreign_keys=[last_modified_by])
    comments = relationship("Comment", back_populates="ticket")
    attachments = relationship("Attachment", back_populates="ticket")
    ticket_parts = relationship("TicketPart", back_populates="ticket")

# TicketPart model
class TicketPart(Base):
    __tablename__ = "ticket_parts"

    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(Integer, ForeignKey("tickets.ticket_id"))
    part_id = Column(Integer, ForeignKey("inventory.part_id"))

    # Relationships
    ticket = relationship("Ticket", back_populates="ticket_parts")
    part = relationship("Inventory", back_populates="ticket_parts")

# Activity Log model
class ActivityLog(Base):
    __tablename__ = "activity_logs"

    log_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"))
    action = Column(String(100))
    details = Column(String(255))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="activities", foreign_keys=[user_id])

# Notification model
class Notification(Base):
    __tablename__ = "notifications"

    notification_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"))
    title = Column(String(255))
    message = Column(String(1000))
    notification_type = Column(Enum(NotificationType))
    is_read = Column(Boolean, default=False)
    is_deleted = Column(Boolean, default=False)
    created_by = Column(Integer, ForeignKey("users.user_id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="notifications", foreign_keys=[user_id])
    creator = relationship("User", foreign_keys=[created_by])

# Comment model
class Comment(Base):
    __tablename__ = "comments"

    comment_id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(Integer, ForeignKey("tickets.ticket_id"))
    content = Column(Text)
    created_by = Column(Integer, ForeignKey("users.user_id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    is_deleted = Column(Boolean, default=False)

    # Relationships
    ticket = relationship("Ticket", back_populates="comments")
    creator = relationship("User", foreign_keys=[created_by])

# Attachment model
class Attachment(Base):
    __tablename__ = "attachments"

    attachment_id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(Integer, ForeignKey("tickets.ticket_id"), nullable=True)
    test_id = Column(Integer, ForeignKey("tests.test_id"), nullable=True)
    file_name = Column(String(255))
    file_path = Column(String(255))
    created_by = Column(Integer, ForeignKey("users.user_id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    ticket = relationship("Ticket", back_populates="attachments")
    test = relationship("Test", back_populates="attachments")
    creator = relationship("User", foreign_keys=[created_by])

# TestResult model
class TestResult(Base):
    __tablename__ = "test_results"

    result_id = Column(Integer, primary_key=True, index=True)
    test_id = Column(Integer, ForeignKey("tests.test_id"), nullable=False)
    result = Column(String(255))
    notes = Column(Text, nullable=True)
    created_by = Column(Integer, ForeignKey("users.user_id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    test = relationship("Test", back_populates="results")
    creator = relationship("User", foreign_keys=[created_by])

# InventoryItem model
class InventoryItem(Base):
    __tablename__ = "inventory_items"

    item_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255))
    description = Column(String(1000), nullable=True)
    quantity = Column(Integer, default=0)
    unit_price = Column(Float)
    category = Column(String(100))
    created_by = Column(Integer, ForeignKey("users.user_id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    last_modified_by = Column(Integer, ForeignKey("users.user_id"), nullable=True)
    is_deleted = Column(Boolean, default=False)

    # Relationships
    creator = relationship("User", foreign_keys=[created_by])
    modifier = relationship("User", foreign_keys=[last_modified_by])