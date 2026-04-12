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

/** Prefer API `scheduledAt` for ordering and “past” checks; fall back to parsed `date`. */
export function getScheduledAtMs(call: CallRecord): number {
  if (call.scheduledAt) {
    const t = Date.parse(call.scheduledAt);
    if (!Number.isNaN(t)) return t;
  }
  return parseCallDateMs(call.date);
}

function isPastBySchedule(call: CallRecord, nowMs = Date.now()): boolean {
  const ms = getScheduledAtMs(call);
  return ms > 0 && ms < nowMs;
}

/** True if instant falls within the last 7 calendar days (inclusive of today), same rules as legacy date-string helper. */
function isWithinLastSevenDaysFromMs(scheduledMs: number): boolean {
  if (!scheduledMs || Number.isNaN(scheduledMs)) return false;
  const date = new Date(scheduledMs);
  if (Number.isNaN(date.getTime())) return false;
  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  sevenDaysAgo.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  return date >= sevenDaysAgo && date <= now;
}

/** Most recent call that is already past by `scheduledAt` (newest first). Ignores stale `status`. */
export function getMostRecentPreviousCall(calls: CallRecord[]): CallRecord | null {
  if (!calls?.length) return null;
  const past = calls.filter((c) => isPastBySchedule(c));
  if (!past.length) return null;
  const sorted = [...past].sort((a, b) => getScheduledAtMs(b) - getScheduledAtMs(a));
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
  return isWithinLastSevenDaysFromMs(date.getTime());
}

/**
 * True when we should NOT show the “give feedback” dashboard card for this call.
 * Past vs upcoming is determined by `scheduledAt` elsewhere — do not use `status` / `markCompletePending`.
 * When the API sends `feedbackPending`, we still cross-check fields: some payloads mark
 * `feedbackPending: false` without mentee input — don’t hide the nudge then.
 */
function shouldSuppressTeenagerFeedbackReminderForCall(call: CallRecord): boolean {
  const needsRating = call.rating == null;
  const needsComment = call.menteeComment == null;
  const needsByFields = needsRating || needsComment;

  if (typeof call.feedbackPending === 'boolean') {
    if (call.feedbackPending) return false;
    if (needsByFields) return false;
    return true;
  }

  return !needsByFields;
}

function hasMentorFeedback(call: CallRecord): boolean {
  const hasComment =
    call.comment != null && String(call.comment).trim() !== '';
  const hasPrivate =
    call.mentorSessionNotes != null &&
    String(call.mentorSessionNotes).trim() !== '';
  return hasComment || hasPrivate;
}

/**
 * Show "give feedback" reminder only when there is a previous call, the most
 * recent one is recent enough, and it does not already have mentee feedback.
 */
export function shouldShowTeenagerFeedbackReminder(previous: CallRecord[]): boolean {
  const last = getMostRecentPreviousCall(previous);
  if (!last) return false;
  if (shouldSuppressTeenagerFeedbackReminderForCall(last)) return false;
  return isWithinLastSevenDaysFromMs(getScheduledAtMs(last));
}

/**
 * Show "add feedback" reminder only when there is a previous call, the most
 * recent one is recent enough, and mentor notes are not already saved.
 */
export function shouldShowMentorFeedbackReminder(previous: CallRecord[]): boolean {
  const last = getMostRecentPreviousCall(previous);
  if (!last) return false;
  if (hasMentorFeedback(last)) return false;
  return isWithinLastSevenDaysFromMs(getScheduledAtMs(last));
}
