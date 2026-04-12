/**
 * Map backend-stored notification `link` values (relative paths) to this app's
 * dashboard routes. Backend may omit `/dashboard`; some paths use legacy
 * `/mentor/...` or `/teenager/...` segments that do not exist in the Next router.
 *
 * See product spec: notifyAllAdmins / notifications.create link table.
 */

export type AppRole = string | undefined;

type Parsed = { pathname: string; search: string };

function parseNotificationLink(link: string): Parsed {
  const raw = link.trim().split('#')[0];
  if (!raw) return { pathname: '/dashboard/notifications', search: '' };

  if (raw.startsWith('http://') || raw.startsWith('https://')) {
    try {
      const u = new URL(raw);
      return {
        pathname: u.pathname || '/',
        search: u.search || '',
      };
    } catch {
      return { pathname: '/dashboard/notifications', search: '' };
    }
  }

  const q = raw.indexOf('?');
  if (q === -1) {
    const pathname = raw.startsWith('/') ? raw : `/${raw}`;
    return { pathname, search: '' };
  }
  const pathPart = raw.slice(0, q);
  const pathname = pathPart.startsWith('/') ? pathPart : `/${pathPart}`;
  return { pathname, search: raw.slice(q) };
}

/** Our call tabs use `role=`; normalize legacy `tab=` from older links. */
function alignCallTabQuery(pathname: string, search: string): string {
  if (!pathname.includes('/dashboard/calls/')) return search;
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
  if (!params.has('role')) {
    const tab = params.get('tab');
    if (tab) {
      params.delete('tab');
      params.set('role', tab);
    }
  }
  const q = params.toString();
  return q ? `?${q}` : '';
}

/**
 * Known backend paths -> in-app paths. Keys are pathname-only (no query).
 */
const STATIC_PATH_MAP: Record<string, { pathname: string; search: string }> = {
  '/admin/mentor-requests': {
    pathname: '/dashboard/pending-requests',
    search: '?role=mentor',
  },
  '/admin/teenager-requests': {
    pathname: '/dashboard/pending-requests',
    search: '?role=mentee',
  },
  '/mentor/me/calls/previous': {
    pathname: '/dashboard/calls/mentor',
    search: '?role=previous',
  },
  '/mentor/dashboard': { pathname: '/dashboard', search: '' },
  '/teenager/me/calls/upcoming': {
    pathname: '/dashboard/calls/mentee',
    search: '?role=upcoming',
  },
  '/teenager/me/calls/previous': {
    pathname: '/dashboard/calls/mentee',
    search: '?role=previous',
  },
  '/teenager/dashboard': { pathname: '/dashboard', search: '' },
};

