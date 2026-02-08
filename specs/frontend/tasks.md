# Frontend Implementation Tasks: Todo Web Application

This document outlines the sequential tasks for implementing the frontend of the Todo Web Application, based on the Frontend Implementation Plan. Each task is designed to be small, focused, and directly executable by an AI coding agent.

---

**Task 1: Basic Frontend Project Setup**
*   **Purpose:** Establish the foundational directory structure and initial Next.js application files as outlined in the plan.
*   **Scope:** `/frontend` directory, `app/`, `components/`, `lib/`, `public/`, `styles/` directories.
*   **Dependencies:** None.
*   **Acceptance Criteria:**
    *   The `/frontend` directory contains `src/app/`, `src/components/`, `src/lib/` and other necessary directories.
    *   `src/app/layout.tsx` exists with a basic HTML structure.
    *   `src/app/globals.css` exists.
    *   `src/app/page.tsx` exists as a placeholder.
*   **Completion Signal:** Directory structure is created and empty placeholder files are present in the specified locations.

**Task 2: Configure Tailwind CSS**
*   **Purpose:** Set up Tailwind CSS for styling the application, enabling utility-first design.
*   **Scope:** `tailwind.config.ts`, `postcss.config.js`, `src/app/globals.css`
*   **Dependencies:** Task 1.
*   **Acceptance Criteria:**
    *   `tailwind.config.ts` and `postcss.config.js` are correctly configured.
    *   `src/app/globals.css` imports Tailwind directives.
    *   A simple test component uses a Tailwind class and renders correctly.
*   **Completion Signal:** `npm run dev` starts without Tailwind CSS errors, and a basic element styled with Tailwind classes appears correctly in the browser.

**Task 3: Implement Reusable UI Component: Button**
*   **Purpose:** Create a generic, reusable Button component with basic styling variations.
*   **Scope:** `frontend/src/components/ui/Button.tsx`
*   **Dependencies:** Task 2.
*   **Acceptance Criteria:**
    *   `Button.tsx` is created.
    *   The component accepts children and standard HTML button props.
    *   Supports primary, secondary, and danger variants using Tailwind CSS.
    *   Includes basic accessibility attributes.
*   **Completion Signal:** `Button.tsx` is created and can be imported and used in other components, displaying correct styling variants.

**Task 4: Implement Reusable UI Component: Input**
*   **Purpose:** Create a generic, reusable Input component with proper styling, label, and error display.
*   **Scope:** `frontend/src/components/ui/Input.tsx`
*   **Dependencies:** Task 2.
*   **Acceptance Criteria:**
    *   `Input.tsx` is created.
    *   The component accepts `label`, `id`, `name`, `type`, `value`, `onChange`, `errorMessage` props.
    *   Styled using Tailwind CSS, including focus states and error styling.
    *   Includes accessibility attributes for labels.
*   **Completion Signal:** `Input.tsx` is created and can be imported and used in other components, displaying correct styling, label, and error messages.

**Task 5: Implement Reusable UI Component: ErrorMessage**
*   **Purpose:** Create a simple component to display error messages consistently across the application.
*   **Scope:** `frontend/src/components/ui/ErrorMessage.tsx`
*   **Dependencies:** Task 2.
*   **Acceptance Criteria:**
    *   `ErrorMessage.tsx` is created.
    *   The component accepts a `message` prop (string) and displays it with appropriate error styling.
*   **Completion Signal:** `ErrorMessage.tsx` is created and can be imported and used, displaying text with error styling.

**Task 6: Implement Reusable UI Component: LoadingSpinner**
*   **Purpose:** Create a visual indicator for loading states.
*   **Scope:** `frontend/src/components/ui/LoadingSpinner.tsx`
*   **Dependencies:** Task 2.
*   **Acceptance Criteria:**
    *   `LoadingSpinner.tsx` is created.
    *   The component renders a scalable SVG or animated div for a loading animation.
*   **Completion Signal:** `LoadingSpinner.tsx` is created and can be imported and used, displaying a visible loading animation.

**Task 7: Implement Reusable UI Component: Modal**
*   **Purpose:** Create a generic modal component for dialogs and forms.
*   **Scope:** `frontend/src/components/ui/Modal.tsx`
*   **Dependencies:** Task 2.
*   **Acceptance Criteria:**
    *   `Modal.tsx` is created.
    *   The component accepts `isOpen`, `onClose`, and `children` props.
    *   Renders a modal overlay and a content area that centers on the screen.
    *   Clicking the overlay or an escape key press calls `onClose`.
    *   Includes accessibility attributes (e.g., `aria-modal`, `role="dialog"`).
