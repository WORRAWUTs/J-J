from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from .. import models, schemas, auth
from ..database import get_db
import os
import shutil
from datetime import datetime

router = APIRouter(
    prefix="/users",
    tags=["users"],
    responses={404: {"description": "Not found"}},
)

# Get all users (admin only)
@router.get("/", response_model=List[schemas.UserResponse])
def get_users(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_user_with_role("admin"))
):
    users = db.query(models.User).filter(models.User.is_deleted == False).offset(skip).limit(limit).all()
    return users

# Get user by ID
@router.get("/{user_id}", response_model=schemas.UserResponse)
def get_user(
    user_id: int, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(auth.get_current_active_user)
):
    # Regular users can only see their own profile
    if current_user.role != "admin" and current_user.user_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to access this user")
    
    db_user = db.query(models.User).filter(models.User.user_id == user_id, models.User.is_deleted == False).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

# Create new user (register)
@router.post("/", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Check if username exists
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    # Check if email exists
    db_email = db.query(models.User).filter(models.User.email == user.email).first()
    if db_email:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Check if phone exists
    db_phone = db.query(models.User).filter(models.User.phone == user.phone).first()
    if db_phone:
        raise HTTPException(status_code=400, detail="Phone number already registered")
    
    # Create user
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(
        username=user.username,
        password_hash=hashed_password,
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        phone=user.phone,
        role="user"  # Default role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Log activity
    activity_log = models.ActivityLog(
        user_id=db_user.user_id,
        action="REGISTER",
        details=f"User {db_user.username} registered"
    )
    db.add(activity_log)
    db.commit()
    
    return db_user

# Update user (profile picture)
@router.put("/update-profile-pic", response_model=schemas.UserResponse)
async def update_profile_picture(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    # Create uploads directory if it doesn't exist
    upload_dir = "uploads/profile_pics"
    os.makedirs(upload_dir, exist_ok=True)
    
    # Generate unique filename
    file_extension = file.filename.split(".")[-1]
    filename = f"{current_user.username}_{datetime.now().strftime('%Y%m%d%H%M%S')}.{file_extension}"
    file_path = os.path.join(upload_dir, filename)
    
    # Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Update user profile pic path in DB
    current_user.profile_pic = file_path
    db.commit()
    db.refresh(current_user)
    
    return current_user

# Change user role (admin only)
@router.put("/change-role", response_model=schemas.UserResponse)
def change_role(
    role_data: schemas.RoleUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_user_with_role("admin"))
):
    db_user = db.query(models.User).filter(models.User.user_id == role_data.user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update role
    db_user.role = role_data.new_role
    db.commit()
    db.refresh(db_user)
    
    # Log activity
    activity_log = models.ActivityLog(
        user_id=current_user.user_id,
        action="CHANGE_ROLE",
        details=f"Changed role of user {db_user.username} to {role_data.new_role}"
    )
    db.add(activity_log)
    db.commit()
    
    return db_user

# Delete user (admin only)
@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_user_with_role("admin"))
):
    db_user = db.query(models.User).filter(models.User.user_id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Soft delete by setting is_deleted flag
    db_user.is_deleted = True
    db.commit()
    
    # Log activity
    activity_log = models.ActivityLog(
        user_id=current_user.user_id,
        action="DELETE_USER",
        details=f"Deleted user {db_user.username}"
    )
    db.add(activity_log)
    db.commit()
    
    return {"status": "success"}

# Search users (admin only)
@router.get("/search/", response_model=List[schemas.UserResponse])
def search_users(
    query: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_user_with_role("admin"))
):
    search = f"%{query}%"
    users = db.query(models.User).filter(
        (models.User.username.like(search) |
         models.User.first_name.like(search) |
         models.User.last_name.like(search) |
         models.User.email.like(search) |
         models.User.phone.like(search)) &
        (models.User.is_deleted == False)
    ).all()
    
    return users

# Update user
@router.put("/{user_id}", response_model=schemas.UserResponse)
def update_user(
    user_id: int,
    user_update: schemas.UserBase,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    # Check if user exists
    db_user = db.query(models.User).filter(
        models.User.user_id == user_id,
        models.User.is_deleted == False
    ).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if user has permission to update
    if current_user.role != "admin" and current_user.user_id != user_id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    # Check if email is taken by another user
    if user_update.email != db_user.email:
        email_exists = db.query(models.User).filter(
            models.User.email == user_update.email,
            models.User.user_id != user_id
        ).first()
        if email_exists:
            raise HTTPException(status_code=400, detail="Email already registered")
    
    # Check if phone is taken by another user
    if user_update.phone != db_user.phone:
        phone_exists = db.query(models.User).filter(
            models.User.phone == user_update.phone,
            models.User.user_id != user_id
        ).first()
        if phone_exists:
            raise HTTPException(status_code=400, detail="Phone number already registered")
    
    # Update user
    for key, value in user_update.dict().items():
        setattr(db_user, key, value)
    
    db.commit()
    db.refresh(db_user)
    
    # Log activity
    activity_log = models.ActivityLog(
        user_id=current_user.user_id,
        action="UPDATE_USER",
        details=f"Updated user: {db_user.username}"
    )
    db.add(activity_log)
    db.commit()
    
    return db_user

# Delete user (soft delete)
@router.delete("/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_user_with_role("admin"))
):
    db_user = db.query(models.User).filter(
        models.User.user_id == user_id,
        models.User.is_deleted == False
    ).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Soft delete
    db_user.is_deleted = True
    db.commit()
    
    # Log activity
    activity_log = models.ActivityLog(
        user_id=current_user.user_id,
        action="DELETE_USER",
        details=f"Deleted user: {db_user.username}"
    )
    db.add(activity_log)
    db.commit()
    
    return {"message": "User deleted successfully"}

# Update user role (admin only)
@router.put("/{user_id}/role", response_model=schemas.UserResponse)
def update_user_role(
    user_id: int,
    role_update: schemas.RoleUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_user_with_role("admin"))
):
    db_user = db.query(models.User).filter(
        models.User.user_id == user_id,
        models.User.is_deleted == False
    ).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db_user.role = role_update.new_role
    db.commit()
    db.refresh(db_user)
    
    # Log activity
    activity_log = models.ActivityLog(
        user_id=current_user.user_id,
        action="UPDATE_USER_ROLE",
        details=f"Updated role for user {db_user.username} to {role_update.new_role}"
    )
    db.add(activity_log)
    db.commit()
    
    return db_user

# Upload profile picture
@router.post("/{user_id}/profile-picture")
async def upload_profile_picture(
    user_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    # Check if user exists
    db_user = db.query(models.User).filter(
        models.User.user_id == user_id,
        models.User.is_deleted == False
    ).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if user has permission to update
    if current_user.role != "admin" and current_user.user_id != user_id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    # Create uploads directory if it doesn't exist
    upload_dir = "uploads/profile_pics"
    os.makedirs(upload_dir, exist_ok=True)
    
    # Generate unique filename
    file_extension = os.path.splitext(file.filename)[1]
    filename = f"profile_{user_id}{file_extension}"
    file_path = os.path.join(upload_dir, filename)
    
    # Save file
    with open(file_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)
    
    # Update user profile picture path
    db_user.profile_pic = file_path
    db.commit()
    
    # Log activity
    activity_log = models.ActivityLog(
        user_id=current_user.user_id,
        action="UPDATE_PROFILE_PICTURE",
        details=f"Updated profile picture for user: {db_user.username}"
    )
    db.add(activity_log)
    db.commit()
    
    return {"message": "Profile picture updated successfully"}