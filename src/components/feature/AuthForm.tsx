import React, { useState } from 'react';
import Link from 'next/link';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ErrorMessage from '../ui/ErrorMessage';
import { AuthCredentials } from '@/lib/types';

interface AuthFormProps {
  type: 'login' | 'signup';
  onSubmit: (credentials: AuthCredentials) => void;
  isLoading: boolean;
  errorMessage?: string;
}

const AuthForm: React.FC<AuthFormProps> = ({ type, onSubmit, isLoading, errorMessage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-text mb-6">
        {type === 'login' ? 'Login' : 'Sign Up'}
      </h2>

      <Input
        id="email"
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={isLoading}
      />

      <Input
        id="password"
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        disabled={isLoading}
      />

      {errorMessage && <ErrorMessage message={errorMessage} className="mb-4 text-center" />}

      <Button type="submit" isLoading={isLoading} disabled={isLoading} className="w-full mt-4">
        {type === 'login' ? 'Login' : 'Sign Up'}
      </Button>

      <div className="mt-4 text-center">
        {type === 'login' ? (
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/signup" className="text-primary hover:underline">
              Sign Up
            </Link>
          </p>
        ) : (
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline">
              Login
            </Link>
          </p>
        )}
      </div>
    </form>
  );
};

export default AuthForm;
