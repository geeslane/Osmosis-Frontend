'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LoadingIcon } from '@/assets/icons';
import useToastify from '@/hooks/useToastify';
import { useSyncGoogleCalendarMutation } from '@/store/schedule/schedule.api';

const SCHEDULE_DASHBOARD = '/dashboard/availabilty-schedule/mentor';

const TOAST_GOOGLE_CAL = 'mentor-google-calendar-callback';

/**
 * OAuth callback landing: backend redirects here with
 * ?google_calendar=success | error (& optional reason=).
 * Optionally POST /google-calendar/sync, then return to availability UI.
 */
export default function MentorGoogleCalendarCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToastify();
  const [syncGoogleCalendar] = useSyncGoogleCalendarMutation();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const status = searchParams.get('google_calendar');
    const reason =
      searchParams.get('reason') ??
      searchParams.get('message') ??
      searchParams.get('error');

    const go = async () => {
      if (status === 'success') {
        showToast('Google Calendar connected.', 'success', {
          toastId: TOAST_GOOGLE_CAL,
        });
        try {
          await syncGoogleCalendar().unwrap();
        } catch {
          // Optional sync failed; availability refetch on next screen still applies.
        }
        router.replace(SCHEDULE_DASHBOARD);
        return;
      }

      if (status === 'error') {
        showToast(
          typeof reason === 'string' && reason.trim()
            ? reason.trim()
            : 'Google Calendar connection failed.',
          'error',
          { toastId: TOAST_GOOGLE_CAL }
        );
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
      <p className="text-center text-sm text-gray-500">
        Finishing Google Calendar setup…
      </p>
    </div>
  );
}