*   **Completion Signal:** `Modal.tsx` is created and can be used to display content in a modal overlay, with close functionality working.

**Task 8: Implement Type Definitions**
*   **Purpose:** Define shared TypeScript interfaces and types for application data structures.
*   **Scope:** `frontend/src/lib/types.ts`
*   **Dependencies:** None.
*   **Acceptance Criteria:**
    *   `types.ts` is created.
    *   Includes `User` interface (e.g., `email`, `id`), `AuthCredentials` interface (`email`, `password`), `Task` interface (e.g., `id`, `title`, `description`, `completed`).
*   **Completion Signal:** `types.ts` is created with necessary interfaces, and no TypeScript errors are reported for these type definitions.

**Task 9: Implement Authentication Utilities (`auth.ts`)**
*   **Purpose:** Create utilities for storing, retrieving, and removing JWT tokens from HTTP-only cookies.
*   **Scope:** `frontend/src/lib/auth.ts`
*   **Dependencies:** Task 8.
*   **Acceptance Criteria:**
    *   `auth.ts` is created.
    *   Contains `setToken(token: string)` to store the JWT in a cookie.
    *   Contains `getToken(): string | null` to retrieve the JWT from a cookie.
    *   Contains `removeToken()` to delete the JWT from a cookie.
    *   Uses a client-side mechanism for cookie handling (e.g., `js-cookie` or raw `document.cookie`).
*   **Completion Signal:** `auth.ts` functions are implemented and can successfully set, get, and remove a mock JWT from cookies.

**Task 10: Implement Base API Client (`api.ts`)**
*   **Purpose:** Create a centralized client for making HTTP requests to the backend API, including request interception for JWT attachment and basic error handling.
*   **Scope:** `frontend/src/lib/api.ts`
*   **Dependencies:** Task 9.
*   **Acceptance Criteria:**
    *   `api.ts` is created with a base function (e.g., `apiClient`) that takes `method`, `url`, `data` (for body), and `isAuthenticated` flag.
    *   It automatically sets the `Content-Type` to `application/json`.
    *   Includes a mechanism to read the JWT using `auth.getToken()` if `isAuthenticated` is true, and attach it as a `Bearer` token in the `Authorization` header.
    *   Handles basic network errors and API response errors (e.g., non-2xx status codes).
    *   Configured with a `BASE_URL` for the backend API.
*   **Completion Signal:** `api.ts` is created, and its base client function can make HTTP requests with optional JWT attachment and rudimentary error logging.

**Task 11: Implement Authentication API Endpoints in Client**
*   **Purpose:** Add specific functions to `api.ts` for handling user login and signup with the backend.
*   **Scope:** `frontend/src/lib/api.ts`
*   **Dependencies:** Task 10.
*   **Acceptance Criteria:**
    *   `api.ts` includes `login(credentials: AuthCredentials)` function.
    *   `api.ts` includes `signup(credentials: AuthCredentials)` function.
    *   Both functions use the base API client.
    *   `login` returns the JWT upon success.
*   **Completion Signal:** `login` and `signup` functions are defined in `api.ts` and correctly interact with the base API client.

**Task 12: Implement `AuthForm` Component**
*   **Purpose:** Create a reusable form component for user authentication (login and signup).
*   **Scope:** `frontend/src/components/feature/AuthForm.tsx`
*   **Dependencies:** Tasks 3, 4, 5.
*   **Acceptance Criteria:**
    *   `AuthForm.tsx` is created.
    *   Accepts `type` prop ("login" or "signup"), `onSubmit` function, `isLoading` boolean, `errorMessage` string.
    *   Includes `Input` components for email and password.
    *   Includes a `Button` component for submission, disabled when `isLoading`.
    *   Displays `ErrorMessage` if `errorMessage` is provided.
    *   Handles form state (email, password).
*   **Completion Signal:** `AuthForm.tsx` is created, renders correctly with input fields, a submit button, and displays error messages and loading states as expected.

**Task 13: Implement Login Page (`/login`)**
*   **Purpose:** Create the login page, integrating `AuthForm` and handling authentication flow.
*   **Scope:** `frontend/src/app/(auth)/login/page.tsx`
*   **Dependencies:** Tasks 9, 11, 12.
*   **Acceptance Criteria:**
    *   `login/page.tsx` is created.
    *   Renders the `AuthForm` component with `type="login"`.
    *   On `AuthForm` submission:
        *   Calls `api.login`.
        *   On success, calls `auth.setToken` and redirects to `/dashboard`.
        *   On failure, sets and displays an error message.
    *   Manages loading state for the form.
    *   Implements client-side redirection to `/dashboard` if already authenticated.
