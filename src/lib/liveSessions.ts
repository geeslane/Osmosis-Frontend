export type LiveSessionStatus = 'scheduled' | 'completed' | 'cancelled';

export type LiveSessionRecord = {
  id: string;
  topic: string;
  date: string;
  time: string;
  url: string;
  speakerName: string;
  bio: string;
  linkedinUrl: string | null;
  pictureUrl?: string | null;
  status: LiveSessionStatus;
  cancellationReason?: string | null;
  sessionNotes: string | null;
  recordingUrl: string | null;
  createdAt?: string;
};

/** Convert API session (datetime) to UI record (date + time) */
export function apiSessionToRecord(api: {
  id: string;
  topic: string;
  datetime: string;
  url: string;
  speakerName: string;
  bio: string;
  linkedinUrl: string | null;
  pictureUrl?: string | null;
  status: LiveSessionStatus;
  cancellationReason?: string | null;
  sessionNotes: string | null;
  recordingUrl: string | null;
  createdAt?: string;
}): LiveSessionRecord {
  const { date, time } = fromDatetimeISO(api.datetime);
  return {
    id: api.id,
    topic: api.topic,
    date,
    time,
    url: api.url,
    speakerName: api.speakerName,
    bio: api.bio,
    linkedinUrl: api.linkedinUrl ?? null,
    pictureUrl: api.pictureUrl ?? null,
    status: api.status,
    cancellationReason: api.cancellationReason ?? null,
    sessionNotes: api.sessionNotes ?? null,
    recordingUrl: api.recordingUrl ?? null,
    createdAt: api.createdAt,
  };
}

/** Parse ISO datetime to form fields: date (YYYY-MM-DD) and time (e.g. "02:00 PM") */
export function fromDatetimeISO(iso: string): { date: string; time: string } {
  const d = new Date(iso);
  const date = d.toISOString().slice(0, 10);
  const hour = d.getHours();
  const minute = d.getMinutes();
  const hour12 = hour % 12 || 12;
  const ampm = hour < 12 ? 'AM' : 'PM';
  const time = `${hour12}:${String(minute).padStart(2, '0')} ${ampm}`;
  return { date, time };
}

/** Sort key for a session: createdAt if present, else ISO from date+time (for ordering) */
export function sessionSortKey(record: LiveSessionRecord): string {
  if (record.createdAt) return record.createdAt;
  return toDatetimeISO(record.date, record.time);
}

/** Build ISO datetime from form date (YYYY-MM-DD) and time (e.g. "02:00 PM") (local time → UTC ISO) */
export function toDatetimeISO(dateStr: string, timeStr: string): string {
  const [timePart, meridian] = timeStr.trim().split(/\s+/);
  const [hourStr, minStr] = (timePart || '12:00').split(':');
  let h = parseInt(hourStr || '12', 10);
  const m = parseInt(minStr || '0', 10);
  if ((meridian || '').toUpperCase() === 'PM' && h !== 12) h += 12;
  if ((meridian || '').toUpperCase() === 'AM' && h === 12) h = 0;
  const [y, mo, d] = dateStr.split('-').map(Number);
  const date = new Date(y, (mo || 1) - 1, d || 1, h, m, 0, 0);
  return date.toISOString();
}

/** Format ISO datetime for display (e.g. "12/05/24 - 02:00 PM") */
export function formatSessionDateTimeFromDatetime(datetime: string): string {
  const d = new Date(datetime);
  const dateStr = d.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: '2-digit',
  });
  const timeStr = d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  return `${dateStr} - ${timeStr}`;
}

/** True if the session datetime is in the past */
export function isSessionPastFromDatetime(datetime: string): boolean {
  return new Date(datetime).getTime() < Date.now();
}

export type LiveSessionComment = {
  id: string;
  sessionId: string;
  authorName: string;
  authorRole: 'teenager';
  authorPictureUrl?: string | null;
  createdAt: string;
  text: string;
};

export function formatSessionDateTime(date: string, time: string): string {
  if (!date) return time || '—';
  const d = new Date(date + 'T12:00:00');
  const dateStr = d.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: '2-digit',
  });
  return time ? `${dateStr} - ${time}` : dateStr;
}

/** True if the session date/time is in the past */
export function isSessionPast(date: string, time: string): boolean {
  if (!date) return false;
  const [hour, rest] = (time || '12:00 AM').split(':');
  const min = rest?.trim().split(/\s/)[0] || '0';
  const meridian = (time || '').toUpperCase().includes('PM');
  let h = parseInt(hour || '12', 10);
  if (meridian && h !== 12) h += 12;
  if (!meridian && h === 12) h = 0;
  const d = new Date(date + `T${String(h).padStart(2, '0')}:${min.padStart(2, '0')}:00`);
  return d.getTime() < Date.now();
}

