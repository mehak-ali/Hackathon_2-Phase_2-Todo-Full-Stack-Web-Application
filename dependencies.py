from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Annotated

import crud, schemas
from database import SessionLocal
from security import verify_token
from config import settings # Import settings
import uuid # Add this import
from datetime import datetime # Add this import

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/login")

async def get_db():
    async with SessionLocal() as session:
        yield session

# Helper function to get user from token (original logic of get_current_user)
async def _get_user_from_token(token: Annotated[str, Depends(oauth2_scheme)], db: Annotated[AsyncSession, Depends(get_db)]) -> schemas.User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    email = verify_token(token, credentials_exception)
    user = await crud.user.get_user_by_email(db, email=email)
    if user is None:
        raise credentials_exception
    return user

# Main dependency to be used in routes, with bypass logic
async def get_current_user_or_bypass(db: Annotated[AsyncSession, Depends(get_db)]) -> schemas.User:
    if settings.SKIP_AUTH:
        # Bypass authentication: create a dummy user
        dummy_user = schemas.User(
            id=uuid.uuid4(), # Generate a valid UUID
            email="bypass@example.com",
            is_active=True,
            full_name="Bypass User",
            created_at=datetime.utcnow(), # Provide datetime
            updated_at=datetime.utcnow()  # Provide datetime
        )
        return dummy_user
    else:
        # If not bypassing, use the standard token-based authentication
        # Manually inject the token dependency here to ensure it's called
        token = await oauth2_scheme(db=db) # db is required here as context
        return await _get_user_from_token(token=token, db=db)