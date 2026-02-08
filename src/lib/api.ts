import { getToken } from './auth';
import { AuthCredentials, Task } from './types'; // Assuming these types are defined

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'; // Default to FastAPI default port

interface ApiClientOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  data?: any;
  isAuthenticated?: boolean;
}

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number | null;
}

export const apiClient = async <T>(options: ApiClientOptions): Promise<ApiResponse<T>> => {
  let { method, url, data, isAuthenticated = false } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // If SKIP_AUTH is true, override isAuthenticated to bypass token checks
  if (process.env.NEXT_PUBLIC_SKIP_AUTH === 'true') {
    isAuthenticated = false; // Effectively bypass authentication for development
  }

  if (isAuthenticated) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      // If authentication is required but no token is found, return an error
      // This case should not be reached if NEXT_PUBLIC_SKIP_AUTH is true for task-related calls.
      // For login/signup, isAuthenticated is false initially.
      return { data: null, error: 'Authentication required', status: 401 };
    }
  }

  const config: RequestInit = {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, config);
    const responseData = await response.json();

    if (!response.ok) {
      return { data: null, error: responseData.detail || 'An error occurred', status: response.status };
    }

    return { data: responseData as T, error: null, status: response.status };
  } catch (error: any) {
    console.error('API Client Error:', error);
    return { data: null, error: error.message || 'Network error', status: null };
  }
};

// --- Authentication Endpoints ---

export const login = async (credentials: AuthCredentials): Promise<ApiResponse<{ access_token: string }>> => {
  return apiClient<{ access_token: string }>({
    method: 'POST',
    url: '/auth/login',
    data: credentials,
  });
};

export const signup = async (credentials: AuthCredentials): Promise<ApiResponse<any>> => {
  return apiClient<any>({
    method: 'POST',
    url: '/auth/signup',
    data: credentials,
  });
};

// --- Task Endpoints (Placeholder for now) ---
// These will be fully implemented in a later task.

export const getTasks = async (): Promise<ApiResponse<Task[]>> => {
  return apiClient<Task[]>({
    method: 'GET',
    url: '/tasks',
    isAuthenticated: true,
  });
};

export const createTask = async (taskData: Partial<Task>): Promise<ApiResponse<Task>> => {
  return apiClient<Task>({
    method: 'POST',
    url: '/tasks',
    data: taskData,
    isAuthenticated: true,
  });
};

export const getTaskById = async (id: string): Promise<ApiResponse<Task>> => {
    return apiClient<Task>({
        method: 'GET',
        url: `/tasks/${id}`,
        isAuthenticated: true,
    });
};

export const updateTask = async (id: string, taskData: Partial<Task>): Promise<ApiResponse<Task>> => {
  return apiClient<Task>({
    method: 'PUT',
    url: `/tasks/${id}`,
    data: taskData,
    isAuthenticated: true,
  });
};

export const deleteTask = async (id: string): Promise<ApiResponse<any>> => {
  return apiClient<any>({
    method: 'DELETE',
    url: `/tasks/${id}`,
    isAuthenticated: true,
  });
};