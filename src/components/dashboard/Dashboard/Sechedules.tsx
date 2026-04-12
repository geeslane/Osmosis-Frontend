'use client';

import { ArrowLeft, PersonalBranding, ProfessionalIcons } from '@/assets/icons';
import { Meta } from '@/components/common/Details/Meta';
import { getScheduledAtMs } from '@/utils/dashboardCallReminders';
import { useGetMenteeUpcomingCallsQuery } from '@/store/calls/calls.api';
import { liveSessionsApi } from '@/lib/liveSessionsApi';
import { apiSessionToRecord, type LiveSessionRecord } from '@/lib/liveSessions';
import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export default function Sechedules() {
  const user = useSelector((state: RootState) => state.profile.user);
  const isTeen = user?.role === 'TEENAGER';
  const { data: upcomingData, isLoading: loadingCalls } = useGetMenteeUpcomingCallsQuery(
    undefined,
    { skip: !isTeen }
  );

  const nextCall = useMemo(() => {
    const list = upcomingData?.data ?? [];
    if (!list.length) return null;
    const sorted = [...list].sort(
      (a, b) => getScheduledAtMs(a) - getScheduledAtMs(b)
    );
    return sorted[0] ?? null;
  }, [upcomingData?.data]);

  const [liveRows, setLiveRows] = useState<LiveSessionRecord[]>([]);
  const [liveLoading, setLiveLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLiveLoading(true);
      try {
        const res = await liveSessionsApi.list({ page: 1, limit: 4 });
        const list = Array.isArray(res.data) ? res.data : [];
        if (!cancelled) {
          setLiveRows(list.map(apiSessionToRecord));
        }
      } catch {
        if (!cancelled) setLiveRows([]);
      } finally {
        if (!cancelled) setLiveLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const nextDateLabel = nextCall?.date ?? '—';
  const nextTimeLabel = nextCall?.time ?? '—';
  const nextTopic = nextCall?.topic && nextCall.topic !== '—' ? nextCall.topic : '—';
  const mentorName =
    nextCall?.mentorName && nextCall.mentorName !== '—' ? nextCall.mentorName : '—';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 py-[56px] gap-4">
      <div className="border-green-100 space-y-4 border-[1.5px] p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-green-300 font-semibold text-2xl">
            Next Scheduled call
          </h3>
          <Link
            href="/dashboard/calls/mentee?role=upcoming"
            className="flex gap-1 cursor-pointer items-center text-xs text-green-300 font-medium"
          >
            View all <ArrowLeft />
          </Link>
        </div>
        <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between">
          <div>
            <h3 className="text-sm text-green-300 font-medium">Mentor Name</h3>
            <h3 className="text-lg text-green-200 font-semibold">
              {loadingCalls && isTeen ? '…' : mentorName}
            </h3>
          </div>
          <Link
            href={
              nextCall?.meetingUrl && nextCall.meetingUrl.length > 0
                ? nextCall.meetingUrl
                : '/dashboard/calls/mentee?role=upcoming'
            }
            className="bg-green-100 text-white font-semibold px-3 py-2 flex items-center gap-1 rounded-xl text-sm hover:opacity-90 transition-opacity"
          >
            Join call
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-6">
          <Meta label="Date" value={nextDateLabel} />
          <Meta label="Time" value={nextTimeLabel} />
          <Meta label="Topic" value={nextTopic} />
        </div>
        {!isTeen && (
          <p className="text-xs text-gray-500">Sign in as a mentee to see your next call.</p>
        )}
        {isTeen && !loadingCalls && !nextCall && (
          <p className="text-sm text-gray-500">No upcoming calls scheduled.</p>
        )}
      </div>
      <div className="border-green-100 border-[1.5px] p-6 rounded-lg">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-green-200 font-semibold text-2xl">
            Live session reminders
          </h3>
          <Link
            href="/dashboard/live-sessions"
            className="text-xs text-green-300 font-medium hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="space-y-[20px] pt-[20px]">
          {liveLoading && (
            <p className="text-sm text-gray-500">Loading sessions…</p>
          )}
          {!liveLoading && liveRows.length === 0 && (
            <p className="text-sm text-gray-500">No live sessions scheduled.</p>
          )}
          {!liveLoading &&
            liveRows.map((session, i) => {
              const timeStr =
                session.time && session.date
                  ? `${session.time} | ${session.date}`
                  : '—';
              const Icon = i % 2 === 0 ? ProfessionalIcons : PersonalBranding;
              return (
                <div
                  key={session.id}
                  className="flex justify-between items-center px-3 gap-2"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <Icon />
                    <div className="min-w-0">
                      <h3 className="text-[#1C1D1D] font-medium truncate">
                        {session.topic || '—'}
                      </h3>
                      <h3 className="text-green-300 text-sm truncate">{timeStr}</h3>
                    </div>
                  </div>
                  <a
                    href={session.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center bg-green-100 text-white font-semibold px-6 py-2 rounded-xl shrink-0 text-sm hover:opacity-90 transition-opacity"
                  >
                    Join
                  </a>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
