from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# --- User Schemas ---
class UserBase(BaseModel):
    email: str
    full_name: Optional[str] = None
    role: str = "employee"
    department: Optional[str] = None

class UserCreate(UserBase):
    uid: str

class UserResponse(UserBase):
    id: int
    uid: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# --- Audit Log Schemas ---
class LogCreate(BaseModel):
    action: str
    details: str