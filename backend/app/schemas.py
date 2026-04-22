from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

# --- Auth Schemas ---
class UserRegister(BaseModel):
    email: EmailStr
    username: str
    password: str
    organization: str
    role: Optional[str] = "viewer"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    user_id: Optional[int] = None

# --- User Schemas ---
class UserOut(BaseModel):
    id: int
    email: str
    username: str
    role: str
    organization: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# --- Resource Schemas ---
class ResourceCreate(BaseModel):
    title: str
    content: str
    min_role: Optional[str] = "viewer"

class ResourceUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    min_role: Optional[str] = None

class ResourceOut(BaseModel):
    id: int
    title: str
    content: str
    min_role: str
    owner_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# --- Audit Schemas ---
class AuditLogOut(BaseModel):
    id: int
    user_id: Optional[int]
    action: str
    resource: str
    status: str
    detail: Optional[str]
    timestamp: datetime

    class Config:
        from_attributes = True