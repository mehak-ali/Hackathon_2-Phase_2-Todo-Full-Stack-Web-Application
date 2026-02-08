import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('authToken');
  const { pathname } = request.nextUrl;

  // Define routes that are always public, even for authenticated users.
  // The home page '/' is now public-first.
  const publicRoutes = ['/', '/login', '/signup'];

  // Allow requests to static files and Next.js internal paths
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/public') ||
    /\.(.*)$/.test(pathname) // Matches files like favicon.ico, images, etc.
  ) {
    return NextResponse.next();
  }

  // If authenticated and trying to access login/signup, redirect to home page.
  if (token && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If accessing a non-public route (e.g., /dashboard, /profile) and not authenticated, redirect to login.
  // The home page '/' is explicitly in publicRoutes, so this condition will not apply to it.
  if (!publicRoutes.includes(pathname) && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Update matcher to include all paths except static files and API routes.
  // This essentially means the middleware runs for all server-side requests.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
