from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import models, schemas
from ..database import get_db
from ..auth import get_current_user, check_role

router = APIRouter(prefix="/audit", tags=["Audit"])

# Helper function used by other routers
def log_action(db: Session, user_id: int, action: str, resource: str, status: str, detail: str = None):
    log = models.AuditLog(
        user_id=user_id,
        action=action,
        resource=resource,
        status=status,
        detail=detail
    )
    db.add(log)
    db.commit()

@router.get("/", response_model=list[schemas.AuditLogOut])
def get_audit_logs(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Only admins can see all logs
    check_role("admin", current_user)

    logs = db.query(models.AuditLog).order_by(
        models.AuditLog.timestamp.desc()
    ).limit(100).all()
    return logs

@router.get("/mine", response_model=list[schemas.AuditLogOut])
def get_my_logs(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Any user can see their own logs
    logs = db.query(models.AuditLog).filter(
        models.AuditLog.user_id == current_user.id
    ).order_by(models.AuditLog.timestamp.desc()).limit(50).all()
    return logs