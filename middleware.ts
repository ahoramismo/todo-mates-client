// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/login', '/register'];

export const config = {
  matcher: ['/', '/login', '/register'], // adjust based on your app
};

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;

  const isPublic = PUBLIC_PATHS.includes(request.nextUrl.pathname);

  if (!token && !isPublic) {
    // Redirect to login if trying to access protected page
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token && isPublic) {
    // If already logged in, redirect away from login/register
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

