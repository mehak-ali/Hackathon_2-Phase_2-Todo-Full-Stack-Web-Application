'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '@/components/feature/AuthForm';
import { login } from '@/lib/api';
import { setToken, isAuthenticated } from '@/lib/auth';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Bypass authentication if NEXT_PUBLIC_SKIP_AUTH is true
    if (process.env.NEXT_PUBLIC_SKIP_AUTH === 'true') {
      router.replace('/');
      return;
    }
    // Client-side redirection if already authenticated
    if (isAuthenticated()) {
      router.replace('/');
    }
  }, [router]);

  const handleSubmit = async (credentials: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await login(credentials);
      if (response.data && response.data.access_token) {
        setToken(response.data.access_token);
        router.push('/');
      } else {
        if (response.error) {
          let errorMessage = 'Login failed. Please check your credentials.';
          if (typeof response.error === 'object' && response.error !== null) {
            if ('detail' in response.error) {
              if (Array.isArray(response.error.detail)) {
                // Handle FastAPI Pydantic validation errors (list of dicts)
                errorMessage = response.error.detail.map((err: any) => err.msg).join('; ');
              } else if (typeof response.error.detail === 'string') {
                // Handle FastAPI general errors (string)
                errorMessage = response.error.detail;
              }
            } else if ('msg' in response.error && typeof response.error.msg === 'string') {
                // Handle case where response.error itself is an error object like {msg: "..."}
                errorMessage = response.error.msg;
            }
          } else if (typeof response.error === 'string') {
            errorMessage = response.error;
          }
          setError(errorMessage);
        } else {
          setError('Login failed. Please check your credentials.');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred during login.');
    } finally {
      setIsLoading(false);
    }
  };

  if (process.env.NEXT_PUBLIC_SKIP_AUTH === 'true' || isAuthenticated()) {
    // Return null or a loading spinner while redirecting
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <AuthForm
        type="login"
        onSubmit={handleSubmit}
        isLoading={isLoading}
        errorMessage={error || undefined}
      />
    </div>
  );
}