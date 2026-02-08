# Backend Implementation Tasks

## Phase 1: Project Setup and Configuration

### Task ID: `BE-01`
*   **Purpose:** Initialize the FastAPI project and create the core directory structure.
*   **Scope:** 
    *   Create the `/backend` directory.
    *   Create empty Python files for `main.py`, `config.py`, `database.py`, `dependencies.py`, and `security.py`.
    *   Create directories: `models/`, `schemas/`, `crud/`, `routers/`, `tests/`.
    *   Create `__init__.py` files in each subdirectory.
*   **Dependencies:** None.
*   **Acceptance Criteria:**
    *   The project directory structure matches the plan.
    *   All specified files and directories are created.
    *   Python's import system correctly recognizes the modules.

### Task ID: `BE-02`
*   **Purpose:** Define application settings and environment variable management.
*   **Scope:**
    *   Implement a Pydantic `Settings` class in `config.py` to load environment variables (e.g., `DATABASE_URL`, `SECRET_KEY`, `ALGORITHM`, `ACCESS_TOKEN_EXPIRE_MINUTES`).
    *   Create a `.env.example` file to document required environment variables.
*   **Dependencies:** `BE-01`.
*   **Acceptance Criteria:**
    *   `config.py` successfully loads settings from environment variables.
    *   The application can be configured without hardcoding values.
    *   A `.env.example` file exists at the root of the `/backend` directory.

### Task ID: `BE-03`
*   **Purpose:** Establish the database connection and session management.
*   **Scope:**
    *   Implement SQLAlchemy engine, `SessionLocal`, and `Base` in `database.py`.
    *   Create a `get_db` dependency in `dependencies.py` to provide database sessions to API routes.
*   **Dependencies:** `BE-02`.
*   **Acceptance Criteria:**
    *   The application can connect to the PostgreSQL database using the URL from `config.py`.
    *   The `get_db` dependency can be used to inject a database session into a route.

## Phase 2: Database Modeling and Migrations

### Task ID: `BE-04`
*   **Purpose:** Define the data models for User and Task entities.
*   **Scope:**
    *   Create the `User` SQLAlchemy ORM model in `models/user.py`.
    *   Create the `Task` SQLAlchemy ORM model in `models/task.py`, including the foreign key relationship to `User`.
*   **Dependencies:** `BE-03`.
*   **Acceptance Criteria:**
    *   The `User` and `Task` models accurately reflect the schema design in `plan.md`.
    *   The models are correctly registered with SQLAlchemy's declarative base.

### Task ID: `BE-05`
*   **Purpose:** Set up and run initial database migrations.
*   **Scope:**
    *   Initialize Alembic in the `/backend` directory (`alembic init alembic`).
    *   Configure `alembic/env.py` to connect to the database and recognize the ORM models.
    *   Generate an initial migration script (`alembic revision --autogenerate`).
    *   Apply the migration to the database (`alembic upgrade head`).
*   **Dependencies:** `BE-04`.
*   **Acceptance Criteria:**
    *   Alembic is correctly configured.
    *   An initial migration script is generated that creates the `users` and `tasks` tables.
    *   The tables are successfully created in the PostgreSQL database upon applying the migration.

## Phase 3: Authentication and Security

### Task ID: `BE-06`
*   **Purpose:** Implement core security functionalities for password hashing and JWT handling.
*   **Scope:**
    *   Implement `verify_password` and `hash_password` functions in `security.py` using `passlib`.
    *   Implement `create_access_token` and JWT verification logic in `security.py` using `python-jose`.
*   **Dependencies:** `BE-02`.
*   **Acceptance Criteria:**
    *   Passwords can be securely hashed and verified.
    *   JWTs can be created with an expiration time.
    *   JWTs can be decoded and validated.

### Task ID: `BE-07`
*   **Purpose:** Define the Pydantic schemas for all API requests and responses.
*   **Scope:**
    *   Create schemas for `User` (e.g., `UserCreate`, `UserResponse`) in `schemas/user.py`.
    *   Create schemas for `Task` (e.g., `TaskCreate`, `TaskUpdate`, `TaskResponse`) in `schemas/task.py`.
    *   Create schemas for `Token` (e.g., `TokenData`, `TokenResponse`) in `schemas/token.py`.
*   **Dependencies:** `BE-01`.
*   **Acceptance Criteria:**
    *   All request and response shapes specified in `plan.md` are represented by Pydantic schemas.
    *   Schemas include appropriate validation (e.g., email format).

