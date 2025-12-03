import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSessionCookie } from '@/lib/session';

export async function middleware(request: NextRequest) {
  const session = await getSessionCookie();
  const token = typeof session === 'string' ? session : session?.token;
  const role = typeof session === 'string' ? undefined : session?.role;
  const { pathname } = request.nextUrl;
  const authPages = ['/signin', '/signup'];
  const protectedRoutes = ['/dashboard'];
  const adminOnlyRoutes = ['/dashboard/admin'];

  if (token && authPages.includes(pathname)) {
    const redirectPath =
      request.nextUrl.searchParams.get('redirect') || '/dashboard';
    const redirectUrl = new URL(redirectPath, request.url);
    return NextResponse.redirect(redirectUrl);
  }

  if (!token && protectedRoutes.some((route) => pathname.startsWith(route))) {
    const url = request.nextUrl.clone();
    url.pathname = '/signin';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  if (
    token &&
    adminOnlyRoutes.some((route) => pathname.startsWith(route)) &&
    role !== 'admin'
  ) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/signin', '/signup'],
};
