from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import User
from backend.auth import create_access_token, authenticate_user
from backend.schemas import UserCreate, UserLogin
from backend.auth import get_current_user
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(user: UserCreate = Body(...), db: Session = Depends(get_db)):
    logger.info(f"Attempting to register user: {user.username}")

    try:
        # Check if username exists
        existing_user = db.query(User).filter(User.username == user.username).first()
        if existing_user:
            logger.warning(f"Username {user.username} already exists")
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already exists")

        # Check if email exists
        existing_email = db.query(User).filter(User.email == user.email).first()
        if existing_email:
            logger.warning(f"Email {user.email} already exists")
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already exists")

        # Create new user
        new_user = User(
            username=user.username,
            email=user.email,
            first_name=user.first_name,
            last_name=user.last_name,
            role=user.role if user.role else "User",
            profile_picture=user.profile_picture,
            is_deleted=user.is_deleted
        )
        new_user.set_password(user.password)
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        logger.info(f"User {user.username} created successfully")
        return {"message": "User created successfully"}
        
    except HTTPException as he:
        logger.error(f"HTTP error during registration: {str(he)}")
        raise
    except Exception as e:
        logger.error(f"Error creating user: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    logger.info(f"Login attempt for user: {user.username}")

    try:
        auth_user = authenticate_user(db, user.username, user.password)
        if not auth_user:
            logger.warning(f"Invalid credentials for user: {user.username}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )

        access_token = create_access_token(data={"sub": auth_user.username})
        logger.info(f"User {user.username} logged in successfully")
        return {"access_token": access_token, "token_type": "bearer"}
        
    except HTTPException as he:
        logger.error(f"HTTP error during login: {str(he)}")
        raise
    except Exception as e:
        logger.error(f"Error during login: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )
