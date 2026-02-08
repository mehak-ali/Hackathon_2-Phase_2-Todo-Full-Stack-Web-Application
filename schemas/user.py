from typing import List, Optional
from pydantic import BaseModel, EmailStr
from datetime import datetime
import uuid

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class UserResponse(User):
    pass
