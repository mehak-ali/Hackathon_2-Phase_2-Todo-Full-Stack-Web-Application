# Frontend Implementation Plan: Todo Web Application

## 1. Frontend Folder & File Structure

The frontend application will follow a modular and scalable structure adhering to Next.js App Router best practices, organizing code by feature and type.

1.1. **Root (`/frontend`)**
    *   `app/`: Contains all route segments and their associated UI.
    *   `components/`: Reusable UI components.
    *   `lib/`: Utility functions, API clients, and type definitions.
    *   `public/`: Static assets.
    *   `styles/`: Global stylesheets.
    *   `hooks/`: Custom React hooks.
    *   `context/`: React Context providers for global state.

1.2. **`app/` Structure**
    *   `layout.tsx`: Root layout for the entire application.
    *   `page.tsx`: Home page (e.g., redirect to dashboard if authenticated).
    *   `(auth)/`: Route group for authentication-related pages.
        *   `login/page.tsx`: Login page.
        *   `signup/page.tsx`: Sign-up page.
    *   `(dashboard)/`: Route group for authenticated dashboard pages.
        *   `layout.tsx`: Dashboard-specific layout (e.g., persistent header/sidebar).
        *   `page.tsx`: Main dashboard page displaying tasks.
        *   `tasks/`: Sub-routes for task management (e.g., `[id]/page.tsx` for task detail).

1.3. **`components/` Structure**
    *   `ui/`: Generic, unopinionated UI components (e.g., Button, Input, Modal, LoadingSpinner).
    *   `feature/`: Components specific to a feature (e.g., TaskCard, TaskForm, TaskList, AuthForm).

1.4. **`lib/` Structure**
    *   `api.ts`: API client for interacting with the backend.
    *   `auth.ts`: Authentication utilities (token storage, retrieval, validation).
    *   `types.ts`: Shared TypeScript interfaces and types.
    *   `utils.ts`: General utility functions.

## 2. Page-by-Page Breakdown

### 2.1. Login Page (`app/(auth)/login/page.tsx`)
    *   **Responsibility:** Handle user login, capture credentials, send to API, store JWT, and redirect.
    *   **Components:** `AuthForm` (for input fields and submit button), `ErrorMessage`.
    *   **State:** Local state for form inputs and loading/error states.
    *   **Flow:**
        1.  User enters email and password.
        2.  On submit, disable form, show loading spinner.
        3.  Call `api.login` with credentials.
        4.  On success, store JWT using `auth.setToken` and redirect to dashboard.
        5.  On failure, display error message via `ErrorMessage` component.

### 2.2. Signup Page (`app/(auth)/signup/page.tsx`)
    *   **Responsibility:** Handle user registration, capture credentials, send to API, and redirect to login.
    *   **Components:** `AuthForm`, `ErrorMessage`.
    *   **State:** Local state for form inputs and loading/error states.
    *   **Flow:**
        1.  User enters email and password.
        2.  On submit, disable form, show loading spinner.
        3.  Call `api.signup` with credentials.
        4.  On success, redirect to login page.
        5.  On failure, display error message via `ErrorMessage` component.

### 2.3. Dashboard Page (`app/(dashboard)/page.tsx`)
    *   **Responsibility:** Display list of tasks, allow task creation/editing/deletion.
    *   **Components:** `Header`, `TaskList`, `TaskCard`, `TaskForm`, `Modal`, `LoadingSpinner`, `ErrorMessage`.
    *   **State:** Global state for tasks (fetched from API), local state for `TaskForm` and modal visibility.
    *   **Flow:**
        1.  On load, fetch tasks using `api.getTasks`. Show `LoadingSpinner`.
        2.  Display tasks using `TaskList` and `TaskCard` components.
        3.  Provide UI for adding a new task (e.g., button opens `Modal` containing `TaskForm`).
        4.  Provide UI for editing/deleting tasks within `TaskCard`.
        5.  Handle task creation/update/deletion via API calls, updating global task state upon success.
        6.  Handle empty state: If no tasks, display a message and prompt to add one.
        7.  Handle errors during task fetching/operations via `ErrorMessage`.

## 3. Component Hierarchy & Responsibilities

