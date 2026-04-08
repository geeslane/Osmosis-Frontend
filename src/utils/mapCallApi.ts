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
    notes: c.comment ?? c.menteeComment ?? undefined,
    status: mapApiStatusToUpcoming(c.status),
    callUrl: c.meetingUrl,
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
  /** Existing mentor notes on the call (mentor perspective). */
  mentorNotes?: string;
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
  return {
    id: c.id,
    name,
    date: c.date,
    time: c.time,
    topic: c.topic,
    phone: '—',
    status,
    rating: c.rating,
    menteeComment: c.menteeComment,
    mentorNotes: perspective === 'mentor' ? c.comment : undefined,
  };
}

/** Extract an array of call-like objects from various API envelope shapes */
export function pickCallsArray(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === 'object') {
    const p = payload as Record<string, unknown>;
    if (Array.isArray(p.data)) return p.data;
    const inner = p.data;
    if (inner && typeof inner === 'object') {
      const d = inner as Record<string, unknown>;
      if (Array.isArray(d.data)) return d.data;
    }
  }
  return [];
}

function str(v: unknown, fallback = '—'): string {
  if (v === null || v === undefined) return fallback;
  const s = String(v).trim();
  return s || fallback;
}

/** Map one API call object to CallRecord (flexible field names). */
export function rawToCallRecord(raw: unknown): CallRecord {
  const r = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
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

  let date = str(r.date, '');
  let time = str(r.time, '');
  const scheduledAt = r.scheduledAt ?? r.startTime ?? r.datetime ?? r.scheduled_at;
  if (typeof scheduledAt === 'string' && scheduledAt.length > 0) {
    const d = new Date(scheduledAt);
    if (!Number.isNaN(d.getTime())) {
      if (!date || date === '—') {
        date = d.toLocaleDateString(undefined, {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });
      }
      if (!time || time === '—') {
        time = d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
      }
    }
  }
  if (!date) date = '—';

  const meeting =
    r.meetingUrl ??
    r.meetingLink ??
    r.callUrl ??
    r.joinUrl ??
    r.url ??
    r.hangoutLink;
  const meetingUrl = typeof meeting === 'string' && meeting.length > 0 ? meeting : undefined;

  return {
    id: str(r.id ?? r._id ?? r.callId, ''),
    mentorName,
    menteeName,
    menteeId: r.menteeId
      ? str(r.menteeId)
      : teen?.id
        ? str(teen.id)
        : undefined,
    date,
    time: time && time !== '—' ? time : undefined,
    topic: str(r.topic ?? r.sessionTopic ?? r.subject),
    callLength: r.callLength != null ? str(r.callLength) : r.durationMinutes != null ? `${r.durationMinutes}m` : undefined,
    status: str(r.status ?? r.state, '—'),
    comment: r.comment != null ? str(r.comment, '') : r.mentorComment != null ? str(r.mentorComment, '') : undefined,
    menteeComment:
      r.menteeComment != null
        ? str(r.menteeComment, '')
        : r.teenagerComment != null
          ? str(r.teenagerComment, '')
          : undefined,
    rating: typeof r.rating === 'number' ? r.rating : r.menteeRating != null ? Number(r.menteeRating) : undefined,
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

  const topicLabel = r.topicLabel != null ? String(r.topicLabel) : '';
  const topicValue = r.topicValue != null ? String(r.topicValue) : '';
  const topicDisplay =
    topicLabel.trim() || topicValue.trim()
      ? topicLabel.trim() || topicValue.trim()
      : '—';

  return {
    id: String(r.id ?? r._id ?? ''),
    teenagerId,
    name,
    pictureUrl,
    note:
      r.message != null
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
  const st = String(r.status ?? 'PENDING').toUpperCase();
  let status: TeenagerCallRequestRow['status'] = 'Pending';
  if (st.includes('ACCEPT') || st.includes('APPROV') || st.includes('ACTIVE')) status = 'Active';
  else if (st.includes('REJECT') || st.includes('DECLIN') || st.includes('CANCEL'))
    status = 'Inactive';
  return {
    id: String(r.id ?? r._id ?? ''),
    name: String(mentor?.fullName ?? mentor?.full_name ?? r.mentorName ?? '—'),
    date,
    time,
    topic: String(r.topic ?? r.sessionTopic ?? '—'),
    phone: String(mentor?.phone ?? r.phone ?? '—'),
    note:
      r.message != null
        ? String(r.message)
        : r.note != null
          ? String(r.note)
          : undefined,
    status,
  };
}
