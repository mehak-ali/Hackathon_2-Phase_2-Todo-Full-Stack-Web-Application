from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
import uuid

from models.task import Task
import schemas

async def get_task(db: AsyncSession, task_id: uuid.UUID, user_id: uuid.UUID):
    result = await db.execute(
        select(Task).filter(Task.id == task_id, Task.user_id == user_id)
    )
    return result.scalars().first()

async def get_tasks(db: AsyncSession, user_id: uuid.UUID, skip: int = 0, limit: int = 100):
    result = await db.execute(
        select(Task).filter(Task.user_id == user_id).offset(skip).limit(limit)
    )
    return result.scalars().all()

async def create_task(db: AsyncSession, task: schemas.TaskCreate, user_id: uuid.UUID):
    db_task = Task(**task.model_dump(), user_id=user_id)
    db.add(db_task)
    await db.commit()
    await db.refresh(db_task)
    return db_task

async def update_task(db: AsyncSession, task_id: uuid.UUID, task_data: schemas.TaskUpdate, user_id: uuid.UUID):
    db_task = await get_task(db, task_id=task_id, user_id=user_id)
    if db_task:
        for key, value in task_data.model_dump(exclude_unset=True).items():
            setattr(db_task, key, value)
        await db.commit()
        await db.refresh(db_task)
    return db_task

async def delete_task(db: AsyncSession, task_id: uuid.UUID, user_id: uuid.UUID):
    db_task = await get_task(db, task_id=task_id, user_id=user_id)
    if db_task:
        await db.delete(db_task)
        await db.commit()
    return db_task
