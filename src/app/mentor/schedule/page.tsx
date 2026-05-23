'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LoadingIcon } from '@/assets/icons';
import useToastify from '@/hooks/useToastify';
import { store } from '@/store';
import { ScheduleApi, useSyncGoogleCalendarMutation } from '@/store/schedule/schedule.api';
import {
  GOOGLE_CALENDAR_COPY,
  getScheduleApiErrorMessage,
  humanizeGoogleCalendarOAuthReason,
  isGoogleCalendarReconnectError,
} from '@/utils/googleCalendarAvailability';

const SCHEDULE_DASHBOARD = '/dashboard/availabilty-schedule/mentor';
const TOAST_GOOGLE_CAL = 'mentor-google-calendar-callback';

function stripOAuthQueryParams() {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  url.searchParams.delete('google_calendar');
  url.searchParams.delete('reason');
  url.searchParams.delete('message');
  url.searchParams.delete('error');
  window.history.replaceState({}, '', url.pathname);
}

/**
 * OAuth callback landing: backend redirects here with
 * ?google_calendar=success | error (& optional reason=).
 * POST /sync, refetch availability flags, then return to schedule UI.
 */
export default function MentorGoogleCalendarCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToastify();
  const [syncGoogleCalendar] = useSyncGoogleCalendarMutation();
  const ran = useRef(false);
  const [statusMessage, setStatusMessage] = useState(
    GOOGLE_CALENDAR_COPY.verifying
  );

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const status = searchParams.get('google_calendar');
    const reason =
      searchParams.get('reason') ??
      searchParams.get('message') ??
      searchParams.get('error');

    const invalidateAvailability = () => {
      store.dispatch(ScheduleApi.util.invalidateTags(['MentorAvailability']));
    };

    const go = async () => {
      stripOAuthQueryParams();

      if (status === 'success') {
        setStatusMessage(GOOGLE_CALENDAR_COPY.verifying);
        try {
          const result = await syncGoogleCalendar().unwrap();
          invalidateAvailability();
          showToast(
            result.message ?? GOOGLE_CALENDAR_COPY.syncSuccess,
            'success',
            { toastId: TOAST_GOOGLE_CAL }
          );
        } catch (err: unknown) {
          invalidateAvailability();
          if (isGoogleCalendarReconnectError(err)) {
            showToast(GOOGLE_CALENDAR_COPY.reconnect, 'error', {
              toastId: TOAST_GOOGLE_CAL,
            });
          } else {
            showToast(
              getScheduleApiErrorMessage(err) ??
                'Google Calendar connected, but verification failed. Try again from your schedule.',
              'error',
              { toastId: TOAST_GOOGLE_CAL }
            );
          }
        }
        router.replace(SCHEDULE_DASHBOARD);
        return;
      }

      if (status === 'error') {
        showToast(humanizeGoogleCalendarOAuthReason(reason), 'error', {
          toastId: TOAST_GOOGLE_CAL,
        });
        router.replace(SCHEDULE_DASHBOARD);
        return;
      }

      router.replace(SCHEDULE_DASHBOARD);
    };

    void go();
  }, [router, searchParams, showToast, syncGoogleCalendar]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4">
      <LoadingIcon height="32" width="32" className="animate-spin text-green-100" />
      <p className="text-center text-sm text-gray-500">{statusMessage}</p>
    </div>
  );
}
