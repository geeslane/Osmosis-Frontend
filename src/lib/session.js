'use server';
import { cookieConfig } from '@/utils/constant';
import { cookies } from 'next/headers';

export async function getSessionCookie() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('SESSION_COOKIE');

  if (!sessionCookie) return null;
  try {
    return JSON.parse(sessionCookie.value);
  } catch{
    return sessionCookie.value || null;
  }
}
export async function setSessionCookie(session) {
  const cookieStore = await cookies();
  const sessionValue = JSON.stringify(session);
  cookieStore.set('SESSION_COOKIE', sessionValue, cookieConfig);
}
export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('SESSION_COOKIE', cookieConfig);
}
