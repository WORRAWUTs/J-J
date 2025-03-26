from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from datetime import timedelta, datetime
import random
import string
from .. import models, schemas, auth
from ..database import get_db

router = APIRouter(
    prefix="/auth",
    tags=["authentication"],
    responses={404: {"description": "Not found"}},
)

# Generate OTP
def generate_otp():
    return ''.join(random.choices(string.digits, k=6))

# Function to send OTP (simulated)
def send_otp(email_or_phone: str, otp: str):
    # In a real app, this would send an email or SMS
    print(f"Sending OTP {otp} to {email_or_phone}")
    # Store OTP in database temporarily
    # This is a simple simulation - in production use Redis or another storage

# Login endpoint
@router.post("/token", response_model=schemas.Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = auth.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user.last_login = datetime.utcnow()
    db.commit()

    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    
    # Update last login
    user.last_login = datetime.utcnow()
    db.commit()
    
    return {"access_token": access_token, "token_type": "bearer"}

# Request password reset (forgot password)
@router.post("/forgot-password", status_code=status.HTTP_200_OK)
def forgot_password(
    reset_request: schemas.PasswordReset,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    # Find user by email or phone
    user = None
    if "@" in reset_request.email_or_phone:  # Email
        user = db.query(models.User).filter(
            models.User.email == reset_request.email_or_phone,
            models.User.is_deleted == False
        ).first()
    else:  # Phone
        user = db.query(models.User).filter(
            models.User.phone == reset_request.email_or_phone,
            models.User.is_deleted == False
        ).first()
    
    if not user:
        # For security reasons, don't reveal whether the email/phone exists
        return {"message": "If the email or phone is registered, you will receive an OTP"}
    
    # Generate OTP
    otp = generate_otp()
    
    # Send OTP (in background)
    background_tasks.add_task(send_otp, reset_request.email_or_phone, otp)
    
    # In a real application, store OTP with expiration time in Redis or similar
    # For this demo, we'll create a temporary entry in the user table or a separate table
    # Here, you would typically store the OTP and set an expiration time
    
    return {"message": "If the email or phone is registered, you will receive an OTP"}

# Verify OTP and reset password
@router.post("/reset-password", status_code=status.HTTP_200_OK)
def reset_password(
    reset_data: schemas.PasswordReset,
    db: Session = Depends(get_db)
):
    # Validate OTP (in a real app, check against stored OTP)
    if not reset_data.otp or not reset_data.new_password:
        raise HTTPException(status_code=400, detail="OTP and new password are required")
    
    # Find user by email or phone
    user = None
    if "@" in reset_data.email_or_phone:  # Email
        user = db.query(models.User).filter(
            models.User.email == reset_data.email_or_phone,
            models.User.is_deleted == False
        ).first()
    else:  # Phone
        user = db.query(models.User).filter(
            models.User.phone == reset_data.email_or_phone,
            models.User.is_deleted == False
        ).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # In a real app, verify OTP against stored value
    # For demo, we'll assume OTP is valid
    
    # Update password
    user.password_hash = auth.get_password_hash(reset_data.new_password)
    db.commit()
    
    # Log activity
    activity_log = models.ActivityLog(
        user_id=user.user_id,
        action="PASSWORD_RESET",
        details=f"User {user.username} reset their password"
    )
    db.add(activity_log)
    db.commit()
    
    return {"message": "Password has been reset successfully"}

@router.get("/me", response_model=schemas.UserResponse)
async def read_users_me(current_user: models.User = Depends(auth.get_current_active_user)):
    return current_user