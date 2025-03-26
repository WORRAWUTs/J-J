from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from sqlalchemy.orm import Session
from typing import List, Optional
import os
from .. import models, schemas, auth
from ..database import get_db
from datetime import datetime

router = APIRouter(
    prefix="/tickets",
    tags=["tickets"],
    responses={404: {"description": "Not found"}},
)

# Get all tickets (with filters)
@router.get("/", response_model=List[schemas.TicketResponse])
def get_tickets(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    priority: Optional[str] = None,
    category: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    query = db.query(models.Ticket).filter(models.Ticket.is_deleted == False)
    
    # Apply filters
    if status:
        query = query.filter(models.Ticket.status == status)
    if priority:
        query = query.filter(models.Ticket.priority == priority)
    if category:
        query = query.filter(models.Ticket.category == category)
    
    # Regular users can only see their own tickets
    if current_user.role == "user":
        query = query.filter(models.Ticket.created_by == current_user.user_id)
    
    tickets = query.order_by(models.Ticket.created_at.desc()).offset(skip).limit(limit).all()
    return tickets

# Get ticket by ID
@router.get("/{ticket_id}", response_model=schemas.TicketResponse)
def get_ticket(
    ticket_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    ticket = db.query(models.Ticket).filter(
        models.Ticket.ticket_id == ticket_id,
        models.Ticket.is_deleted == False
    ).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    # Check if user has permission to view the ticket
    if current_user.role == "user" and ticket.created_by != current_user.user_id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return ticket

# Create new ticket
@router.post("/", response_model=schemas.TicketResponse)
def create_ticket(
    ticket: schemas.TicketCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    db_ticket = models.Ticket(
        title=ticket.title,
        description=ticket.description,
        category=ticket.category,
        priority=ticket.priority,
        status="open",
        created_by=current_user.user_id
    )
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)
    
    # Create notification for staff/admin
    notification = models.Notification(
        user_id=current_user.user_id,
        title="New Ticket Created",
        message=f"A new ticket has been created: {ticket.title}",
        notification_type="info",
        created_by=current_user.user_id
    )
    db.add(notification)
    
    # Log activity
    activity_log = models.ActivityLog(
        user_id=current_user.user_id,
        action="CREATE_TICKET",
        details=f"Created new ticket: {ticket.title}"
    )
    db.add(activity_log)
    db.commit()
    
    return db_ticket

# Update ticket
@router.put("/{ticket_id}", response_model=schemas.TicketResponse)
def update_ticket(
    ticket_id: int,
    ticket_update: schemas.TicketUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    db_ticket = db.query(models.Ticket).filter(
        models.Ticket.ticket_id == ticket_id,
        models.Ticket.is_deleted == False
    ).first()
    if not db_ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    # Check if user has permission to update the ticket
    if current_user.role == "user" and db_ticket.created_by != current_user.user_id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    # Update ticket
    for key, value in ticket_update.dict(exclude_unset=True).items():
        setattr(db_ticket, key, value)
    
    db_ticket.last_modified_by = current_user.user_id
    db.commit()
    db.refresh(db_ticket)
    
    # Create notification for ticket owner if status changed
    if ticket_update.status and ticket_update.status != db_ticket.status:
        notification = models.Notification(
            user_id=db_ticket.created_by,
            title="Ticket Status Updated",
            message=f"Your ticket '{db_ticket.title}' status has been updated to {ticket_update.status}",
            notification_type="info",
            created_by=current_user.user_id
        )
        db.add(notification)
    
    # Log activity
    activity_log = models.ActivityLog(
        user_id=current_user.user_id,
        action="UPDATE_TICKET",
        details=f"Updated ticket: {db_ticket.title}"
    )
    db.add(activity_log)
    db.commit()
    
    return db_ticket

# Delete ticket (soft delete)
@router.delete("/{ticket_id}")
def delete_ticket(
    ticket_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    db_ticket = db.query(models.Ticket).filter(
        models.Ticket.ticket_id == ticket_id,
        models.Ticket.is_deleted == False
    ).first()
    if not db_ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    # Check if user has permission to delete the ticket
    if current_user.role == "user" and db_ticket.created_by != current_user.user_id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    db_ticket.is_deleted = True
    db_ticket.last_modified_by = current_user.user_id
    db.commit()
    
    # Log activity
    activity_log = models.ActivityLog(
        user_id=current_user.user_id,
        action="DELETE_TICKET",
        details=f"Deleted ticket: {db_ticket.title}"
    )
    db.add(activity_log)
    db.commit()
    
    return {"message": "Ticket deleted successfully"}

# Add comment to ticket
@router.post("/{ticket_id}/comments", response_model=schemas.CommentResponse)
def add_ticket_comment(
    ticket_id: int,
    comment: schemas.CommentCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    # Check if ticket exists
    ticket = db.query(models.Ticket).filter(
        models.Ticket.ticket_id == ticket_id,
        models.Ticket.is_deleted == False
    ).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    # Check if user has permission to comment on the ticket
    if current_user.role == "user" and ticket.created_by != current_user.user_id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    db_comment = models.Comment(
        ticket_id=ticket_id,
        content=comment.content,
        created_by=current_user.user_id
    )
    db.add(db_comment)
    
    # Create notification for ticket owner
    if current_user.user_id != ticket.created_by:
        notification = models.Notification(
            user_id=ticket.created_by,
            title="New Comment on Your Ticket",
            message=f"A new comment has been added to your ticket '{ticket.title}'",
            notification_type="info",
            created_by=current_user.user_id
        )
        db.add(notification)
    
    # Log activity
    activity_log = models.ActivityLog(
        user_id=current_user.user_id,
        action="ADD_COMMENT",
        details=f"Added comment to ticket: {ticket.title}"
    )
    db.add(activity_log)
    db.commit()
    db.refresh(db_comment)
    
    return db_comment

# Get ticket comments
@router.get("/{ticket_id}/comments", response_model=List[schemas.CommentResponse])
def get_ticket_comments(
    ticket_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    # Check if ticket exists
    ticket = db.query(models.Ticket).filter(
        models.Ticket.ticket_id == ticket_id,
        models.Ticket.is_deleted == False
    ).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    # Check if user has permission to view the comments
    if current_user.role == "user" and ticket.created_by != current_user.user_id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    comments = db.query(models.Comment).filter(
        models.Comment.ticket_id == ticket_id,
        models.Comment.is_deleted == False
    ).order_by(models.Comment.created_at.desc()).offset(skip).limit(limit).all()
    
    return comments

# Upload attachment to ticket
@router.post("/{ticket_id}/attachments")
async def upload_attachment(
    ticket_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    # Check if ticket exists
    ticket = db.query(models.Ticket).filter(
        models.Ticket.ticket_id == ticket_id,
        models.Ticket.is_deleted == False
    ).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    # Check if user has permission to add attachments
    if current_user.role == "user" and ticket.created_by != current_user.user_id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    # Create uploads directory if it doesn't exist
    upload_dir = f"uploads/tickets/{ticket_id}"
    os.makedirs(upload_dir, exist_ok=True)
    
    # Save file
    file_path = os.path.join(upload_dir, file.filename)
    with open(file_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)
    
    # Create attachment record
    db_attachment = models.Attachment(
        ticket_id=ticket_id,
        file_name=file.filename,
        file_path=file_path,
        created_by=current_user.user_id
    )
    db.add(db_attachment)
    
    # Log activity
    activity_log = models.ActivityLog(
        user_id=current_user.user_id,
        action="UPLOAD_ATTACHMENT",
        details=f"Uploaded attachment to ticket {ticket_id}: {file.filename}"
    )
    db.add(activity_log)
    db.commit()
    
    return {"message": "Attachment uploaded successfully", "file_path": file_path}