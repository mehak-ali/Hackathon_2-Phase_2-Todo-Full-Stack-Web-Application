from typing import Optional
from pydantic import BaseModel
from datetime import datetime
import uuid

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    priority: Optional[int] = None

class TaskCreate(TaskBase):
    pass

class TaskUpdate(TaskBase):
    title: Optional[str] = None
    completed: Optional[bool] = None

class Task(TaskBase):
    id: uuid.UUID
    user_id: uuid.UUID
    completed: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class TaskResponse(Task):
    pass
