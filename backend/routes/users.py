from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.crud import get_user
from backend.auth import get_current_user, check_role
from backend.models import User
router = APIRouter()

@router.get("/{username}", dependencies=[Depends(check_role("Admin"))]) #Only Admin can get user details
def read_user(username: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_user(db, username)