*   **Completion Signal:** Users can navigate to `/login`, attempt to log in (mocking API response or using actual backend if available), and observe correct redirection or error messages.

**Task 14: Implement Signup Page (`/signup`)**
*   **Purpose:** Create the signup page, integrating `AuthForm` and handling user registration flow.
*   **Scope:** `frontend/src/app/(auth)/signup/page.tsx`
*   **Dependencies:** Tasks 11, 12.
*   **Acceptance Criteria:**
    *   `signup/page.tsx` is created.
    *   Renders the `AuthForm` component with `type="signup"`.
    *   On `AuthForm` submission:
        *   Calls `api.signup`.
        *   On success, redirects to `/login`.
        *   On failure, sets and displays an error message.
    *   Manages loading state for the form.
    *   Implements client-side redirection to `/dashboard` if already authenticated.
*   **Completion Signal:** Users can navigate to `/signup`, attempt to register, and observe correct redirection or error messages.

**Task 15: Implement `middleware.ts` for Route Protection**
*   **Purpose:** Protect authenticated routes using Next.js Middleware.
*   **Scope:** `frontend/middleware.ts`
*   **Dependencies:** Task 9.
*   **Acceptance Criteria:**
    *   `middleware.ts` is created in the root of the `frontend` directory.
    *   Intercepts requests to protected routes (e.g., `/dashboard/*`).
    *   Checks for the presence of a JWT in the cookies.
    *   If no JWT, redirects unauthenticated users to `/login`.
    *   Allows authenticated users to access protected routes.
    *   Public routes (e.g., `/login`, `/signup`) are excluded from redirection.
*   **Completion Signal:** Accessing `/dashboard` without a valid token redirects to `/login`. Accessing `/dashboard` with a valid token grants access.

**Task 16: Implement Dashboard Layout (`app/(dashboard)/layout.tsx`)**
*   **Purpose:** Create a dedicated layout for authenticated users, providing consistent UI elements like a header.
*   **Scope:** `frontend/src/app/(dashboard)/layout.tsx`
*   **Dependencies:** Task 15 (conceptually, depends on protected routing being in place).
*   **Acceptance Criteria:**
    *   `app/(dashboard)/layout.tsx` is created.
    *   Renders its children within a common structure.
    *   Includes a placeholder `Header` component.
*   **Completion Signal:** Navigating to `/dashboard` displays the dashboard layout with its header.

**Task 17: Implement Task-Related API Endpoints in Client**
*   **Purpose:** Add functions to `api.ts` for CRUD operations on tasks.
*   **Scope:** `frontend/src/lib/api.ts`
*   **Dependencies:** Task 10.
*   **Acceptance Criteria:**
    *   `api.ts` includes `getTasks()`, `createTask(taskData)`, `updateTask(id, taskData)`, `deleteTask(id)` functions.
    *   All functions use the base API client with `isAuthenticated` set to true.
    *   Types for `taskData` and return values are correctly used from `types.ts`.
*   **Completion Signal:** These functions are defined in `api.ts` and correctly interact with the base API client for task operations.

**Task 18: Implement `Header` Component**
*   **Purpose:** Create the application header with basic navigation and a logout button.
*   **Scope:** `frontend/src/components/ui/Header.tsx`
*   **Dependencies:** Tasks 3, 9.
*   **Acceptance Criteria:**
    *   `Header.tsx` is created.
    *   Displays a title or logo.
    *   Includes a logout `Button` that calls `auth.removeToken()` and redirects to `/login`.
*   **Completion Signal:** `Header.tsx` is created, and the logout button successfully clears the token and redirects.

**Task 19: Implement `TaskCard` Component**
*   **Purpose:** Display individual task details and provide actions (edit, delete, toggle completion).
*   **Scope:** `frontend/src/components/feature/TaskCard.tsx`
*   **Dependencies:** Tasks 3, 8.
*   **Acceptance Criteria:**
    *   `TaskCard.tsx` is created.
    *   Accepts a `task: Task` prop.
    *   Displays task title, description, and completion status.
    *   Includes buttons for "Edit", "Delete", and a checkbox/button to "Toggle Completion".
    *   Emits events (`onEdit`, `onDelete`, `onToggleComplete`) for parent component to handle.
