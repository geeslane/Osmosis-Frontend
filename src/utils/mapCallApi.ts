import type { CallRecord } from '@/store/calls/calls.api';

/** Table row for upcoming calls (mentee sees mentor name; mentor sees mentee name). */
export type UpcomingCall = {
  id: string;
  name: string;
  date: string;
  time: string;
  topic: string;
  phone: string;
  notes?: string;
  status: 'Active' | 'Inactive' | 'Pending';
  image?: string;
  callUrl?: string;
  /** Mentor id — mentees use this to load `meetingLink` when not on the call */
  mentorId?: string;
};

function mapApiStatusToUpcoming(status: string): UpcomingCall['status'] {
  const u = status.toUpperCase();
  if (u.includes('CANCEL') || u.includes('DECLIN') || u.includes('INACTIVE')) return 'Inactive';
  if (u.includes('PENDING') || u.includes('SCHEDUL') || u.includes('REQUEST')) return 'Pending';
  return 'Active';
}

export function callRecordToUpcomingRow(
  c: CallRecord,
  perspective: 'mentee' | 'mentor'
): UpcomingCall {
  const name = perspective === 'mentee' ? c.mentorName : c.menteeName;
  return {
    id: c.id,
    name,
    date: c.date,
    time: c.time ?? '',
    topic: c.topic,
    phone: '—',
    notes:
      perspective === 'mentee'
        ? firstNonEmptyString(c.menteeNotes, c.menteeComment)
        : firstNonEmptyString(c.menteeNotes, c.menteeComment, c.comment),
    status: mapApiStatusToUpcoming(c.status),
    callUrl: c.meetingUrl,
    mentorId: c.mentorId,
  };
}

export type PreviousCallRow = {
  id: string;
  name: string;
  date: string;
  time?: string;
  topic: string;
  phone: string;
  status: 'Active' | 'Inactive' | 'Pending' | 'Completed';
  image?: string;
  rating?: number;
  menteeComment?: string;
  /** Booking-time message (mentee GET); not post-call feedback. */
  menteeNotes?: string;
  /** Mentee GET: false when both menteeComment and rating are present (per API). */
  feedbackPending?: boolean;
  /** Mentee GET: true when call should be marked complete before feedback. */
  markCompletePending?: boolean;
  /** Mentor-facing post-call comment (team/parents). */
  mentorComment?: string;
  /** Mentor-only private session notes (`Call.notes`). */
  mentorPrivateNotes?: string;
  scheduledAt?: string;
};

export function callRecordToPreviousRow(
  c: CallRecord,
  perspective: 'mentee' | 'mentor'
): PreviousCallRow {
  const name = perspective === 'mentee' ? c.mentorName : c.menteeName;
  const st = c.status.toUpperCase();
  const status: PreviousCallRow['status'] = st.includes('COMPLETE')
    ? 'Completed'
    : st.includes('CANCEL') || st.includes('INACTIVE')
      ? 'Inactive'
      : st.includes('PENDING')
        ? 'Pending'
        : 'Active';
  const row: PreviousCallRow = {
    id: c.id,
    name,
    date: c.date,
    time: c.time,
    topic: c.topic,
    phone: '—',
    status,
    rating: c.rating,
    menteeComment: c.menteeComment,
    scheduledAt: c.scheduledAt,
  };
  if (perspective === 'mentee') {
    row.menteeNotes = c.menteeNotes;
    row.feedbackPending = c.feedbackPending;
    row.markCompletePending = c.markCompletePending;
  } else {
    row.mentorComment = c.comment;
    row.mentorPrivateNotes = c.mentorSessionNotes;
  }
  return row;
}

/** Extract an array of call-like objects from various API envelope shapes */
export function pickCallsArray(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === 'object') {
    const p = payload as Record<string, unknown>;
    if (Array.isArray(p.data)) return p.data;
    if (Array.isArray(p.calls)) return p.calls;
    if (Array.isArray(p.items)) return p.items;
    const inner = p.data;
    if (inner && typeof inner === 'object') {
      const d = inner as Record<string, unknown>;
      if (Array.isArray(d.data)) return d.data;
      if (Array.isArray(d.calls)) return d.calls;
      if (Array.isArray(d.items)) return d.items;
    }
  }
  return [];
}