### 3.1. Layout Components
    *   **`RootLayout` (`app/layout.tsx`):** Provides global structure (e.g., `<html>`, `<body>`, global styles).
    *   **`AuthLayout` (`app/(auth)/layout.tsx` - if needed, otherwise use `RootLayout`):** Wraps authentication pages, potentially centering content.
    *   **`DashboardLayout` (`app/(dashboard)/layout.tsx`):** Provides persistent UI elements for authenticated users (e.g., `Header`, `Sidebar` if applicable, `Footer`).

### 3.2. Page Components
    *   **Login/Signup Pages:** Primarily use `AuthForm` component and error handling.
    *   **Dashboard Page:** Orchestrates `TaskList`, `TaskForm`, `Header`, `Modal`.

### 3.3. Reusable UI Components (`components/ui`)
    *   **`Button.tsx`:** Standard button with variations (primary, secondary, danger).
    *   **`Input.tsx`:** Styled input field with label and optional error display.
    *   **`ErrorMessage.tsx`:** Displays generic error messages.
    *   **`LoadingSpinner.tsx`:** Visual indicator for loading states.
    *   **`Modal.tsx`:** Generic modal component for dialogs (e.g., task forms, confirmations).
    *   **`Header.tsx`:** Application header with logo, navigation, and user actions (e.g., logout button).

### 3.4. Feature-Specific Components (`components/feature`)
    *   **`AuthForm.tsx`:** Encapsulates email/password input fields and submission logic for login/signup.
    *   **`TaskList.tsx`:** Displays a list of `TaskCard` components.
    *   **`TaskCard.tsx`:** Displays individual task details, includes actions (edit, delete, toggle completion).
    *   **`TaskForm.tsx`:** Form for creating or editing tasks, including input fields and submission.

## 4. State Management Strategy

### 4.1. Server State (Data from API)
    *   **Strategy:** Utilize Next.js data fetching mechanisms (e.g., `fetch` directly in Server Components or `useEffect` + `fetch` in Client Components) combined with a simple caching strategy or a dedicated data fetching library if complex caching/revalidation is required later. For initial phase, direct `fetch` calls will suffice.
    *   **Examples:** List of tasks on the dashboard.

### 4.2. UI State (Client-side interactivity)
    *   **Strategy:** React's `useState` for local component state (e.g., form input values, modal visibility). `useReducer` for more complex local state. `React Context` for global UI state (e.g., authentication status, theme) if not handled by `auth.ts` or route protection directly.
    *   **Examples:** Form input values, loading indicators, error messages, modal open/close state.

## 5. API Client Design (`/lib/api.ts`)

### 5.1. Base Client
    *   **Responsibility:** Centralized function to make HTTP requests to the backend API.
    *   **Configuration:** Base URL for the API.
    *   **Interceptors:** Automatically attach JWT to requests where required. Handle error responses consistently.

### 5.2. Authentication Endpoints
    *   `login(credentials)`: Sends POST request to `/auth/login`, returns JWT.
    *   `signup(credentials)`: Sends POST request to `/auth/signup`.

### 5.3. Task Endpoints
    *   `getTasks()`: Sends GET request to `/tasks`, returns list of tasks.
    *   `createTask(taskData)`: Sends POST request to `/tasks`, returns new task.
    *   `getTaskById(id)`: Sends GET request to `/tasks/{id}`, returns single task.
    *   `updateTask(id, taskData)`: Sends PUT request to `/tasks/{id}`, returns updated task.
    *   `deleteTask(id)`: Sends DELETE request to `/tasks/{id}`.

## 6. JWT Attachment Flow (Frontend Responsibility Only)

### 6.1. Storage
    *   **Mechanism:** Store JWT securely in HTTP-only cookies on the client-side after successful login/signup. This is a common and secure approach for web applications. `auth.ts` will handle setting and retrieving these.

### 6.2. Automatic Attachment
    *   **Mechanism:** The `api.ts` client will be designed to read the JWT from the HTTP-only cookie and include it in the `Authorization` header of all subsequent API requests.
    *   **Format:** `Authorization: Bearer <JWT_TOKEN>`.
    *   **No Verification:** The frontend will *not* verify the JWT's signature or expiry. This is the responsibility of the backend.

### 6.3. Logout
    *   **Mechanism:** `auth.ts` will provide a `logout` function that removes the JWT from the cookie and redirects the user to the login page.

## 7. Route Protection Strategy

