import type { CallRecord } from '@/store/calls/calls.api';
import { getScheduledAtMs } from '@/utils/dashboardCallReminders';

export type AdminCallStatusBadge = 'completed' | 'upcoming' | 'rescheduled' | 'cancelled';

export function adminCallStatusBadgeClass(badge: AdminCallStatusBadge): string {
  switch (badge) {
    case 'completed':
      return 'bg-green-50 text-green-600';
    case 'rescheduled':
      return 'bg-amber-50 text-amber-600';
    case 'cancelled':
      return 'bg-red-50 text-red-700';
    default:
      return 'bg-gray-100 text-gray-600';
  }
}

/**
 * Admin UI status: prefer schedule (`scheduledAt`) when API `status` is stale (e.g. still "UPCOMING" after the slot).
 * Keeps explicit API states for cancel / reschedule when present.
 */
export function getAdminCallDisplayStatusFromRecord(call: CallRecord): {
  label: string;
  badge: AdminCallStatusBadge;
} {
  const raw = call.status ?? '';
  const u = raw.toUpperCase();
  if (u.includes('CANCEL')) return { label: 'Cancelled', badge: 'cancelled' };
  if (u.includes('RESCHEDULE')) return { label: raw.trim() || 'Rescheduled', badge: 'rescheduled' };

  const ms = getScheduledAtMs(call);
  if (ms <= 0) {
    return { label: raw.trim() || '—', badge: 'upcoming' };
  }
  if (ms < Date.now()) return { label: 'Completed', badge: 'completed' };
  return { label: 'Upcoming', badge: 'upcoming' };
}

/** Raw `/calls` list items before `rawToCallRecord` (AdminCallsTable). */
export function getAdminCallDisplayStatusFromApiRow(c: {
  status?: string;
  scheduledAt?: string;
  startTime?: string;
  date?: string;
  dateFormatted?: string;
}): { label: string; badge: AdminCallStatusBadge } {
  const raw = c?.status ?? '';
  const u = raw.toUpperCase();
  if (u.includes('CANCEL')) return { label: 'Cancelled', badge: 'cancelled' };
  if (u.includes('RESCHEDULE')) return { label: raw.trim() || 'Rescheduled', badge: 'rescheduled' };

  const at =
    (typeof c.scheduledAt === 'string' && c.scheduledAt.trim()) ||
    (typeof c.startTime === 'string' && c.startTime.trim()) ||
    (typeof c.date === 'string' && c.date.trim()) ||
    (typeof c.dateFormatted === 'string' && c.dateFormatted.trim()) ||
    '';
  const ms = at ? Date.parse(at) : NaN;
  if (Number.isNaN(ms) || ms <= 0) {
    return { label: raw.trim() || '—', badge: 'upcoming' };
  }
  if (ms < Date.now()) return { label: 'Completed', badge: 'completed' };
  return { label: 'Upcoming', badge: 'upcoming' };
}