function str(v: unknown, fallback = '—'): string {
  if (v === null || v === undefined) return fallback;
  const s = String(v).trim();
  return s || fallback;
}

function firstNonEmptyString(...values: unknown[]): string | undefined {
  for (const v of values) {
    if (v === null || v === undefined) continue;
    const t = String(v).trim();
    if (t.length > 0) return t;
  }
  return undefined;
}

/**
 * Join URL for a call row — same field name as mentor availability (`GET /mentor/availability` → `meetingLink`).
 * Prefer nested `mentor.meetingLink` when present (call list/detail responses).
 */
function pickMeetingUrl(
  r: Record<string, unknown>,
  mentor: Record<string, unknown> | undefined
): string | undefined {
  const availability =
    r.availability && typeof r.availability === 'object'
      ? (r.availability as Record<string, unknown>)
      : undefined;

  return firstNonEmptyString(
    mentor?.meetingLink,
    r.meetingLink,
    availability?.meetingLink,
    r.meetingUrl,
    r.callUrl,
    r.joinUrl
  );
}

/** Map one API call object to CallRecord (flexible field names). */
export function rawToCallRecord(raw: unknown): CallRecord {
  let node: unknown = raw;
  if (node && typeof node === 'object') {
    const o = node as Record<string, unknown>;
    if (o.call && typeof o.call === 'object') node = o.call;
  }
  const r = node && typeof node === 'object' ? (node as Record<string, unknown>) : {};
  const mentor = r.mentor as Record<string, unknown> | undefined;
  const teen = (r.teenager ?? r.mentee) as Record<string, unknown> | undefined;

  const mentorName = str(
    r.mentorName ?? mentor?.fullName ?? mentor?.full_name ?? mentor?.name
  );
  const menteeName = str(
    r.menteeName ??
      r.teenagerName ??
      teen?.teenagerFullName ??
      teen?.fullName ??
      teen?.full_name ??
      teen?.name
  );

  let date = firstNonEmptyString(r.date, r.dateFormatted) ?? '';
  let time = firstNonEmptyString(r.time, r.timeFormatted) ?? '';
  const scheduledAtRaw = r.scheduledAt ?? r.startTime ?? r.datetime ?? r.scheduled_at;
  let scheduledAt: string | undefined;
  if (typeof scheduledAtRaw === 'string' && scheduledAtRaw.trim().length > 0) {
    const d = new Date(scheduledAtRaw);
    if (!Number.isNaN(d.getTime())) {
      scheduledAt = scheduledAtRaw.trim();
      if (!date) {
        date = d.toLocaleDateString(undefined, {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });
      }
      if (!time) {
        time = d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
      }
    }
  }
  if (!date) date = '—';

  const meetingUrl = pickMeetingUrl(r, mentor);

  const mentorIdRaw = r.mentorId ?? mentor?.id ?? r.mentor_id;
  const mentorId =
    mentorIdRaw != null && String(mentorIdRaw).trim() !== ''
      ? String(mentorIdRaw).trim()
      : undefined;

  const cr =
    r.callRequest && typeof r.callRequest === 'object'
      ? (r.callRequest as Record<string, unknown>)
      : undefined;
  const crLabel = cr?.topicLabel ?? r.topicLabel;
  const topicFromRequestParts =
    crLabel != null && String(crLabel).trim() !== ''
      ? String(crLabel).trim()
      : '';
  const topicResolved = firstNonEmptyString(
    r.topic,
    r.sessionTopic,
    r.subject,
    topicFromRequestParts || undefined
  );

  let menteePostCall: string | undefined;
  if ('menteeComment' in r && r.menteeComment != null) {
    menteePostCall = String(r.menteeComment);
  } else if ('teenagerComment' in r && r.teenagerComment != null) {
    menteePostCall = String(r.teenagerComment);
  }

  const bookingMessage = firstNonEmptyString(
    r.menteeNotes,
    cr?.message != null ? String(cr.message) : undefined,
    r.message != null ? String(r.message) : undefined
  );

  const ratingRaw = r.rating ?? r.menteeRating;
  const ratingParsed =
    typeof ratingRaw === 'number' && !Number.isNaN(ratingRaw)
      ? ratingRaw
      : ratingRaw != null && ratingRaw !== ''
        ? Number(ratingRaw)
        : undefined;
  const rating =
    ratingParsed != null && !Number.isNaN(ratingParsed) ? ratingParsed : undefined;

  const mentorComment =
    r.mentorComment != null
      ? String(r.mentorComment)
      : r.comment != null
        ? String(r.comment)
        : undefined;

  return {
    id: str(r.id ?? r._id ?? r.callId, ''),
    mentorName,
    menteeName,
    menteeId: r.menteeId
      ? str(r.menteeId)
      : teen?.id
        ? str(teen.id)
        : undefined,
    mentorId,
    scheduledAt,
    date,
    time: time && time !== '—' ? time : undefined,
    topic: str(topicResolved, '—'),
    callLength: r.callLength != null ? str(r.callLength) : r.durationMinutes != null ? `${r.durationMinutes}m` : undefined,
    status: str(r.status ?? r.state, '—'),
    comment: mentorComment,
    menteeComment: menteePostCall,
    menteeNotes: bookingMessage,
    mentorSessionNotes: r.notes != null ? String(r.notes) : undefined,
    rating,
    feedbackPending:
      typeof r.feedbackPending === 'boolean' ? r.feedbackPending : undefined,
    markCompletePending:
      typeof r.markCompletePending === 'boolean' ? r.markCompletePending : undefined,
    meetingUrl,
  };
}