### Task ID: `BE-08`
*   **Purpose:** Implement the authentication dependency to protect routes.
*   **Scope:**
    *   Create the `get_current_user` dependency in `dependencies.py`.
    *   This dependency should extract the token from the `Authorization` header, verify it, and return the corresponding user from the database.
*   **Dependencies:** `BE-03`, `BE-06`, `BE-07`.
*   **Acceptance Criteria:**
    *   The `get_current_user` dependency successfully returns a user model for valid tokens.
    *   It raises an `HTTPException` (401 Unauthorized) for missing or invalid tokens.

## Phase 4: API Endpoint Implementation

### Task ID: `BE-09`
*   **Purpose:** Implement the CRUD operations for user data.
*   **Scope:**
    *   Create functions in `crud/user.py` for:
        *   `get_user(db, user_id)`
        *   `get_user_by_email(db, email)`
        *   `create_user(db, user)`
*   **Dependencies:** `BE-04`, `BE-07`.
*   **Acceptance Criteria:**
    *   Functions correctly interact with the database to manage user records.
    *   Functions use the defined Pydantic schemas and SQLAlchemy models.

### Task ID: `BE-10`
*   **Purpose:** Implement the authentication and user-related API endpoints.
*   **Scope:**
    *   Create `routers/auth.py` with `POST /signup` and `POST /login` endpoints.
    *   Create `routers/users.py` with `GET /users/me` endpoint.
    *   Integrate the routers into `main.py`.
*   **Dependencies:** `BE-08`, `BE-09`.
*   **Acceptance Criteria:**
    *   Users can successfully sign up and log in.
    *   The `/login` route returns a valid JWT.
    *   The `/users/me` route returns the correct user's data when provided with a valid JWT.

### Task ID: `BE-11`
*   **Purpose:** Implement the CRUD operations for task data.
*   **Scope:**
    *   Create functions in `crud/task.py` for:
        *   `get_tasks(db, user_id)`
        *   `get_task(db, task_id, user_id)`
        *   `create_task(db, task, user_id)`
        *   `update_task(db, task_id, task_data, user_id)`
        *   `delete_task(db, task_id, user_id)`
*   **Dependencies:** `BE-04`, `BE-07`.
*   **Acceptance Criteria:**
    *   Functions correctly interact with the database to manage task records.
    *   All functions enforce ownership by checking `user_id`.

### Task ID: `BE-12`
*   **Purpose:** Implement the API endpoints for managing tasks.
*   **Scope:**
    *   Create `routers/tasks.py` with endpoints for:
        *   `GET /tasks`
        *   `POST /tasks`
        *   `GET /tasks/{task_id}`
        *   `PUT /tasks/{task_id}`
        *   `DELETE /tasks/{task_id}`
    *   Protect all endpoints with the `get_current_user` dependency.
    *   Integrate the router into `main.py`.
*   **Dependencies:** `BE-08`, `BE-11`.
*   **Acceptance Criteria:**
    *   Authenticated users can create, read, update, and delete their own tasks.
    *   Users receive a `403 Forbidden` or `404 Not Found` error if they attempt to access tasks that do not belong to them.

## Phase 5: Finalization

### Task ID: `BE-13`
*   **Purpose:** Implement application-wide middleware and error handling.
*   **Scope:**
    *   Configure `CORSMiddleware` in `main.py` to allow requests from the frontend origin.
    *   (Optional) Implement custom exception handlers for a more uniform error response structure if needed beyond FastAPI's default.
*   **Dependencies:** `BE-10`, `BE-12`.
*   **Acceptance Criteria:**
    *   The frontend application can successfully make requests to the backend API.
    *   The API returns appropriate CORS headers.

### Task ID: `BE-14`
*   **Purpose:** Write comprehensive tests for the backend API.
*   **Scope:**
    *   Write unit tests for `security.py` functions.
    *   Write integration tests for all API endpoints in `tests/`.
    *   Tests should cover success cases, error cases (401, 403, 404), and input validation (422).
    *   Use a separate test database.
*   **Dependencies:** `BE-13`.
*   **Acceptance Criteria:**
    *   Tests achieve a high level of code coverage.
    *   The test suite passes successfully.

### Task ID: `BE-15`
*   **Purpose:** Generate and review the API documentation.
*   **Scope:**
    *   Run the FastAPI application.
    *   Access and review the auto-generated OpenAPI documentation at `/docs`.
    *   Ensure all models, endpoints, and status codes are accurately represented.
*   **Dependencies:** `BE-13`.
*   **Acceptance Criteria:**
    *   The API documentation is complete and accurate.
    *   The documentation is accessible and provides a clear guide for frontend integration.