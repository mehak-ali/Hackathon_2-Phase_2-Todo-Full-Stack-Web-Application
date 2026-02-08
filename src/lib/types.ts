export interface User {
  id: string;
  email: string;
  // Add other user-related fields if necessary
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  // Add other task-related fields if necessary, e.g., userId, createdAt, updatedAt
}
