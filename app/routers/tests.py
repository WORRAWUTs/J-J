from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from .. import models, schemas, auth
from ..database import get_db
import os
import shutil
from datetime import datetime

router = APIRouter(
    prefix="/tests",
    tags=["tests"],
    responses={404: {"description": "Not found"}},
)

# Get all tests (with filters)
@router.get("/", response_model=List[schemas.TestResponse])
def get_tests(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    test_type: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    query = db.query(models.Test).filter(models.Test.is_deleted == False)
    
    # Apply filters
    if status:
        query = query.filter(models.Test.status == status)
    if test_type:
        query = query.filter(models.Test.test_type == test_type)
    
    # Regular users can only see their own tests
    if current_user.role == "user":
        query = query.filter(models.Test.created_by == current_user.user_id)
    
    tests = query.order_by(models.Test.created_at.desc()).offset(skip).limit(limit).all()
    return tests

# Get test by ID
@router.get("/{test_id}", response_model=schemas.TestResponse)
def get_test(
    test_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    test = db.query(models.Test).filter(
        models.Test.test_id == test_id,
        models.Test.is_deleted == False
    ).first()
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")
    
    # Check if user has permission to view the test
    if current_user.role == "user" and test.created_by != current_user.user_id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return test

# Create new test
@router.post("/", response_model=schemas.TestResponse)
def create_test(
    test: schemas.TestCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    db_test = models.Test(
        title=test.title,
        description=test.description,
        test_type=test.test_type,
        status="pending",
        created_by=current_user.user_id
    )
    db.add(db_test)
    db.commit()
    db.refresh(db_test)
    
    # Create notification for staff/admin
    notification = models.Notification(
        user_id=current_user.user_id,
        title="New Test Created",
        message=f"A new test has been created: {test.title}",
        notification_type="info",
        created_by=current_user.user_id
    )
    db.add(notification)
    
    # Log activity
    activity_log = models.ActivityLog(
        user_id=current_user.user_id,
        action="CREATE_TEST",
        details=f"Created new test: {test.title}"
    )
    db.add(activity_log)
    db.commit()
    
    return db_test

# Update test
@router.put("/{test_id}", response_model=schemas.TestResponse)
def update_test(
    test_id: int,
    test_update: schemas.TestUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    db_test = db.query(models.Test).filter(
        models.Test.test_id == test_id,
        models.Test.is_deleted == False
    ).first()
    if not db_test:
        raise HTTPException(status_code=404, detail="Test not found")
    
    # Check if user has permission to update the test
    if current_user.role == "user" and db_test.created_by != current_user.user_id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    # Update test
    for key, value in test_update.dict(exclude_unset=True).items():
        setattr(db_test, key, value)
    
    db_test.last_modified_by = current_user.user_id
    db.commit()
    db.refresh(db_test)
    
    # Create notification for test owner if status changed
    if test_update.status and test_update.status != db_test.status:
        notification = models.Notification(
            user_id=db_test.created_by,
            title="Test Status Updated",
            message=f"Your test '{db_test.title}' status has been updated to {test_update.status}",
            notification_type="info",
            created_by=current_user.user_id
        )
        db.add(notification)
    
    # Log activity
    activity_log = models.ActivityLog(
        user_id=current_user.user_id,
        action="UPDATE_TEST",
        details=f"Updated test: {db_test.title}"
    )
    db.add(activity_log)
    db.commit()
    
    return db_test

# Delete test (soft delete)
@router.delete("/{test_id}")
def delete_test(
    test_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    db_test = db.query(models.Test).filter(
        models.Test.test_id == test_id,
        models.Test.is_deleted == False
    ).first()
    if not db_test:
        raise HTTPException(status_code=404, detail="Test not found")
    
    # Check if user has permission to delete the test
    if current_user.role == "user" and db_test.created_by != current_user.user_id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    db_test.is_deleted = True
    db_test.last_modified_by = current_user.user_id
    db.commit()
    
    # Log activity
    activity_log = models.ActivityLog(
        user_id=current_user.user_id,
        action="DELETE_TEST",
        details=f"Deleted test: {db_test.title}"
    )
    db.add(activity_log)
    db.commit()
    
    return {"message": "Test deleted successfully"}

# Add result to test
@router.post("/{test_id}/results", response_model=schemas.TestResultResponse)
def add_test_result(
    test_id: int,
    result: schemas.TestResultCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    # Check if test exists
    test = db.query(models.Test).filter(
        models.Test.test_id == test_id,
        models.Test.is_deleted == False
    ).first()
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")
    
    # Check if user has permission to add results
    if current_user.role == "user" and test.created_by != current_user.user_id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    db_result = models.TestResult(
        test_id=test_id,
        result=result.result,
        notes=result.notes,
        created_by=current_user.user_id
    )
    db.add(db_result)
    
    # Update test status based on result
    test.status = "completed"
    test.last_modified_by = current_user.user_id
    
    # Create notification for test owner
    if current_user.user_id != test.created_by:
        notification = models.Notification(
            user_id=test.created_by,
            title="New Test Result Added",
            message=f"A new result has been added to your test '{test.title}'",
            notification_type="info",
            created_by=current_user.user_id
        )
        db.add(notification)
    
    # Log activity
    activity_log = models.ActivityLog(
        user_id=current_user.user_id,
        action="ADD_TEST_RESULT",
        details=f"Added result to test: {test.title}"
    )
    db.add(activity_log)
    db.commit()
    db.refresh(db_result)
    
    return db_result

# Get test results
@router.get("/{test_id}/results", response_model=List[schemas.TestResultResponse])
def get_test_results(
    test_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    # Check if test exists
    test = db.query(models.Test).filter(
        models.Test.test_id == test_id,
        models.Test.is_deleted == False
    ).first()
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")
    
    # Check if user has permission to view the results
    if current_user.role == "user" and test.created_by != current_user.user_id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    results = db.query(models.TestResult).filter(
        models.TestResult.test_id == test_id
    ).order_by(models.TestResult.created_at.desc()).offset(skip).limit(limit).all()
    
    return results

# Upload attachment to test
@router.post("/{test_id}/attachments")
async def upload_attachment(
    test_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    # Check if test exists
    test = db.query(models.Test).filter(
        models.Test.test_id == test_id,
        models.Test.is_deleted == False
    ).first()
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")
    
    # Check if user has permission to add attachments
    if current_user.role == "user" and test.created_by != current_user.user_id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    # Create uploads directory if it doesn't exist
    upload_dir = f"uploads/tests/{test_id}"
    os.makedirs(upload_dir, exist_ok=True)
    
    # Save file
    file_path = os.path.join(upload_dir, file.filename)
    with open(file_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)
    
    # Create attachment record
    db_attachment = models.Attachment(
        test_id=test_id,
        file_name=file.filename,
        file_path=file_path,
        created_by=current_user.user_id
    )
    db.add(db_attachment)
    
    # Log activity
    activity_log = models.ActivityLog(
        user_id=current_user.user_id,
        action="UPLOAD_TEST_ATTACHMENT",
        details=f"Uploaded attachment to test {test_id}: {file.filename}"
    )
    db.add(activity_log)
    db.commit()
    
    return {"message": "Attachment uploaded successfully", "file_path": file_path}