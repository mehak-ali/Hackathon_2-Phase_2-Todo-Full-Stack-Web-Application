# Backend Specification Document: Phase-2 Full-Stack Todo Application

## 1. Introduction

### 1.1. Purpose

This document outlines the detailed specification for the backend of the Phase-2 Full-Stack Todo Application. It defines the core functionalities, data models, API endpoints, authentication mechanisms, and security considerations required for a robust and scalable backend system.

### 1.2. Scope

This specification covers the backend API, data persistence, and authentication logic. It does not include frontend implementation details or deployment infrastructure, except where directly impacting API design (e.g., CORS).

### 1.3. Backend Stack

*   **Web Framework:** FastAPI (Python)
*   **Database:** PostgreSQL
*   **ORM:** SQLAlchemy 2.0
*   **Migrations:** Alembic
*   **Authentication:** JWT (JSON Web Tokens)

## 2. Authentication System (JWT)

### 2.1. Overview

The authentication system will utilize JSON Web Tokens (JWT) for stateless authentication. Upon successful login, the server will issue an access token. This token will be sent with subsequent requests to access protected resources. Tokens will have an expiration time.

### 2.2. Signup Flow

1.  **Request:** User sends `POST /auth/signup` with `email` and `password`.
2.  **Validation:** Backend validates input (e.g., email format, password strength).
3.  **User Creation:** If valid, a new user record is created in the database with a hashed password.
4.  **Response:** Success (e.g., 201 Created) or error (e.g., 422 Unprocessable Entity if input invalid, 409 Conflict if email already exists). No JWT is returned on signup; the user must subsequently log in.

### 2.3. Login Flow

1.  **Request:** User sends `POST /auth/login` with `email` and `password`.
2.  **Verification:** Backend verifies credentials against the stored hashed password.
3.  **Token Generation:** If credentials are valid, a JWT access token is generated.
4.  **Response:** Success (e.g., 200 OK) with the `access_token` in the response body. Error (e.g., 401 Unauthorized) if credentials are invalid.

### 2.4. Token Management

*   **Storage (Client-Side):** The frontend (Next.js) is responsible for securely storing the JWT (e.g., in `HttpOnly` cookies, or local storage with appropriate security considerations).
*   **Transmission:** The JWT must be sent in the `Authorization` header of all protected requests, prefixed with `Bearer ` (e.g., `Authorization: Bearer <your_jwt_token>`).
*   **Expiration:** Access tokens will have a defined expiration time. The frontend is responsible for handling expired tokens (e.g., redirecting to login, or implementing a refresh token mechanism if deemed necessary in future phases). For Phase 2, a simple expiration leading to re-authentication is sufficient.
*   **Invalidation:** JWTs are stateless and cannot be explicitly invalidated by the server. If a token is compromised, its validity persists until expiration. Short expiration times mitigate this risk.

## 3. Entities

### 3.1. User Entity

Represents a user of the application.

*   **Attributes:**
    *   `id` (UUID or Integer): Primary key, unique identifier.
    *   `email` (String): Unique, indexed, required. Used for login.
    *   `hashed_password` (String): Required, securely stored.
    *   `created_at` (DateTime): Automatically set on creation.
    *   `updated_at` (DateTime): Automatically updated on modification.

### 3.2. Todo Task Entity

Represents a single todo item belonging to a user.

*   **Attributes:**
    *   `id` (UUID or Integer): Primary key, unique identifier.
    *   `user_id` (UUID or Integer): Foreign key, links to the owning User.
    *   `title` (String): Required, e.g., "Buy groceries".
    *   `description` (Text, Optional): Longer description for the task.
    *   `completed` (Boolean): Default `False`. Indicates if the task is done.
    *   `created_at` (DateTime): Automatically set on creation.
    *   `updated_at` (DateTime): Automatically updated on modification.
    *   `due_date` (DateTime, Optional): Date/time the task is due.
    *   `priority` (Integer, Optional): e.g., 1 (low) to 5 (high).

## 4. REST API Endpoints

### 4.1. General Principles

*   **Base URL:** All API endpoints will be prefixed with `/api/v1`.
*   **JSON:** All request bodies and successful response bodies will be in JSON format.
*   **Stateless:** The server will not store client session state.
*   **HTTPS:** All communication must occur over HTTPS.

