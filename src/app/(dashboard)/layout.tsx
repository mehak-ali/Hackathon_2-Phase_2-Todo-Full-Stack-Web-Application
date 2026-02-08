import React from 'react';
import Header from '@/components/ui/Header'; // Will be implemented in a later task

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header /> {/* Placeholder Header component */}
      <main className="flex-grow container mx-auto p-4">
        {children}
      </main>
    </div>
  );
}
