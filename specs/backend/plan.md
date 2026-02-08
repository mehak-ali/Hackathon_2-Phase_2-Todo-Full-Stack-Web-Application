# Backend Implementation Plan: Phase-2 Full-Stack Todo Application

## 1. Project Structure

A typical FastAPI project structure will be adopted, separating concerns into modules.

```
/backend
├───main.py                  # Main FastAPI application instance
├───config.py                # Application configuration (DB settings, JWT secret, etc.)
├───database.py              # SQLAlchemy engine, session, Base declaration
├───models/                  # SQLAlchemy ORM models
│   ├───__init__.py
│   ├───user.py
│   └───task.py
├───schemas/                 # Pydantic schemas for request/response validation
│   ├───__init__.py
│   ├───user.py
│   └───task.py
├───crud/                    # Create, Read, Update, Delete operations
│   ├───__init__.py
│   ├───user.py
│   └───task.py
├───routers/                 # API route definitions
│   ├───__init__.py
│   ├───auth.py
│   ├───users.py
│   └───tasks.py
├───dependencies.py          # Dependency injection for authentication, database session
├───security.py              # Password hashing, JWT creation/validation
├───alembic/                 # Database migrations (managed by Alembic)
│   ├───env.py
│   ├───README
│   ├───script.py.mako
│   └───versions/
└───tests/                   # Unit and integration tests
    ├───__init__.py
    ├───test_auth.py
    ├───test_users.py
    └───test_tasks.py
```

## 2. Module Responsibilities

*   **`main.py`**: Initializes the FastAPI app, includes routers, sets up event handlers (e.g., database connection).
*   **`config.py`**: Handles environment variables and application settings (e.g., `DATABASE_URL`, `SECRET_KEY`, `ALGORITHM`, `ACCESS_TOKEN_EXPIRE_MINUTES`).
*   **`database.py`**: Configures the SQLAlchemy engine, session, and declarative base. Provides a dependency for database sessions.
*   **`models/`**: Defines SQLAlchemy ORM models for `User` and `Task` entities, mapping them to database tables.
*   **`schemas/`**: Defines Pydantic models for request validation and response serialization for `Auth`, `User`, and `Task` related data.
*   **`crud/`**: Encapsulates database interactions for each model (e.g., `create_user`, `get_user_by_email`, `get_tasks_by_user`).
*   **`routers/`**: Contains FastAPI `APIRouter` instances for different functional areas (authentication, users, tasks). Each router defines endpoints and their respective logic.
*   **`dependencies.py`**: Provides FastAPI dependency injection functions, such as `get_db` for database sessions and `get_current_user` for JWT authentication.
*   **`security.py`**: Implements password hashing (e.g., `hash_password`, `verify_password`) and JWT token operations (e.g., `create_access_token`, `verify_token`).
*   **`alembic/`**: Manages database migrations.
*   **`tests/`**: Contains automated tests for all API endpoints and core logic.

## 3. Database Schema Design

Based on the entities defined in the specification:

### `users` table

*   `id` (UUID, Primary Key, NOT NULL, unique)
*   `email` (String, NOT NULL, unique, indexed)
*   `hashed_password` (String, NOT NULL)
*   `created_at` (DateTime, NOT NULL, default=current_timestamp)
*   `updated_at` (DateTime, NOT NULL, default=current_timestamp, onupdate=current_timestamp)

### `tasks` table

*   `id` (UUID, Primary Key, NOT NULL, unique)
*   `user_id` (UUID, Foreign Key to `users.id`, NOT NULL, indexed)
*   `title` (String, NOT NULL)
*   `description` (Text, NULLABLE)
*   `completed` (Boolean, NOT NULL, default=False)
*   `created_at` (DateTime, NOT NULL, default=current_timestamp)
*   `updated_at` (DateTime, NOT NULL, default=current_timestamp, onupdate=current_timestamp)
*   `due_date` (DateTime, NULLABLE)
*   `priority` (Integer, NULLABLE, e.g., 1-5)

