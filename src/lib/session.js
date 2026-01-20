'use server';

import { cookies } from 'next/headers';

const COOKIE_NAME = 'SESSION_COOKIE';

const DEFAULT_CONFIG = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: 60 * 60 * 24 * 7, // 1 week
};

export async function getSessionCookie() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(COOKIE_NAME);

    if (!sessionCookie || !sessionCookie.value) {
      return null;
    }

    try {
      const parsed = JSON.parse(sessionCookie.value);
      // Ensure we return an object with a token property
      return parsed && typeof parsed === 'object' ? parsed : { token: sessionCookie.value };
    } catch {
      return { token: sessionCookie.value };
    }
  } catch (error) {
    console.error("Session retrieval error:", error);
    return null;
  }
}

export async function setSessionCookie(session) {
  const cookieStore = await cookies();
  
  const sessionValue = typeof session === 'string' 
    ? session 
    : JSON.stringify(session);

  cookieStore.set(COOKIE_NAME, sessionValue, DEFAULT_CONFIG);
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  // It's safer to set an expired cookie with the same config than just calling delete()
  // to ensure all browsers and paths clear it correctly.
  cookieStore.set(COOKIE_NAME, '', { ...DEFAULT_CONFIG, maxAge: 0 });
}