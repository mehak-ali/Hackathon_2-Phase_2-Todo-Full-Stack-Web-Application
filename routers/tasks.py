from typing import List
import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

import crud, schemas
from dependencies import get_current_user_or_bypass, get_db

router = APIRouter(
    tags=["tasks"],
)

@router.post("/tasks", response_model=schemas.TaskResponse)
async def create_task(
    task: schemas.TaskCreate,
    db: AsyncSession = Depends(get_db),
    current_user: schemas.User = Depends(get_current_user_or_bypass),
):
    return await crud.task.create_task(db=db, task=task, user_id=current_user.id)

@router.get("/tasks", response_model=List[schemas.TaskResponse])
async def read_tasks(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: schemas.User = Depends(get_current_user_or_bypass),
):
    tasks = await crud.task.get_tasks(db, user_id=current_user.id, skip=skip, limit=limit)
    return tasks

@router.get("/tasks/{task_id}", response_model=schemas.TaskResponse)
async def read_task(
    task_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: schemas.User = Depends(get_current_user_or_bypass),
):
    db_task = await crud.task.get_task(db, task_id=task_id, user_id=current_user.id)
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task

@router.put("/tasks/{task_id}", response_model=schemas.TaskResponse)
async def update_task(
    task_id: uuid.UUID,
    task: schemas.TaskUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: schemas.User = Depends(get_current_user_or_bypass),
):
    db_task = await crud.task.update_task(db, task_id=task_id, task_data=task, user_id=current_user.id)
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task

@router.delete("/tasks/{task_id}", response_model=schemas.TaskResponse)
async def delete_task(
    task_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: schemas.User = Depends(get_current_user_or_bypass),
):
    db_task = await crud.task.delete_task(db, task_id=task_id, user_id=current_user.id)
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task