*   **Completion Signal:** `TaskCard.tsx` renders a task with its details and interactive elements.

**Task 20: Implement `TaskList` Component**
*   **Purpose:** Display a collection of `TaskCard` components.
*   **Scope:** `frontend/src/components/feature/TaskList.tsx`
*   **Dependencies:** Task 19.
*   **Acceptance Criteria:**
    *   `TaskList.tsx` is created.
    *   Accepts a `tasks: Task[]` prop.
    *   Maps over the `tasks` array to render `TaskCard` for each task.
    *   Passes through `onEdit`, `onDelete`, `onToggleComplete` handlers to `TaskCard`.
*   **Completion Signal:** `TaskList.tsx` renders a list of `TaskCard` components when provided with task data.

**Task 21: Implement `TaskForm` Component**
*   **Purpose:** Form for creating or editing tasks.
*   **Scope:** `frontend/src/components/feature/TaskForm.tsx`
*   **Dependencies:** Tasks 3, 4, 5, 8.
*   **Acceptance Criteria:**
    *   `TaskForm.tsx` is created.
    *   Accepts `initialTask?: Task` (for editing), `onSubmit`, `isLoading`, `errorMessage` props.
    *   Includes `Input` components for task title and description.
    *   Includes a `Button` for submission, disabled when `isLoading`.
    *   Displays `ErrorMessage` if `errorMessage` is provided.
    *   Handles form state for title and description.
    *   Populates form fields with `initialTask` data if provided.
*   **Completion Signal:** `TaskForm.tsx` renders correctly, allows input for title/description, and handles submission/loading/errors.

**Task 22: Implement Dashboard Page Logic and UI**
*   **Purpose:** Orchestrate the task management UI on the dashboard.
*   **Scope:** `frontend/src/app/(dashboard)/page.tsx`
*   **Dependencies:** Tasks 6, 17, 18, 20, 21.
*   **Acceptance Criteria:**
    *   `page.tsx` for dashboard is created.
    *   Fetches tasks using `api.getTasks()` on initial load, showing `LoadingSpinner`.
    *   Renders `TaskList` with fetched tasks.
    *   Provides a button to open a `Modal` containing `TaskForm` for creating new tasks.
    *   Handles `onEdit`, `onDelete`, `onToggleComplete` events from `TaskCard` by calling respective `api` functions and updating local task state.
    *   Displays `ErrorMessage` for API failures.
    *   Displays an empty state message if no tasks are present.
*   **Completion Signal:** The dashboard page loads, displays tasks, allows creating, editing, deleting, and toggling completion of tasks, with loading, error, and empty states handled.

**Task 23: Implement Responsive Design Pass**
*   **Purpose:** Ensure all components and pages adapt gracefully to different screen sizes.
*   **Scope:** All UI components (`components/ui`, `components/feature`) and pages (`app/`).
*   **Dependencies:** Tasks 1-22.
*   **Acceptance Criteria:**
    *   All interactive elements are touch-friendly on small screens.
    *   Layouts (especially dashboard and forms) reflow and stack appropriately on mobile.
    *   Tailwind's responsive utility classes are used effectively.
*   **Completion Signal:** Manually testing the application on different viewport sizes (browser dev tools) shows correct rendering and usability.

**Task 24: Implement Accessibility Pass**
*   **Purpose:** Enhance the accessibility of the application for users with disabilities.
*   **Scope:** All UI components (`components/ui`, `components/feature`) and pages (`app/`).
*   **Dependencies:** Tasks 1-23.
*   **Acceptance Criteria:**
    *   All forms have correctly associated labels.
    *   Interactive elements are keyboard navigable and operable.
    *   Semantic HTML is used where appropriate.
    *   ARIA attributes are used for custom interactive elements (e.g., `Modal`).
    *   Color contrast meets WCAG guidelines (verified visually or with dev tools).
*   **Completion Signal:** Auditing the application with accessibility tools (e.g., Lighthouse, axe DevTools) shows no major accessibility violations.

**Task 25: UI Polish & Consistency Pass**
*   **Purpose:** Review and refine the visual appearance of the application for a professional, consistent look and feel.
*   **Scope:** All UI components and pages.
*   **Dependencies:** Tasks 1-24.
*   **Acceptance Criteria:**
    *   Consistent spacing, typography, and color palette across the application.
    *   Smooth animations (if any) and transitions.
    *   All UI elements align with a professional, SaaS-quality aesthetic.
*   **Completion Signal:** The application's UI is visually appealing, cohesive, and meets the "hackathon-ready" quality bar.