export function normalizeCallsListPayload(payload: unknown): CallRecord[] {
  return pickCallsArray(payload).map(rawToCallRecord).filter((c) => c.id.length > 0);
}

/** Mentor inbox: pending call requests from mentees */
export type MentorCallRequestRow = {
  id: string;
  /** Teenager user id — for navigation or future profile use */
  teenagerId: string;
  name: string;
  pictureUrl?: string;
  note?: string;
  /** Human-readable requested slot, e.g. "Apr 13, 2026 · 9:30 AM" */
  requestedAtLabel: string;
  /** Topic from API (label preferred over raw value) */
  topicDisplay: string;
  status: 'Pending' | 'Accepted' | 'Rejected';
};

function formatRequestDateLabel(isoOrYmd: string): string {
  const s = String(isoOrYmd).trim();
  if (!s) return '—';
  const d = /^\d{4}-\d{2}-\d{2}$/.test(s)
    ? new Date(`${s}T12:00:00`)
    : new Date(s);
  if (Number.isNaN(d.getTime())) return s;
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatRequestTimeLabel(hhmm: string): string {
  const s = String(hhmm).trim();
  if (!s) return '';
  const m = /^(\d{1,2}):(\d{2})/.exec(s);
  if (!m) return s;
  const h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  if (Number.isNaN(h) || Number.isNaN(min)) return s;
  const d = new Date();
  d.setHours(h, min, 0, 0);
  return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

function buildRequestedAtLabel(
  requestedDate: unknown,
  requestedTime: unknown,
  fallbackCreatedAt?: unknown
): string {
  const dateStr = requestedDate != null ? String(requestedDate) : '';
  const timeStr = requestedTime != null ? String(requestedTime) : '';
  if (dateStr || timeStr) {
    const dl = dateStr ? formatRequestDateLabel(dateStr) : '—';
    const tl = timeStr ? formatRequestTimeLabel(timeStr) : '';
    return tl && dl !== '—' ? `${dl} · ${tl}` : tl || dl;
  }
  if (typeof fallbackCreatedAt === 'string') {
    const d = new Date(fallbackCreatedAt);
    if (!Number.isNaN(d.getTime())) {
      return `${d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} · ${d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}`;
    }
  }
  return '—';
}

export function rawToMentorCallRequestRow(raw: unknown): MentorCallRequestRow {
  const r = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const teen = (r.mentee ?? r.teenager) as Record<string, unknown> | undefined;
  const st = String(r.status ?? 'PENDING').toUpperCase();
  let status: MentorCallRequestRow['status'] = 'Pending';
  if (st.includes('ACCEPT') || st.includes('APPROV')) status = 'Accepted';
  else if (st.includes('REJECT') || st.includes('DECLIN')) status = 'Rejected';

  const name = String(
    teen?.teenagerFullName ??
      teen?.fullName ??
      teen?.full_name ??
      r.menteeName ??
      r.teenagerName ??
      r.name ??
      '—'
  );
  const teenagerId = String(teen?.id ?? r.teenagerId ?? '');
  const pictureUrl =
    typeof teen?.pictureUrl === 'string'
      ? teen.pictureUrl
      : typeof teen?.avatar === 'string'
        ? teen.avatar
        : undefined;

  const topicLabel = r.topicLabel != null ? String(r.topicLabel).trim() : '';
  const topicDisplay =
    typeof r.topic === 'string' && r.topic.trim()
      ? String(r.topic).trim()
      : topicLabel || '—';

  return {
    id: String(r.id ?? r._id ?? ''),
    teenagerId,
    name,
    pictureUrl,
    note:
      r.menteeNotes != null
        ? String(r.menteeNotes)
        : r.message != null
          ? String(r.message)
          : r.note != null
            ? String(r.note)
            : undefined,
    requestedAtLabel: buildRequestedAtLabel(
      r.requestedDate,
      r.requestedTime,
      r.createdAt
    ),
    topicDisplay,
    status,
  };
}

/** Mentee: outbound requests (optional GET /teenager/me/call-requests) */
export type TeenagerCallRequestRow = {
  id: string;
  name: string;
  date: string;
  time: string;
  topic: string;
  phone: string;
  note?: string;
  status: 'Active' | 'Inactive' | 'Pending';
};

export function rawToTeenagerCallRequestRow(raw: unknown): TeenagerCallRequestRow {
  const r = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const mentor = r.mentor as Record<string, unknown> | undefined;
  let date = '—';
  let time = '';

  if (r.requestedDate != null || r.requestedTime != null) {
    const dStr = r.requestedDate != null ? String(r.requestedDate) : '';
    const tStr = r.requestedTime != null ? String(r.requestedTime) : '';
    if (dStr) date = formatRequestDateLabel(dStr);
    if (tStr) time = formatRequestTimeLabel(tStr);
  } else {
    const scheduledAt = r.scheduledAt ?? r.startTime ?? r.createdAt ?? r.requestedAt;
    if (typeof scheduledAt === 'string') {
      const d = new Date(scheduledAt);
      if (!Number.isNaN(d.getTime())) {
        date = d.toLocaleDateString(undefined, {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });
        time = d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
      }
    }
  }

  const st = String(r.status ?? 'PENDING').toUpperCase();
  let status: TeenagerCallRequestRow['status'] = 'Pending';
  if (st.includes('ACCEPT') || st.includes('APPROV') || st.includes('ACTIVE')) status = 'Active';
  else if (st.includes('REJECT') || st.includes('DECLIN') || st.includes('CANCEL'))
    status = 'Inactive';

  const topicLabel = r.topicLabel != null ? String(r.topicLabel).trim() : '';
  const topicDisplay =
    typeof r.topic === 'string' && r.topic.trim()
      ? String(r.topic).trim()
      : topicLabel || str(r.sessionTopic, '—');

  const noteFromApi =
    r.menteeNotes != null
      ? String(r.menteeNotes)
      : r.message != null
        ? String(r.message)
        : r.note != null
          ? String(r.note)
          : undefined;

  return {
    id: String(r.id ?? r._id ?? ''),
    name: String(mentor?.fullName ?? mentor?.full_name ?? r.mentorName ?? '—'),
    date,
    time,
    topic: topicDisplay,
    phone: String(mentor?.phone ?? r.phone ?? '—'),
    note: noteFromApi,
    status,
  };
}
