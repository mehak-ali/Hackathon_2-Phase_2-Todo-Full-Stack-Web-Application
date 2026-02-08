from fastapi import APIRouter, Depends

import schemas
from dependencies import get_current_user_or_bypass

router = APIRouter(
    prefix="/users",
    tags=["users"],
)

@router.get("/me", response_model=schemas.UserResponse)
async def read_users_me(current_user: schemas.User = Depends(get_current_user_or_bypass)):
    return current_user
