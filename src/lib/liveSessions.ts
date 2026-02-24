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

const mockSessions: LiveSessionRecord[] = [
  {
    id: '1',
    topic: 'Create a User Persona',
    date: '2024-12-05',
    time: '02:00 PM',
    url: 'https://meet.example.com/session-1',
    speakerName: 'Jane Doe',
    bio: 'Jane is a senior product designer with over 10 years of experience in user research and persona development. She has led workshops at major tech companies.',
    linkedinUrl: 'https://linkedin.com/in/janedoe',
    status: 'completed',
    sessionNotes: 'Key takeaways: user interviews, empathy mapping, and how to validate personas with real data. Q&A covered accessibility in design.',
    recordingUrl: 'https://vimeo.com/example/recording-1',
  },
  {
    id: '2',
    topic: 'Introduction to Design Systems',
    date: '2025-03-15',
    time: '03:30 PM',
    url: 'https://meet.example.com/session-2',
    speakerName: 'Alex Chen',
    bio: 'Alex is a UX lead who has built design systems at scale. Previously at Figma and Airbnb, now consulting for startups.',
    linkedinUrl: 'https://linkedin.com/in/alexchen',
    status: 'scheduled',
    sessionNotes: null,
    recordingUrl: null,
  },
  {
    id: '3',
    topic: 'API Design Best Practices',
    date: '2025-01-10',
    time: '11:00 AM',
    url: 'https://meet.example.com/session-3',
    speakerName: 'Sam Wilson',
    bio: 'Backend lead with 8 years of experience building scalable APIs.',
    linkedinUrl: null,
    status: 'cancelled',
    sessionNotes: null,
    recordingUrl: null,
  },
];

const mockComments: LiveSessionComment[] = [
  {
    id: 'c1',
    sessionId: '1',
    authorName: 'Dami',
    authorRole: 'teenager',
    authorPictureUrl: '/image/Avatar1.png',
    createdAt: '2025-01-06T16:30:00Z',
    text: 'Really loved the persona examples, especially how you tied them back to real interviews.',
  },
  {
    id: 'c2',
    sessionId: '2',
    authorName: 'Kayla',
    authorRole: 'teenager',
    authorPictureUrl: '/image/Avatar2.png',
    createdAt: '2025-03-01T10:15:00Z',
    text: 'Looking forward to this. Will there be a segment on tokens and naming?',
  },
];

export function getLiveSessions(): LiveSessionRecord[] {
  return mockSessions;
}

export function getLiveSessionById(id: string): LiveSessionRecord | undefined {
  return mockSessions.find((s) => s.id === id);
}

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

export function getLiveSessionComments(sessionId: string): LiveSessionComment[] {
  return mockComments
    .filter((c) => c.sessionId === sessionId)
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
}

export function addLiveSessionComment(
  sessionId: string,
  text: string,
  authorName: string
): LiveSessionComment {
  const comment: LiveSessionComment = {
    id: `c${mockComments.length + 1}`,
    sessionId,
    authorName,
    authorRole: 'teenager',
    createdAt: new Date().toISOString(),
    text,
  };
  mockComments.push(comment);
  return comment;
}

export function updateLiveSessionNotes(
  id: string,
  data: { sessionNotes: string | null; recordingUrl: string | null }
): boolean {
  const session = mockSessions.find((s) => s.id === id);
  if (!session) return false;
  session.sessionNotes = data.sessionNotes;
  session.recordingUrl = data.recordingUrl;
  return true;
}

export function updateLiveSessionStatus(
  id: string,
  status: LiveSessionStatus
): boolean {
  const session = mockSessions.find((s) => s.id === id);
  if (!session) return false;
  session.status = status;
  return true;
}
