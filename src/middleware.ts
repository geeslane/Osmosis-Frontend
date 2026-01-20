import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSessionCookie } from '@/lib/session';

export async function middleware(request: NextRequest) {
  const session = await getSessionCookie();
  const token = session?.token;
  const { pathname } = request.nextUrl;

  // DEBUG LOGS
  console.log(`--- Middleware Path: ${pathname} | Token Found: ${!!token} ---`);

  const isAuthPage = pathname === '/signin' || pathname === '/signup';
  const isProtectedRoute = pathname.startsWith('/dashboard');

  // 1. If user has a token and tries to go to signin -> move to dashboard
  if (token && isAuthPage) {
    console.log("-> Redirecting logged-in user to dashboard");
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 2. If NO token and trying to access dashboard -> move to signin
  if (!token && isProtectedRoute) {
    console.log("-> Unauthorized! Redirecting to signin");
    const url = new URL('/signin', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // 3. Otherwise, do nothing
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/signin', '/signup'],
};