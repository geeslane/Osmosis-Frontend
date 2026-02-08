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
  MENTOR: [
    '/dashboard',
    '/dashboard/mentee',
    '/dashboard/modules',
    '/dashboard/users/mentee',
    '/dashboard/calls/mentee',
    '/dashboard/availabilty-schedule',
  ],
  MENTEE: ['/dashboard'],
};

const authPages = ['/signin', '/signup'];

export async function middleware(request: NextRequest) {
  const session = await getSessionCookie();

  const token = typeof session === 'string' ? session : session?.token;
  const role = typeof session === 'string' ? undefined : session?.role;

  const { pathname } = request.nextUrl;

  /* ---------------- Auth Pages Redirect ---------------- */
  if (token && authPages.includes(pathname)) {
    const redirectPath =
      request.nextUrl.searchParams.get('redirect') || '/dashboard';

    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  /* ---------------- Protect Dashboard ---------------- */
  if (!token && pathname.startsWith('/dashboard')) {
    const url = request.nextUrl.clone();
    url.pathname = '/signin';
    url.searchParams.set('redirect', pathname);

    return NextResponse.redirect(url);
  }

  /* ---------------- Role Authorization ---------------- */
  if (token && role) {
    const allowedRoutes = ROLE_ACCESS[role] || [];

    const isAllowed = allowedRoutes.some((route) => {
      if (route === '/dashboard') {
        return pathname === '/dashboard';
      }

      return pathname === route || pathname.startsWith(route + '/');
    });

    if (!isAllowed) {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/signin', '/signup'],
};
