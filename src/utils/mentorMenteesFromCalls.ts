import type { CallRecord } from '@/store/calls/calls.api';

export type MentorMenteeListRow = {
  id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
  status: string;
  image?: string;
};

/**
 * Mentors are not allowed on GET /teenager (admin list). Until GET /mentor/me/mentees
 * returns data, derive unique mentees from this mentor's upcoming + previous calls.
 */
export function buildMentorMenteesFromCalls(
  upcoming: CallRecord[],
  previous: CallRecord[]
): MentorMenteeListRow[] {
  const map = new Map<string, MentorMenteeListRow>();

  const add = (c: CallRecord) => {
    const id = c.menteeId?.trim();
    const name = c.menteeName?.trim();
    if (!name || name === '—') return;
    const key = id && id.length > 0 ? id : `name:${name.toLowerCase()}`;
    if (map.has(key)) return;
    map.set(key, {
      id: key,
      name,
      email: '—',
      address: '—',
      phone: '—',
      status: 'Active',
      image: undefined,
    });
  };

  upcoming.forEach(add);
  previous.forEach(add);

  return Array.from(map.values()).sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
  );
}