## 4. Auth Flow

1.  **User Signup (`POST /auth/signup`):**
    *   Receive `email` and `password`.
    *   Hash password using `security.py`.
    *   Create a new user record in `users` table via `crud.user`.
    *   Return success message.
2.  **User Login (`POST /auth/login`):**
    *   Receive `email` and `password`.
    *   Retrieve user from database by email using `crud.user`.
    *   Verify password using `security.py`.
    *   If valid, generate JWT access token using `security.py`.
    *   Return `access_token` and `token_type` (bearer).
3.  **Protected Endpoint Access:**
    *   Client sends JWT in `Authorization: Bearer <token>` header.
    *   `dependencies.get_current_user` extracts and validates JWT.
    *   If token is valid and user exists, inject `current_user` object into the endpoint function.
    *   Endpoint logic proceeds with authenticated user context.

## 5. API Routing Plan

*   **Authentication Router (`routers/auth.py`):**
    *   `POST /auth/signup`
    *   `POST /auth/login`
*   **Users Router (`routers/users.py`):**
    *   `GET /users/me`
*   **Tasks Router (`routers/tasks.py`):**
    *   `GET /tasks`
    *   `GET /tasks/{task_id}`
    *   `POST /tasks`
    *   `PUT /tasks/{task_id}`
    *   `DELETE /tasks/{task_id}`

All routers will be included in `main.py` with the `/api/v1` prefix.

## 6. Order of Implementation

This order prioritizes foundational components first, allowing for progressive development and testing.

1.  **Setup Project Environment:**
    *   Initialize FastAPI project.
    *   Set up `backend` directory structure.
    *   Create `requirements.txt` with initial dependencies (FastAPI, Uvicorn, SQLAlchemy, Psycopg2, python-jose, passlib, Alembic, Pydantic).
    *   Configure `config.py` for basic settings.
2.  **Database and ORM Setup:**
    *   Configure `database.py` with SQLAlchemy engine and session.
    *   Define `models/user.py` and `models/task.py` (SQLAlchemy ORM models).
    *   Initialize Alembic (`alembic init alembic`) and configure `alembic.ini` and `env.py` to recognize ORM models.
    *   Create initial migration for User and Task tables (`alembic revision --autogenerate -m "Create User and Task tables"`).
    *   Apply migration (`alembic upgrade head`).
3.  **Security and Authentication Core:**
    *   Implement password hashing and verification in `security.py`.
    *   Implement JWT token creation and validation in `security.py`.
    *   Define Pydantic schemas for Auth (`schemas/user.py`).
    *   Create `dependencies.py` with `get_current_user` logic.
4.  **User Management (`crud/user.py`, `routers/auth.py`, `routers/users.py`):**
    *   Implement CRUD operations for users in `crud/user.py`.
    *   Implement `POST /auth/signup` endpoint.
    *   Implement `POST /auth/login` endpoint.
    *   Implement `GET /users/me` endpoint with JWT authentication.
5.  **Task Management (`crud/task.py`, `routers/tasks.py`):**
    *   Define Pydantic schemas for Task (`schemas/task.py`).
    *   Implement CRUD operations for tasks in `crud/task.py`, ensuring user ownership.
    *   Implement all `/tasks` endpoints (`GET`, `GET/{id}`, `POST`, `PUT/{id}`, `DELETE/{id}`) with JWT authentication and ownership checks.
6.  **Error Handling and Middleware:**
    *   Implement global exception handlers for common errors (e.g., `HTTPException`, custom errors).
    *   Configure CORS middleware in `main.py`.
7.  **Testing:**
    *   Write unit and integration tests for all implemented functionalities, especially authentication and task ownership.
8.  **Documentation:**
    *   Ensure all endpoints are properly documented using FastAPI's automatic OpenAPI generation.