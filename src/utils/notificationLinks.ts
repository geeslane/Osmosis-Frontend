/**
 * Turn backend notification links into in-app paths and infer sensible
 * destinations when `link` is missing (based on type + copy + role).
 */

export type AppRole = string | undefined;

function toAppPath(link: string): string {
  const t = link.trim();
  if (!t) return '/dashboard/notifications';
  if (t.startsWith('http://') || t.startsWith('https://')) {
    try {
      const u = new URL(t);
      const path = u.pathname + (u.search || '');
      return path || '/dashboard/notifications';
    } catch {
      return '/dashboard/notifications';
    }
  }
  return t.startsWith('/') ? t : `/${t}`;
}

export function resolveNotificationHref(
  n: {
    link?: string | null;
    type?: string | null;
    title?: string;
    description?: string;
  },
  role: AppRole
): string {
  if (n.link?.trim()) {
    return toAppPath(n.link);
  }

  const text = `${n.type ?? ''} ${n.title ?? ''} ${n.description ?? ''}`.toLowerCase();
  const isTeen = role === 'TEENAGER';
  const isMentor = role === 'MENTOR';
  const isAdmin = role === 'SUPERADMIN' || role === 'ADMIN';

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
