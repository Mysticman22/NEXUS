from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    uid = Column(String, unique=True, index=True) # Firebase UID
    email = Column(String, unique=True, index=True)
    full_name = Column(String)
    role = Column(String, default="employee") # admin, hr, etc.
    department = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_uid = Column(String, ForeignKey("users.uid"))
    action = Column(String) # e.g., "LOGIN", "QUERY_DOC"
    details = Column(String)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())