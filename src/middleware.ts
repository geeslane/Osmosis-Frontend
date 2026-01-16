import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSessionCookie } from '@/lib/session';

export async function middleware(request: NextRequest) {
  const session = await getSessionCookie();
  const token = typeof session === 'string' ? session : session?.token;
  const { pathname } = request.nextUrl;

  const authPages = ['/signin', '/signup'];
  const protectedRoutes = ['/dashboard'];

  // If user is logged in and tries to access signin/signup, redirect to dashboard
  // Allow access to /auth/* pages (OTP, magic link, etc.) even when logged in
  if (token && authPages.includes(pathname)) {
    const redirectUrl = new URL('/dashboard/user-management', request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // If user is not logged in and tries to access protected routes, redirect to signin
  if (!token && protectedRoutes.some((route) => pathname.startsWith(route))) {
    const url = request.nextUrl.clone();
    url.pathname = '/signin';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/signin',
    '/signup',
    // Don't protect /auth/* routes in middleware - let ProtectedRoute handle it if needed
  ],
};
