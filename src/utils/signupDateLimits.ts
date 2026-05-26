export const MENTOR_MIN_AGE_YEARS = 23;

export const MENTOR_MIN_AGE_MESSAGE =
  'Mentors must be at least 23 years old.';

export const TEEN_MIN_AGE_YEARS = 13;

export const TEEN_MAX_AGE_YEARS = 19;

export const TEEN_AGE_RANGE_MESSAGE =
  'Teenagers must be between 13 and 19 years old.';

/** Latest DOB for mentors (at least 23 years old). */
export function getMentorMaxDateOfBirth(now = new Date()): Date {
  const max = new Date(now);
  max.setFullYear(max.getFullYear() - MENTOR_MIN_AGE_YEARS);
  return max;
}

/** Latest DOB for teens (at least 13 years old). */
export function getTeenMaxDateOfBirth(now = new Date()): Date {
  const max = new Date(now);
  max.setFullYear(max.getFullYear() - TEEN_MIN_AGE_YEARS);
  return max;
}

/** Earliest DOB for teens (at most 19 years old). */
export function getTeenMinDateOfBirth(now = new Date()): Date {
  const min = new Date(now);
  min.setFullYear(min.getFullYear() - (TEEN_MAX_AGE_YEARS + 1));
  min.setDate(min.getDate() + 1);
  return min;
}

export function formatDateToYmd(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getAgeFromYmd(ymd: string, now = new Date()): number | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(ymd.trim());
  if (!match) return null;
  const y = Number(match[1]);
  const m = Number(match[2]) - 1;
  const d = Number(match[3]);
  const birth = new Date(y, m, d);
  if (Number.isNaN(birth.getTime())) return null;
  let age = now.getFullYear() - y;
  const monthDiff = now.getMonth() - m;
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < d)) {
    age -= 1;
  }
  return age;
}

export function isMentorTooYoung(date: Date, now = new Date()): boolean {
  const normalized = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
  return normalized.getTime() > getMentorMaxDateOfBirth(now).getTime();
}

export function isTeenAgeOutOfRange(date: Date, now = new Date()): boolean {
  const ymd = formatDateToYmd(date);
  const age = getAgeFromYmd(ymd, now);
  if (age == null) return true;
  return age < TEEN_MIN_AGE_YEARS || age > TEEN_MAX_AGE_YEARS;
}

export function isTeenAgeValid(ymd: string, now = new Date()): boolean {
  const age = getAgeFromYmd(ymd, now);
  if (age == null) return false;
  return age >= TEEN_MIN_AGE_YEARS && age <= TEEN_MAX_AGE_YEARS;
}

export function isMentorAgeValid(ymd: string, now = new Date()): boolean {
  const age = getAgeFromYmd(ymd, now);
  if (age == null) return false;
  return age >= MENTOR_MIN_AGE_YEARS;
}
