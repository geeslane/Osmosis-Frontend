'use client';

import { useGetMenteePreviousCallsQuery } from '@/store/calls/calls.api';
import type { CallRecord } from '@/store/calls/calls.api';
import { useTeenagerCallRequestsQuery } from '@/store/dashboard/dashboard.api';
import {
  pickCallsArray,
  rawToTeenagerCallRequestRow,
} from '@/utils/mapCallApi';
import Link from 'next/link';
import { useMemo } from 'react';
import CreateSchedule from './CreateSchecdule';

/** True if date string (YYYY-MM-DD or parseable) falls within the last 7 days (inclusive). */
function isWithinLast7Days(dateStr: string): boolean {
  if (!dateStr) return false;
  let date: Date;
  if (/^\d{4}-\d{2}-\d{2}/.test(dateStr.trim())) {
    date = new Date(dateStr.trim().slice(0, 10));
  } else {
    date = new Date(dateStr);
  }
  if (Number.isNaN(date.getTime())) return false;
  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  sevenDaysAgo.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  return date >= sevenDaysAgo && date <= now;
}

function hadCallInLast7Days(previousCalls: CallRecord[]): boolean {
  return (previousCalls ?? []).some((c) => isWithinLast7Days(c.date));
}

export default function BookACallGuard() {
  const { data: previousData } = useGetMenteePreviousCallsQuery();
  const { data: requestsRaw, isError: requestsError } = useTeenagerCallRequestsQuery();

  const previous = previousData?.data ?? [];
  const hadRecent = hadCallInLast7Days(previous);

  const hasPendingCallRequest = useMemo(() => {
    if (requestsError) return false;
    const rows = pickCallsArray(requestsRaw).map(rawToTeenagerCallRequestRow);
    return rows.some((r) => r.status === 'Pending');
  }, [requestsRaw, requestsError]);

  if (hasPendingCallRequest) {
    return (
      <div className="mt-6 sm:mt-8 max-w-2xl mx-auto w-full min-w-0 px-4 sm:px-0">
        <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-6 sm:p-8 text-center">
          <h2 className="text-lg font-semibold text-amber-800">
            You already have a pending call request
          </h2>
          <p className="text-amber-700 mt-2 text-sm">
            Wait for your mentor to respond before booking another call. You can check the status of
            your request under 'My calls'.
          </p>
          <Link
            href="/dashboard/calls/mentee"
            className="inline-block mt-6 text-green-200 font-medium hover:underline"
          >
            View my calls →
          </Link>
        </div>
      </div>
    );
  }

  if (hadRecent) {
    return (
      <div className="mt-6 sm:mt-8 max-w-2xl mx-auto w-full min-w-0 px-4 sm:px-0">
        <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-6 sm:p-8 text-center">
          <h2 className="text-lg font-semibold text-amber-800">You had a call in the last 7 days</h2>
          <p className="text-amber-700 mt-2 text-sm">
            You can book again after 7 days from your last call.
          </p>
          <Link
            href="/dashboard/calls/mentee?role=previous"
            className="inline-block mt-6 text-green-200 font-medium hover:underline"
          >
            View my call history →
          </Link>
        </div>
      </div>
    );
  }

  return <CreateSchedule />;
}
