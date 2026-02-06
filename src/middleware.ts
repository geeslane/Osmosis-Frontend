import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSessionCookie } from '@/lib/session';

const ROLE_ACCESS: Record<string, string[]> = {
  superadmin: [
    '/dashboard',
    '/dashboard/admin',
    '/dashboard/mentor',
    '/dashboard/mentee',
    '/dashboard/settings',
  ],
  ADMIN: ['/dashboard', '/dashboard/pending-requests', '/dashboard/modules'],
  mentor: ['/dashboard', '/dashboard/mentee'],
  mentee: ['/dashboard'],
};

const authPages = ['/signin', '/signup'];

export async function middleware(request: NextRequest) {
  const session = await getSessionCookie();
  const token = typeof session === 'string' ? session : session?.token;
  const role = typeof session === 'string' ? undefined : session?.role;
  const { pathname } = request.nextUrl;

  if (token && authPages.includes(pathname)) {
    const redirectPath =
      request.nextUrl.searchParams.get('redirect') || '/dashboard';
    const redirectUrl = new URL(redirectPath, request.url);
    return NextResponse.redirect(redirectUrl);
  }

  const protectedRoutePrefix = '/dashboard';
  if (!token && pathname.startsWith(protectedRoutePrefix)) {
    const url = request.nextUrl.clone();
    url.pathname = '/signin';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  if (token && role) {
    const allowedRoutes = ROLE_ACCESS[role] || [];
    const isAllowed = allowedRoutes.some((route) => pathname.startsWith(route));

    if (!isAllowed) {
      const url = request.nextUrl.clone();
      // Redirect to dashboard main page if user has access but not to this specific route
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/signin', '/signup'],
};
