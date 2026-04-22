from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas
from ..database import get_db
from ..auth import get_current_user, check_role

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/me", response_model=schemas.UserOut)
def get_me(current_user: models.User = Depends(get_current_user)):
    return current_user

@router.get("/", response_model=list[schemas.UserOut])
def get_all_users(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Only admins can see all users
    check_role("admin", current_user)
    users = db.query(models.User).filter(
        models.User.organization == current_user.organization
    ).all()
    return users

@router.patch("/{user_id}/role", response_model=schemas.UserOut)
def update_user_role(
    user_id: int,
    role: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Only admins can change roles
    check_role("admin", current_user)

    if role not in ["admin", "member", "viewer"]:
        raise HTTPException(status_code=400, detail="Invalid role")

    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.organization != current_user.organization:
        raise HTTPException(status_code=403, detail="Cannot modify users from other organizations")

    user.role = role
    db.commit()
    db.refresh(user)
    return user

@router.delete("/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    check_role("admin", current_user)

    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot delete yourself")

    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}