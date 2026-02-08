from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession

import crud, schemas
from dependencies import get_db
from security import create_access_token, verify_password

router = APIRouter(
    prefix="/auth",
    tags=["auth"],
)

@router.post("/signup", response_model=schemas.UserResponse)
async def signup(user: schemas.UserCreate, db: AsyncSession = Depends(get_db)):
    db_user = await crud.user.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=409, detail="Email already registered")
    return await crud.user.create_user(db=db, user=user)

@router.post("/login", response_model=schemas.Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    user = await crud.user.get_user_by_email(db, email=form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}
