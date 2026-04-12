/**
 * Notification `link` values are owned by the API: store **path + query** that match
 * this Next.js app (see middleware / `src/app/dashboard`). The client only normalizes
 * absolute URLs to pathname+search and ensures relative paths start with `/`.
 */

export type AppRole = string | undefined;

function linkToHref(link: string): string {
  const raw = link.trim().split('#')[0];
  if (!raw) return '/dashboard/notifications';

  if (raw.startsWith('http://') || raw.startsWith('https://')) {
    try {
      const u = new URL(raw);
      const path = u.pathname + (u.search || '');
      return path || '/dashboard/notifications';
    } catch {
      return '/dashboard/notifications';
    }
  }

  const q = raw.indexOf('?');
  if (q === -1) {
    return raw.startsWith('/') ? raw : `/${raw}`;
  }
  const pathPart = raw.slice(0, q);
  const pathname = pathPart.startsWith('/') ? pathPart : `/${pathPart}`;
  return pathname + raw.slice(q);
}

/**
 * Returns a Next.js `href`, or `null` when the notification should not navigate (no `<Link>`).
 */
export function resolveNotificationHref(
  n: {
    link?: string | null;
    type?: string | null;
    title?: string;
    description?: string;
  },
  _role: AppRole
): string | null {
  if (`${n.type ?? ''}`.trim().toUpperCase() === 'CALL_DECLINED') {
    return null;
  }

  if (n.link?.trim()) {
    return linkToHref(n.link);
  }

  return '/dashboard/notifications';
}
