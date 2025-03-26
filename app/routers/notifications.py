from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas, auth
from ..database import get_db

router = APIRouter(
    prefix="/notifications",
    tags=["notifications"],
    responses={404: {"description": "Not found"}},
)

# Get all notifications for current user
@router.get("/", response_model=List[schemas.NotificationResponse])
def get_notifications(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    notifications = db.query(models.Notification).filter(
        models.Notification.user_id == current_user.user_id,
        models.Notification.is_deleted == False
    ).order_by(models.Notification.created_at.desc()).offset(skip).limit(limit).all()
    return notifications

# Get notification by ID
@router.get("/{notification_id}", response_model=schemas.NotificationResponse)
def get_notification(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    notification = db.query(models.Notification).filter(
        models.Notification.notification_id == notification_id,
        models.Notification.user_id == current_user.user_id,
        models.Notification.is_deleted == False
    ).first()
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    return notification

# Create new notification (admin/staff only)
@router.post("/", response_model=schemas.NotificationResponse)
def create_notification(
    notification: schemas.NotificationCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_user_with_role(["admin", "staff"]))
):
    # Check if target user exists
    target_user = db.query(models.User).filter(
        models.User.user_id == notification.user_id,
        models.User.is_deleted == False
    ).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="Target user not found")
    
    db_notification = models.Notification(
        user_id=notification.user_id,
        title=notification.title,
        message=notification.message,
        notification_type=notification.notification_type,
        created_by=current_user.user_id
    )
    db.add(db_notification)
    db.commit()
    db.refresh(db_notification)
    
    # Log activity
    activity_log = models.ActivityLog(
        user_id=current_user.user_id,
        action="CREATE_NOTIFICATION",
        details=f"Created notification for user {notification.user_id}: {notification.title}"
    )
    db.add(activity_log)
    db.commit()
    
    return db_notification

# Mark notification as read
@router.put("/{notification_id}/read")
def mark_notification_read(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    notification = db.query(models.Notification).filter(
        models.Notification.notification_id == notification_id,
        models.Notification.user_id == current_user.user_id,
        models.Notification.is_deleted == False
    ).first()
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    notification.is_read = True
    db.commit()
    
    return {"message": "Notification marked as read"}

# Delete notification (soft delete)
@router.delete("/{notification_id}")
def delete_notification(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    notification = db.query(models.Notification).filter(
        models.Notification.notification_id == notification_id,
        models.Notification.user_id == current_user.user_id,
        models.Notification.is_deleted == False
    ).first()
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    notification.is_deleted = True
    db.commit()
    
    return {"message": "Notification deleted successfully"}

# Get unread notifications count
@router.get("/unread/count")
def get_unread_count(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    count = db.query(models.Notification).filter(
        models.Notification.user_id == current_user.user_id,
        models.Notification.is_read == False,
        models.Notification.is_deleted == False
    ).count()
    return {"unread_count": count}

# Mark all notifications as read
@router.put("/read/all")
def mark_all_read(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    db.query(models.Notification).filter(
        models.Notification.user_id == current_user.user_id,
        models.Notification.is_read == False,
        models.Notification.is_deleted == False
    ).update({"is_read": True})
    db.commit()
    
    return {"message": "All notifications marked as read"}