### 4.2. Authentication Endpoints

*   **`POST /auth/signup`**
    *   **Description:** Registers a new user.
    *   **Authentication:** None (Public)
    *   **Request Body:** `SignupRequest`
    *   **Response:** `MessageResponse` (on success) or `ErrorResponse`
    *   **Status Codes:** `201 Created`, `400 Bad Request`, `409 Conflict`, `422 Unprocessable Entity`
*   **`POST /auth/login`**
    *   **Description:** Authenticates a user and returns a JWT access token.
    *   **Authentication:** None (Public)
    *   **Request Body:** `LoginRequest`
    *   **Response:** `TokenResponse` or `ErrorResponse`
    *   **Status Codes:** `200 OK`, `400 Bad Request`, `401 Unauthorized`, `422 Unprocessable Entity`

### 4.3. User Endpoints

*   **`GET /users/me`**
    *   **Description:** Retrieves the currently authenticated user's profile.
    *   **Authentication:** Required (JWT)
    *   **Request Body:** None
    *   **Response:** `UserResponse` or `ErrorResponse`
    *   **Status Codes:** `200 OK`, `401 Unauthorized`

### 4.4. Todo Task Endpoints

*   **`GET /tasks`**
    *   **Description:** Retrieves all todo tasks for the authenticated user.
    *   **Authentication:** Required (JWT)
    *   **Request Body:** None
    *   **Response:** `List[TaskResponse]` or `ErrorResponse`
    *   **Status Codes:** `200 OK`, `401 Unauthorized`
