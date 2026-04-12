import type { CallRecord } from '@/store/calls/calls.api';

function num(v: unknown): number {
  if (v == null || v === '') return 0;
  const x = Number(v);
  return Number.isFinite(x) ? x : 0;
}

/**
 * Normalize GET /mentor/me/stats (and similar) payloads: nested `data`, snake_case, top-level aliases.
 */
export function parseMentorStatsApiPayload(raw: unknown): {
  averageRating: number;
  totalCalls: number;
} {
  if (!raw || typeof raw !== 'object') return { averageRating: 0, totalCalls: 0 };
  const r = raw as Record<string, unknown>;
  const inner =
    r.data && typeof r.data === 'object' && !Array.isArray(r.data)
      ? (r.data as Record<string, unknown>)
      : r;

  const averageRating = num(
    inner.averageRating ?? inner.average_rating ?? r.averageRating ?? r.average_rating
  );
  const totalCalls = Math.round(
    num(
      inner.totalCalls ??
        inner.total_calls ??
        inner.callsCount ??
        inner.calls_count ??
        r.totalCalls ??
        r.total_calls
    )
  );

  return { averageRating, totalCalls };
}

/** Best-effort when `/mentor/me/stats` is missing or returns zeros: uses loaded previous calls only (may cap at request limit). */
export function deriveMentorStatsFromPreviousCalls(calls: CallRecord[]): {
  averageRating: number;
  totalCalls: number;
} {
  const totalCalls = calls.length;
  const rated = calls.filter(
    (c) => c.rating != null && Number.isFinite(Number(c.rating))
  );
  const averageRating =
    rated.length > 0
      ? rated.reduce((s, c) => s + Number(c.rating), 0) / rated.length
      : 0;
  return { averageRating, totalCalls };
}
