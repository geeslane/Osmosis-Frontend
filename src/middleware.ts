import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSessionCookie } from '@/lib/session';

export async function middleware(request: NextRequest) {
  const session = await getSessionCookie();
  const token = session?.token;
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname === '/signin' || pathname === '/signup';
  const isProtectedRoute = pathname.startsWith('/dashboard');

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (!token && isProtectedRoute) {
    const url = new URL('/signin', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/signin', '/signup'],
};