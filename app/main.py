from fastapi import FastAPI, Request, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
import os
from fastapi.security import OAuth2PasswordRequestForm
from . import models
from .database import engine
from .routers import users, auth, inventory, notifications, tickets, tests
from datetime import timedelta
from . import schemas
from .database import get_db
from sqlalchemy.orm import Session
from . import auth as auth_utils  # นำเข้าเป็นชื่ออื่นเพื่อไม่ให้ชนกัน

# Create database tables if they don't exist
models.Base.metadata.create_all(bind=engine)

# Create directories for file uploads
os.makedirs("uploads/profile_pics", exist_ok=True)
os.makedirs("uploads/test_files", exist_ok=True)

app = FastAPI(title="Inventory Management System API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files directory for uploads
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Error handling middleware
@app.middleware("http")
async def errors_handling(request: Request, call_next):
    try:
        return await call_next(request)
    except Exception as exc:
        return JSONResponse(
            status_code=500,
            content={"detail": str(exc)},
        )

# Include routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(inventory.router)
app.include_router(notifications.router)
app.include_router(tickets.router)
app.include_router(tests.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Inventory Management System API"}

@app.get("/healthcheck")
def healthcheck():
    return {"status": "ok"}

@app.post("/token", response_model=schemas.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = auth_utils.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth_utils.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth_utils.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)