from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes import users, inventory, auth, tests, tickets, notifications, warranties
from backend.database import engine
from backend.models import Base
import logging
from sqlalchemy.exc import SQLAlchemyError

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # ✅ อนุญาต React Frontend
    allow_credentials=True,
    allow_methods=["*"],  # ✅ อนุญาตทุก HTTP Methods (GET, POST, PUT, DELETE)
    allow_headers=["*"],  # ✅ อนุญาตทุก Headers
)

# Create database tables
try:
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created successfully")
except SQLAlchemyError as e:
    logger.error(f"Error creating database tables: {str(e)}")
    raise

print("Auth router:", auth.router)

app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(inventory.router, prefix="/inventory", tags=["Inventory"])
app.include_router(tests.router, prefix="/tests", tags=["Tests"])
app.include_router(tickets.router, prefix="/tickets", tags=["Tickets"])
app.include_router(notifications.router, prefix="/notifications", tags=["Notifications"])
app.include_router(warranties.router, prefix="/warranties", tags=["Warranties"])

@app.get("/")
def root():
    return {"message": "Stock Management API is running!"}
