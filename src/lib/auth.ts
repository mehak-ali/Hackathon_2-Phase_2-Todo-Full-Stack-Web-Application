// Note: To use this, you would typically install `js-cookie` (e.g., `npm install js-cookie` or `yarn add js-cookie`)
// For this task, we will assume it's available or use a basic `document.cookie` approach.
// For production, consider a more robust secure cookie management strategy.

import Cookies from 'js-cookie'; // This import will fail if js-cookie is not installed.

const TOKEN_KEY = 'authToken';

export const setToken = (token: string): void => {
  // Store JWT in an HTTP-only cookie.
  // In a real application, this would typically be handled by the backend
  // setting the cookie after authentication, using 'HttpOnly' and 'Secure' flags.
  // For frontend-only setting, we use js-cookie.
  Cookies.set(TOKEN_KEY, token, {
    expires: 7, // 7 days
    secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
    sameSite: 'Lax', // Protects against CSRF attacks
    // httpOnly: true // js-cookie cannot set HttpOnly from the client-side
  });
};

export const getToken = (): string | null => {
  return Cookies.get(TOKEN_KEY) || null;
};

export const removeToken = (): void => {
  Cookies.remove(TOKEN_KEY);
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};