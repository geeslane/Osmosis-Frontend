/** RTK Query / axiosBaseQuery error shape from schedule API calls. */
export type ScheduleApiErrorPayload = {
  message?: string;
  statusCode?: number;
  errorCode?: string;
  success?: boolean;
};

export function getScheduleApiErrorPayload(
  err: unknown
): ScheduleApiErrorPayload | undefined {
  if (!err || typeof err !== 'object') return undefined;
  const data = (err as { data?: unknown }).data;
  if (data && typeof data === 'object') {
    return data as ScheduleApiErrorPayload;
  }
  return undefined;
}

export function getScheduleApiErrorStatus(err: unknown): number | undefined {
  if (!err || typeof err !== 'object') return undefined;
  const direct = (err as { status?: number }).status;
  if (typeof direct === 'number') return direct;
  return getScheduleApiErrorPayload(err)?.statusCode;
}

export function getScheduleApiErrorMessage(err: unknown): string | undefined {
  const payload = getScheduleApiErrorPayload(err);
  const message = payload?.message;
  return typeof message === 'string' && message.trim() ? message.trim() : undefined;
}

/** Sync 400 when tokens were revoked, expired, or never connected. */
export function isGoogleCalendarReconnectError(err: unknown): boolean {
  const status = getScheduleApiErrorStatus(err);
  if (status !== 400) return false;
  const message = (getScheduleApiErrorMessage(err) ?? '').toLowerCase();
  return (
    message.includes('revoked') ||
    message.includes('expired') ||
    message.includes('not connected') ||
    message.includes('authorization again')
  );
}

export function decodeGoogleCalendarOAuthReason(
  reason: string | null | undefined
): string {
  if (!reason?.trim()) {
    return "Couldn't connect Google Calendar. Try again.";
  }
  try {
    return decodeURIComponent(reason.trim());
  } catch {
    return reason.trim();
  }
}

export const GOOGLE_CALENDAR_COPY = {
  disconnected:
    'Connect Google Calendar to block busy times from bookings.',
  finishSetup:
    'Finish setup — verify your calendar so busy times hide unavailable slots.',
  connectedTitle: 'Google Calendar connected',
  connectedSubtitle: 'Busy times block bookable slots.',
  verifying: 'Verifying Google Calendar…',
  syncSuccess:
    'Google Calendar connected. Your busy times will hide unavailable slots.',
  reconnect:
    'Your Google Calendar link expired. Connect again to keep busy times in sync.',
  oauthError: "Couldn't connect Google Calendar. Try again.",
  signInToFinish:
    'Sign in to finish connecting Google Calendar to your schedule.',
  accessDenied:
    'Google Calendar connection was cancelled. Sign in, then try Connect again from your availability schedule.',
} as const;

/** Query keys returned from the backend OAuth redirect to /mentor/schedule */
export const GOOGLE_CALENDAR_OAUTH_QUERY_KEYS = [
  'google_calendar',
  'reason',
  'message',
  'error',
] as const;

export const MENTOR_GOOGLE_CALENDAR_CALLBACK_PATH = '/mentor/schedule';

export function pickGoogleCalendarOAuthSearchParams(
  source: URLSearchParams
): URLSearchParams {
  const out = new URLSearchParams();
  for (const key of GOOGLE_CALENDAR_OAUTH_QUERY_KEYS) {
    const value = source.get(key);
    if (value != null && value !== '') {
      out.set(key, value);
    }
  }
  return out;
}

export function appendGoogleCalendarOAuthToPath(
  pathname: string,
  oauth: URLSearchParams
): string {
  if (!oauth.toString()) return pathname;
  return `${pathname}?${oauth.toString()}`;
}

export function parseGoogleCalendarOAuthFromRedirect(
  redirectPath: string | null | undefined
): { status: string | null; reason: string | null } {
  if (!redirectPath?.trim()) {
    return { status: null, reason: null };
  }
  const queryIndex = redirectPath.indexOf('?');
  if (queryIndex === -1) {
    return { status: null, reason: null };
  }
  const params = new URLSearchParams(redirectPath.slice(queryIndex + 1));
  return {
    status: params.get('google_calendar'),
    reason:
      params.get('reason') ?? params.get('message') ?? params.get('error'),
  };
}

export function humanizeGoogleCalendarOAuthReason(
  reason: string | null | undefined
): string {
  if (!reason?.trim()) {
    return GOOGLE_CALENDAR_COPY.oauthError;
  }
  const decoded = decodeGoogleCalendarOAuthReason(reason);
  const lower = decoded.toLowerCase();
  if (lower === 'access_denied' || lower.includes('access denied')) {
    return GOOGLE_CALENDAR_COPY.accessDenied;
  }
  return decoded;
}

export function getSignInMessageForPendingGoogleCalendarOAuth(
  redirectPath: string | null | undefined
): { type: 'error' | 'info'; message: string } | null {
  const { status, reason } = parseGoogleCalendarOAuthFromRedirect(redirectPath);
  if (status === 'error') {
    return {
      type: 'error',
      message: humanizeGoogleCalendarOAuthReason(reason),
    };
  }
  if (status === 'success') {
    return {
      type: 'info',
      message: GOOGLE_CALENDAR_COPY.signInToFinish,
    };
  }
  return null;
}

/** Build /signin?redirect=… with OAuth params folded into redirect (clean sign-in URL). */
export function buildSignInUrlForProtectedPath(
  origin: string,
  pathname: string,
  searchParams: URLSearchParams
): URL {
  const oauth = pickGoogleCalendarOAuthSearchParams(searchParams);
  const redirectTarget = appendGoogleCalendarOAuthToPath(pathname, oauth);
  const signIn = new URL('/signin', origin);
  signIn.searchParams.set('redirect', redirectTarget);
  return signIn;
}
