'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '@/components/feature/AuthForm';
import { signup } from '@/lib/api'; // Use the signup API function
import { isAuthenticated } from '@/lib/auth';

export default function SignupPage() {
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
      router.replace('/'); // Or wherever authenticated users should go
    }
  }, [router]);

  const handleSubmit = async (credentials: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await signup(credentials); // Call the signup API
      if (response.data) {
        // Handle successful signup, e.g., redirect to login page
        router.push('/login?signupSuccess=true');
      } else {
        if (response.error) {
          let errorMessage = 'Signup failed. Please try again.';
          if (typeof response.error === 'object' && response.error !== null) {
            if ('detail' in response.error) {
              if (Array.isArray(response.error.detail)) {
                errorMessage = response.error.detail.map((err: any) => err.msg).join('; ');
              } else if (typeof response.error.detail === 'string') {
                errorMessage = response.error.detail;
              }
            } else if ('msg' in response.error && typeof response.error.msg === 'string') {
                errorMessage = response.error.msg;
            }
          } else if (typeof response.error === 'string') {
            errorMessage = response.error;
          }
          setError(errorMessage);
        } else {
          setError('Signup failed. Please try again.');
        }
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('An unexpected error occurred during signup.');
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
        type="signup" // Specify type as 'signup'
        onSubmit={handleSubmit}
        isLoading={isLoading}
        errorMessage={error || undefined}
      />
    </div>
  );
}
