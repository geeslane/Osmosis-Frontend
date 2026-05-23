import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSessionCookie } from '@/lib/session';
import { buildSignInUrlForProtectedPath } from '@/utils/googleCalendarAvailability';

const ROLE_ACCESS: Record<string, string[]> = {
  SUPERADMIN: [
    '/dashboard',
    '/dashboard/notifications',
    '/dashboard/admin',
    '/dashboard/mentor',
    '/dashboard/mentee',
    '/dashboard/calls/admin',
    '/dashboard/account-settings',
    '/dashboard/user',
    '/dashboard/modules',
    '/dashboard/program-schedule',
    '/dashboard/pending-requests',
    '/dashboard/live-sessions',
    '/dashboard/calls',
  ],
  ADMIN: [
    '/dashboard',
    '/dashboard/users',
    '/dashboard/calls/admin',
    '/dashboard/pending-requests',
    '/dashboard/live-sessions',
    '/dashboard/account-settings',
    '/dashboard/modules',
    '/dashboard/program-schedule',
    '/dashboard/calls',
    '/dashboard/notifications',
  ],
  MENTOR: [
    '/dashboard',
    '/dashboard/notifications',
    '/dashboard/mentee',
    '/dashboard/modules',
    '/dashboard/users/mentee',
    '/dashboard/calls/mentor',
    '/dashboard/availabilty-schedule',
    '/dashboard/live-sessions',
    '/dashboard/account-settings',
    '/mentor',
  ],
  TEENAGER: [
    '/dashboard',
    '/dashboard/notifications',
    '/dashboard/book-a-call',
    '/dashboard/modules/mentee',
    '/dashboard/modules',
    '/dashboard/calls/mentee',
    '/dashboard/live-sessions',
    '/dashboard/account-settings',
  ],
};

const authPages = ['/signin', '/signup'];

/** Public under /mentor — must not require a session (e.g. application signup). */
const PUBLIC_MENTOR_PREFIXES = ['/mentor/signup'];

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

  /* ---------------- Protect Dashboard & mentor OAuth return paths ---------------- */
  const isPublicMentorRoute = PUBLIC_MENTOR_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
  if (
    !token &&
    (pathname.startsWith('/dashboard') ||
      (pathname.startsWith('/mentor') && !isPublicMentorRoute))
  ) {
    const signIn = buildSignInUrlForProtectedPath(
      request.url,
      pathname,
      request.nextUrl.searchParams
    );
    return NextResponse.redirect(signIn);
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
  matcher: ['/dashboard/:path*', '/mentor/:path*', '/signin', '/signup'],
};
