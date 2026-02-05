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
  status: LiveSessionStatus;
  sessionNotes: string | null;
  recordingUrl: string | null;
};

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
