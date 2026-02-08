'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from './Button';
import { removeToken } from '@/lib/auth';

const Header: React.FC = () => {
  const router = useRouter();

  const handleLogout = () => {
    removeToken();
    router.push('/login');
  };

  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center">
      <Link href="/dashboard" className="text-2xl font-bold text-primary">
        Todo App
      </Link>
      <nav>
        <Button onClick={handleLogout} variant="ghost">
          Logout
        </Button>
      </nav>
    </header>
  );
};

export default Header;
