from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas
from ..database import get_db
from ..auth import get_current_user, check_role, ROLE_HIERARCHY
from .audit import log_action

router = APIRouter(prefix="/resources", tags=["Resources"])

@router.post("/", response_model=schemas.ResourceOut)
def create_resource(
    resource_data: schemas.ResourceCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Only admin and member can create
    check_role("member", current_user)

    resource = models.Resource(
        title=resource_data.title,
        content=resource_data.content,
        min_role=resource_data.min_role,
        owner_id=current_user.id
    )
    db.add(resource)
    db.commit()
    db.refresh(resource)

    log_action(db, current_user.id, "CREATE", f"resource:{resource.id}", "success", f"Created resource '{resource.title}'")
    return resource

@router.get("/", response_model=list[schemas.ResourceOut])
def get_resources(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    all_resources = db.query(models.Resource).all()
    user_level = ROLE_HIERARCHY.get(current_user.role, 0)

    # Filter resources based on user role
    accessible = [
        r for r in all_resources
        if ROLE_HIERARCHY.get(r.min_role, 0) <= user_level
    ]

    log_action(db, current_user.id, "LIST", "resources", "success", f"Listed {len(accessible)} resources")
    return accessible

@router.get("/{resource_id}", response_model=schemas.ResourceOut)
def get_resource(
    resource_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    resource = db.query(models.Resource).filter(models.Resource.id == resource_id).first()
    if not resource:
        log_action(db, current_user.id, "READ", f"resource:{resource_id}", "failed", "Resource not found")
        raise HTTPException(status_code=404, detail="Resource not found")

    user_level = ROLE_HIERARCHY.get(current_user.role, 0)
    required_level = ROLE_HIERARCHY.get(resource.min_role, 0)

    if user_level < required_level:
        log_action(db, current_user.id, "READ", f"resource:{resource_id}", "failed", "Insufficient role")
        raise HTTPException(status_code=403, detail="Access denied. Insufficient role.")

    log_action(db, current_user.id, "READ", f"resource:{resource_id}", "success", f"Accessed resource '{resource.title}'")
    return resource

@router.patch("/{resource_id}", response_model=schemas.ResourceOut)
def update_resource(
    resource_id: int,
    resource_data: schemas.ResourceUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    check_role("member", current_user)

    resource = db.query(models.Resource).filter(models.Resource.id == resource_id).first()
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")

    # Only owner or admin can update
    if resource.owner_id != current_user.id and current_user.role != "admin":
        log_action(db, current_user.id, "UPDATE", f"resource:{resource_id}", "failed", "Not owner or admin")
        raise HTTPException(status_code=403, detail="Only owner or admin can update")

    if resource_data.title: resource.title = resource_data.title
    if resource_data.content: resource.content = resource_data.content
    if resource_data.min_role: resource.min_role = resource_data.min_role

    db.commit()
    db.refresh(resource)

    log_action(db, current_user.id, "UPDATE", f"resource:{resource_id}", "success", f"Updated resource '{resource.title}'")
    return resource

@router.delete("/{resource_id}")
def delete_resource(
    resource_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    check_role("member", current_user)

    resource = db.query(models.Resource).filter(models.Resource.id == resource_id).first()
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")

    if resource.owner_id != current_user.id and current_user.role != "admin":
        log_action(db, current_user.id, "DELETE", f"resource:{resource_id}", "failed", "Not owner or admin")
        raise HTTPException(status_code=403, detail="Only owner or admin can delete")

    db.delete(resource)
    db.commit()

    log_action(db, current_user.id, "DELETE", f"resource:{resource_id}", "success", f"Deleted resource '{resource.title}'")
    return {"message": "Resource deleted successfully"}