const LIVE_SESSION_DETAIL = /^\/live-sessions\/([^/?#]+)\/?$/;

function mapBackendPath(parsed: Parsed): Parsed {
  const rawPath = parsed.pathname.replace(/\/+$/, '') || '/';
  const merged = new URLSearchParams(
    parsed.search.startsWith('?') ? parsed.search.slice(1) : parsed.search
  );

  const staticHit = STATIC_PATH_MAP[rawPath];
  if (staticHit) {
    const base = new URLSearchParams(
      staticHit.search.startsWith('?') ? staticHit.search.slice(1) : staticHit.search
    );
    merged.forEach((v, k) => {
      if (!base.has(k)) base.set(k, v);
    });
    const q = base.toString();
    return {
      pathname: staticHit.pathname,
      search: q ? `?${q}` : '',
    };
  }

  const liveMatch = rawPath.match(LIVE_SESSION_DETAIL);
  if (liveMatch) {
    const id = liveMatch[1];
    const q = merged.toString();
    return {
      pathname: `/dashboard/live-sessions/${id}`,
      search: q ? `?${q}` : '',
    };
  }

  // Already under /dashboard (e.g. /dashboard/calls/mentor?role=requests)
  if (rawPath === '/dashboard' || rawPath.startsWith('/dashboard/')) {
    const search = alignCallTabQuery(rawPath, parsed.search);
    return { pathname: rawPath, search };
  }

  // Legacy: /calls/... without dashboard prefix
  if (rawPath.startsWith('/calls/')) {
    const rest = rawPath.slice('/calls/'.length);
    const q = merged.toString();
    const suffix = q ? `?${q}` : '';
    if (rest === 'mentor' || rest.startsWith('mentor/')) {
      return {
        pathname: '/dashboard/calls/mentor',
        search: alignCallTabQuery('/dashboard/calls/mentor', suffix),
      };
    }
    if (rest === 'mentee' || rest.startsWith('mentee/') || rest === 'teenager' || rest.startsWith('teenager/')) {
      return {
        pathname: '/dashboard/calls/mentee',
        search: alignCallTabQuery('/dashboard/calls/mentee', suffix),
      };
    }
  }

  // Bare /live-sessions list (unusual for notifications)
  if (rawPath === '/live-sessions' || rawPath === '/live-sessions/') {
    const q = merged.toString();
    return {
      pathname: '/dashboard/live-sessions',
      search: q ? `?${q}` : '',
    };
  }

  // Fallback: ensure leading slash, keep query
  const q = merged.toString();
  return {
    pathname: rawPath.startsWith('/') ? rawPath : `/${rawPath}`,
    search: q ? `?${q}` : '',
  };
}

function toAppHref(link: string): string {
  const parsed = parseNotificationLink(link);
  const mapped = mapBackendPath(parsed);
  const search = alignCallTabQuery(mapped.pathname, mapped.search);
  const out = mapped.pathname + search;
  return out || '/dashboard/notifications';
}

/** When the API omits `link`, route from `type` when possible. */
function hrefFromNotificationType(type: string | null | undefined): string | null {
  const t = `${type ?? ''}`.trim().toUpperCase();
  if (!t) return null;

  switch (t) {
    case 'SIGNUP_PENDING_MENTOR':
      return '/dashboard/pending-requests?role=mentor';
    case 'SIGNUP_PENDING_TEENAGER':
      return '/dashboard/pending-requests?role=mentee';
    case 'CALL_REQUEST':
      return '/dashboard/calls/mentor?role=requests';
    case 'CALL_CANCELLED_BY_TEENAGER':
      return '/dashboard/calls/mentor?role=previous';
    case 'CALL_ACCEPTED':
      return '/dashboard/calls/mentee?role=upcoming';
    case 'CALL_CANCELLED_BY_MENTOR':
      return '/dashboard/calls/mentee?role=previous';
    case 'ACCOUNT_APPROVED_MENTOR':
    case 'ACCOUNT_APPROVED_TEENAGER':
      return '/dashboard';
    case 'LIVE_SESSION_CREATED':
    case 'LIVE_SESSION_CANCELLED':
    case 'LIVE_SESSION_UPDATED':
    case 'LIVE_SESSION_COMMENT_REPLY':
      // Prefer `link` with session id; if missing, list page
      return '/dashboard/live-sessions';
    default:
      return null;
  }
}

export function resolveNotificationHref(
  n: {
    link?: string | null;
    type?: string | null;
    title?: string;
    description?: string;
  },
  role: AppRole
): string | null {
  const notificationType = `${n.type ?? ''}`.trim().toUpperCase();
  /** Intentionally no in-app destination (e.g. informational only). */
  if (notificationType === 'CALL_DECLINED') {
    return null;
  }

  const r = (role ?? '').trim().toUpperCase();
  const isTeen = r === 'TEENAGER';
  const isMentor = r === 'MENTOR';
  const isAdmin = r === 'SUPERADMIN' || r === 'ADMIN';

  if (n.link?.trim()) {
    return toAppHref(n.link);
  }

  const fromType = hrefFromNotificationType(n.type);
  if (fromType) return fromType;

  const text = `${n.type ?? ''} ${n.title ?? ''} ${n.description ?? ''}`.toLowerCase();

  if (/(call request|call-request|upcoming call|mentorship call|session with)/.test(text)) {
    if (isTeen) return '/dashboard/calls/mentee?role=upcoming';
    if (isMentor) return '/dashboard/calls/mentor?role=upcoming';
    if (isAdmin) return '/dashboard/calls/admin';
    return '/dashboard/calls/mentee?role=upcoming';
  }
  if (/(module|workbook|assignment|deliverable)/.test(text)) {
    return isTeen ? '/dashboard/modules/mentee' : '/dashboard/modules';
  }
  if (/(live session|live-sessions)/.test(text)) {
    return '/dashboard/live-sessions';
  }
  if (/(availability|your calendar|book a call|booking)/.test(text)) {
    if (isMentor) return '/dashboard/availabilty-schedule/mentor';
    if (isTeen) return '/dashboard/book-a-call';
  }
  if (/(program schedule|program config)/i.test(text) && isAdmin) {
    return '/dashboard/program-schedule';
  }
  if (/(pending request|approval|teenager request|mentor request)/.test(text) && isAdmin) {
    return '/dashboard/pending-requests';
  }

  return '/dashboard/notifications';
}
