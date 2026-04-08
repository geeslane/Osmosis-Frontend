import type { CallRecord } from '@/store/calls/calls.api';

/** Parse display or ISO-ish date strings for sorting (newest first). */
function parseCallDateMs(dateStr: string | undefined): number {
  if (!dateStr || dateStr === '—') return 0;
  const trimmed = String(dateStr).trim();
  const direct = Date.parse(trimmed);
  if (!Number.isNaN(direct)) return direct;
  const iso = /^\d{4}-\d{2}-\d{2}/.exec(trimmed);
  if (iso) {
    const d = new Date(iso[0]);
    return Number.isNaN(d.getTime()) ? 0 : d.getTime();
  }
  return 0;
}

/** Most recent previous call (by date field). */
export function getMostRecentPreviousCall(calls: CallRecord[]): CallRecord | null {
  if (!calls?.length) return null;
  const sorted = [...calls].sort(
    (a, b) => parseCallDateMs(b.date) - parseCallDateMs(a.date)
  );
  return sorted[0] ?? null;
}

/** True if date falls within the last 7 calendar days (inclusive of today). */
export function isWithinLastSevenDays(dateStr: string): boolean {
  if (!dateStr) return false;
  const trimmed = String(dateStr).trim();
  let date: Date;
  if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
    date = new Date(trimmed.slice(0, 10));
  } else {
    const parsed = Date.parse(trimmed);
    if (Number.isNaN(parsed)) return false;
    date = new Date(parsed);
  }
  if (Number.isNaN(date.getTime())) return false;
  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  sevenDaysAgo.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  return date >= sevenDaysAgo && date <= now;
}

function hasMenteeFeedback(call: CallRecord): boolean {
  const hasRating = call.rating != null && call.rating !== undefined;
  const hasComment = !!(
    call.menteeComment != null && String(call.menteeComment).trim() !== ''
  );
  return hasRating || hasComment;
}

function hasMentorFeedback(call: CallRecord): boolean {
  return !!(call.comment != null && String(call.comment).trim() !== '');
}

/**
 * Show "give feedback" reminder only when there is a previous call, the most
 * recent one is recent enough, and it does not already have mentee feedback.
 */
export function shouldShowTeenagerFeedbackReminder(previous: CallRecord[]): boolean {
  const last = getMostRecentPreviousCall(previous);
  if (!last) return false;
  if (hasMenteeFeedback(last)) return false;
  return isWithinLastSevenDays(last.date);
}

/**
 * Show "add feedback" reminder only when there is a previous call, the most
 * recent one is recent enough, and mentor notes are not already saved.
 */
export function shouldShowMentorFeedbackReminder(previous: CallRecord[]): boolean {
  const last = getMostRecentPreviousCall(previous);
  if (!last) return false;
  if (hasMentorFeedback(last)) return false;
  return isWithinLastSevenDays(last.date);
}