*   **`GET /tasks/{task_id}`**
    *   **Description:** Retrieves a specific todo task by ID for the authenticated user.
    *   **Authentication:** Required (JWT)
    *   **Request Body:** None
    *   **Response:** `TaskResponse` or `ErrorResponse`
    *   **Status Codes:** `200 OK`, `401 Unauthorized`, `403 Forbidden` (if task doesn't belong to user), `404 Not Found`
*   **`POST /tasks`**
    *   **Description:** Creates a new todo task for the authenticated user.
    *   **Authentication:** Required (JWT)
    *   **Request Body:** `CreateTaskRequest`
    *   **Response:** `TaskResponse` or `ErrorResponse`
    *   **Status Codes:** `201 Created`, `400 Bad Request`, `401 Unauthorized`, `422 Unprocessable Entity`
*   **`PUT /tasks/{task_id}`**
    *   **Description:** Updates an existing todo task for the authenticated user.
    *   **Authentication:** Required (JWT)
    *   **Request Body:** `UpdateTaskRequest`
    *   **Response:** `TaskResponse` or `ErrorResponse`
    *   **Status Codes:** `200 OK`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `422 Unprocessable Entity`
*   **`DELETE /tasks/{task_id}`**
    *   **Description:** Deletes a specific todo task for the authenticated user.
    *   **Authentication:** Required (JWT)
    *   **Request Body:** None
    *   **Response:** `MessageResponse` or `ErrorResponse`
    *   **Status Codes:** `200 OK`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`

## 5. Request/Response Schemas

### 5.1. Common Schemas

*   **`MessageResponse`**
    ```json
    {
      "message": "string"
    }
    ```
*   **`ErrorResponse`**
    ```json
    {
      "detail": "string"
    }
    ```

### 5.2. Auth Schemas

*   **`SignupRequest`**
    ```json
    {
      "email": "string (email format)",
      "password": "string (min 8 chars, strong)"
    }
    ```
*   **`LoginRequest`**
    ```json
    {
      "email": "string (email format)",
      "password": "string"
    }
    ```
*   **`TokenResponse`**
    ```json
    {
      "access_token": "string",
      "token_type": "bearer"
    }
    ```

### 5.3. User Schemas

*   **`UserResponse`**
    ```json
    {
      "id": "string (UUID)",
      "email": "string (email format)",
      "created_at": "string (ISO 8601 datetime)",
      "updated_at": "string (ISO 8601 datetime)"
    }
    ```

### 5.4. Todo Task Schemas

*   **`CreateTaskRequest`**
    ```json
    {
      "title": "string",
      "description": "string (optional)",
      "due_date": "string (ISO 8601 datetime, optional)",
      "priority": "integer (1-5, optional)"
    }
    ```
*   **`UpdateTaskRequest`** (All fields optional, only provide what needs updating)
    ```json
    {
      "title": "string (optional)",
      "description": "string (optional)",
      "completed": "boolean (optional)",
      "due_date": "string (ISO 8601 datetime, optional)",
      "priority": "integer (1-5, optional)"
    }
    ```
*   **`TaskResponse`**
    ```json
    {
      "id": "string (UUID)",
      "user_id": "string (UUID)",
      "title": "string",
      "description": "string | null",
      "completed": "boolean",
      "created_at": "string (ISO 8601 datetime)",
      "updated_at": "string (ISO 8601 datetime)",
      "due_date": "string (ISO 8601 datetime) | null",
      "priority": "integer | null"
    }
    ```

## 6. Authorization Requirements

*   **Public Endpoints:**
    *   `POST /auth/signup`
    *   `POST /auth/login`
*   **Authenticated Endpoints (User-specific access):**
    *   `GET /users/me`: Requires a valid JWT. Returns information only for the authenticated user.
    *   `GET /tasks`: Requires a valid JWT. Returns tasks belonging only to the authenticated user.
    *   `GET /tasks/{task_id}`: Requires a valid JWT. Returns the task only if it belongs to the authenticated user.
    *   `POST /tasks`: Requires a valid JWT. Creates a task associated with the authenticated user.
    *   `PUT /tasks/{task_id}`: Requires a valid JWT. Updates the task only if it belongs to the authenticated user.
    *   `DELETE /tasks/{task_id}`: Requires a valid JWT. Deletes the task only if it belongs to the authenticated user.

## 7. Error Handling Rules

The API will return standardized JSON error responses.

*   **`400 Bad Request`**: Client-side input validation failed, malformed request, or general client error.
    *   Response: `ErrorResponse`
*   **`401 Unauthorized`**: Authentication required or failed (e.g., missing or invalid JWT token).
    *   Response: `ErrorResponse`
*   **`403 Forbidden`**: Authentication succeeded, but the user does not have permission to access the resource or perform the action (e.g., trying to access another user's task).
    *   Response: `ErrorResponse`
*   **`404 Not Found`**: The requested resource does not exist.
    *   Response: `ErrorResponse`
*   **`409 Conflict`**: Request conflicts with the current state of the server (e.g., attempting to register with an already existing email).
    *   Response: `ErrorResponse`
*   **`422 Unprocessable Entity`**: Semantic errors in the request payload that prevent processing (e.g., invalid data types in JSON fields, validation rules not met). FastAPI's Pydantic validation errors will typically result in this status.
    *   Response: `ErrorResponse` (potentially with more detailed validation errors in `detail`)
*   **`500 Internal Server Error`**: An unexpected error occurred on the server.
    *   Response: `ErrorResponse` (should avoid exposing sensitive internal details)

## 8. Security Constraints

*   **Data Validation:** All incoming data will be rigorously validated using FastAPI's Pydantic models to prevent injection attacks and ensure data integrity.
*   **Authentication & Authorization:**
    *   Passwords will always be hashed using a strong, industry-standard algorithm (e.g., bcrypt) before storage.
    *   JWTs will be used for all protected routes, verifying token validity and expiration.
    *   Authorization checks will ensure users can only access/modify their own resources.
*   **Input Sanitization:** While Pydantic helps, additional sanitization might be applied for text fields to prevent XSS (Cross-Site Scripting) if content is rendered on the frontend directly without proper escaping.
*   **Rate Limiting:** Implement basic rate limiting on authentication endpoints (login, signup) to mitigate brute-force attacks. (FastAPI extensions can provide this).
*   **HTTPS Enforcement:** The backend API should only be accessible via HTTPS to protect data in transit. This will be enforced at the deployment/server level.
*   **Sensitive Data Storage:** Only necessary user data will be stored. Passwords will never be stored in plain text. JWT secrets will be stored securely (e.g., environment variables).
*   **CORS:** Appropriate CORS policies will be configured to allow requests only from the trusted frontend origin(s).
*   **Dependency Security:** Keep all backend dependencies updated to patch known vulnerabilities. Regularly scan for security vulnerabilities in dependencies.