### 7.1. Middleware (`middleware.ts`)
    *   **Responsibility:** Intercept requests to protected routes (`/dashboard`, etc.) and check for authentication status *before* rendering.
    *   **Mechanism:**
        1.  Check for the presence of the authentication token (JWT in cookie).
        2.  If token is valid (presence check only), allow access.
        3.  If no token or token is invalid (no actual verification, just presence), redirect to `/login`.
        4.  Define public routes that do not require authentication (e.g., `/login`, `/signup`).

### 7.2. Client-side Redirection
    *   For routes that should only be accessible when *not* authenticated (e.g., `/login`, `/signup`), use client-side logic (e.g., in a `useEffect` hook in the page component or a wrapper component) to redirect to `/dashboard` if an authentication token is present. This provides a better user experience than waiting for server-side redirection after a full page load.

## 8. Loading, Error & Empty State Handling

### 8.1. Loading States
    *   **Mechanism:** Use `LoadingSpinner` component.
    *   **Placement:** Display a full-page spinner for initial page loads of data-dependent pages (e.g., Dashboard). Display smaller inline spinners for form submissions or component-specific data fetches.

### 8.2. Error States
    *   **Mechanism:** Use `ErrorMessage` component.
    *   **API Errors:** Centralized error handling in `api.ts` to catch common HTTP errors (4xx, 5xx) and format them into user-friendly messages. Display these messages using the `ErrorMessage` component near the relevant UI element or globally as a toast/notification.
    *   **Form Validation Errors:** Display inline error messages next to form fields.

### 8.3. Empty States
    *   **Mechanism:** Conditional rendering of specific UI components.
    *   **Example:** On the Dashboard, if `api.getTasks()` returns an empty array, display a message like "No tasks yet! Add your first task." with a clear call to action.

## 9. Responsive Design Strategy

### 9.1. Mobile-First Approach
    *   **Mechanism:** Design and implement UI components starting with mobile layouts, then progressively enhance for larger screens.
    *   **Tooling:** Tailwind CSS utility classes (e.g., `sm:`, `md:`, `lg:`) for responsive styling.

### 9.2. Flexible Layouts
    *   **Mechanism:** Use Flexbox and Grid for layout management, allowing content to reflow and adapt gracefully to different screen sizes.

### 9.3. Touch-Friendly Interactions
    *   **Mechanism:** Ensure buttons and interactive elements are large enough for touch targets on mobile devices.

## 10. Accessibility Considerations

### 10.1. Semantic HTML
    *   **Mechanism:** Use appropriate HTML5 semantic elements (e.g., `<header>`, `<nav>`, `<main>`, `<button>`) to convey meaning and structure.

### 10.2. ARIA Attributes
    *   **Mechanism:** Employ WAI-ARIA attributes (e.g., `aria-label`, `aria-describedby`, `role`) for custom interactive components or to enhance semantics where native HTML is insufficient.

### 10.3. Keyboard Navigation
    *   **Mechanism:** Ensure all interactive elements are focusable and operable via keyboard (Tab, Enter, Space keys). Manage focus for modals and dynamic content.

### 10.4. Color Contrast
    *   **Mechanism:** Adhere to WCAG guidelines for color contrast ratios to ensure text is readable.

### 10.5. Form Labels
    *   **Mechanism:** Always associate labels with form inputs using the `for` attribute and `id` to aid screen readers.

## 11. Reusability & Scalability Decisions

### 11.1. Component-Based Architecture
    *   **Mechanism:** Break down UI into small, independent, and reusable components.
    *   **Benefit:** Easier maintenance, consistent UI, faster development.

### 11.2. Type Safety with TypeScript
    *   **Mechanism:** Use TypeScript for all frontend code. Define clear interfaces for API responses, component props, and state.
    *   **Benefit:** Reduces runtime errors, improves code readability, facilitates refactoring.

### 11.3. Consistent Styling with Tailwind CSS
    *   **Mechanism:** Leverage Tailwind CSS for a utility-first approach to styling, ensuring consistency across the application.
    *   **Benefit:** Rapid UI development, reduced CSS bundle size, easy customization.

### 11.4. Centralized API Client
    *   **Mechanism:** All API interactions go through a single `lib/api.ts` module.
    *   **Benefit:** Easy to add authentication headers, handle errors globally, and manage API versioning.

### 11.5. Folder Structure by Feature/Domain
    *   **Mechanism:** Group related files (components, hooks, types) within feature directories.
    *   **Benefit:** Improves discoverability, reduces merge conflicts, scales well with growing codebase.