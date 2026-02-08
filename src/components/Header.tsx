'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Button from './Button';
import { isAuthenticated, removeToken } from '@/lib/auth'; // Assuming removeToken function exists

const Header: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const authenticated = isAuthenticated();

  const handleLogout = () => {
    removeToken();
    router.push('/login'); // Redirect to login page after logout
  };

  return (
    <header className="bg-primary text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Todo App
        </Link>
        <nav>
          {authenticated ? (
            <Button onClick={handleLogout} variant="secondary">
              Logout
            </Button>
          ) : (
            <div className="space-x-4">
              {pathname !== '/login' && (
                <Link href="/login">
                  <Button variant="secondary">Login</Button>
                </Link>
              )}
              {pathname !== '/signup' && (
                <Link href="/signup">
                  <Button variant="secondary">Sign Up</Button>
                </Link>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
