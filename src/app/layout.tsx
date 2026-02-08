import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header'; // Import the Header component

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Todo App',
  description: 'A modern todo application built with Next.js and FastAPI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Header /> {/* Add the Header component here */}
          <main className="flex-grow">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
