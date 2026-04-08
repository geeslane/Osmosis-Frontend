'use client';

import {
  CallIcon,
  LiveSessionIcon,
  NotificationIcon,
  Star,
} from '@/assets/icons';
import {
  useGetMenteePreviousCallsQuery,
  useGetMenteeUpcomingCallsQuery,
} from '@/store/calls/calls.api';
import { useModulesQuery, useGetProgramConfigQuery } from '@/store/dashboard/dashboard.api';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { normalizeImageUrl } from '@/utils/helper';
import ReminderCard from './ReminderCard';
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';

/** True if date string (YYYY-MM-DD or parseable) falls within the last 7 days (inclusive). */
function isWithinLast7Days(dateStr: string): boolean {
  if (!dateStr) return false;
  let date: Date;
  const trimmed = String(dateStr).trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
    date = new Date(trimmed.slice(0, 10));
  } else {
    date = new Date(trimmed);
  }
  if (Number.isNaN(date.getTime())) return false;
  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  sevenDaysAgo.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  return date >= sevenDaysAgo && date <= now;
}

/** True if the call has mentee feedback (rating or comment) already. */
function hasMenteeFeedback(call: { rating?: number | null; menteeComment?: string | null }): boolean {
  const hasRating = call.rating != null && call.rating !== undefined;
  const hasComment = !!(
    call.menteeComment != null &&
    String(call.menteeComment).trim() !== ''
  );
  return hasRating || hasComment;
}

/** Calls that are within the last 7 days and do not yet have mentee feedback. */
function getCallsNeedingFeedback(
  previousCalls: { date: string; mentorName?: string; id?: string; rating?: number | null; menteeComment?: string | null }[]
): { date: string; mentorName?: string; id?: string }[] {
  if (!previousCalls?.length) return [];
  return previousCalls.filter(
    (c) => isWithinLast7Days(c.date) && !hasMenteeFeedback(c)
  );
}

/** Demo: one previous call in the last 7 days with no feedback (so Pending feedback section is visible when API has no data). */
function getDemoPreviousCall(): { id: string; date: string; mentorName: string; rating?: null; menteeComment?: null } {
  const d = new Date();
  d.setDate(d.getDate() - 2);
  const dateStr = d.toISOString().slice(0, 10);
  return {
    id: 'demo-feedback-1',
    date: dateStr,
    mentorName: 'Your mentor',
    rating: undefined,
    menteeComment: undefined,
  };
}

/** Demo: modules all completed so the "100% done" state is visible when API has no modules. */
const DEMO_MODULES_ALL_DONE = [
  { id: 'demo-1', markedCompleted: true },
  { id: 'demo-2', markedCompleted: true },
  { id: 'demo-3', markedCompleted: true },
];

export default function TeenagerDashboard() {
  const user = useSelector((state: RootState) => state.profile.user);
  const displayName = (user as { full_name?: string; fullName?: string })?.full_name ?? (user as { fullName?: string })?.fullName ?? '';
  const firstName = displayName.split(' ')[0] || 'there';
  const avatar = (user as { avatar?: string })?.avatar ?? (user as { pictureUrl?: string })?.pictureUrl;
  const { data: upcomingData } = useGetMenteeUpcomingCallsQuery();
  const { data: previousData } = useGetMenteePreviousCallsQuery();
  const { data: modulesData } = useModulesQuery(undefined);
  const { data: programConfig } = useGetProgramConfigQuery();
  const upcoming = upcomingData?.data ?? [];
  const previousRaw = previousData?.data ?? [];
  const previous = previousRaw.length > 0 ? previousRaw : [getDemoPreviousCall()];
  const callsNeedingFeedback = getCallsNeedingFeedback(previous);
  const showFeedbackReminder = callsNeedingFeedback.length > 0;
  const modulesRaw = modulesData?.data?.data ?? [];
  const modules = modulesRaw.length > 0 ? modulesRaw : DEMO_MODULES_ALL_DONE;
  const completedCount = modules.filter((m) => m.markedCompleted).length;
  const totalModules = modules.length;
  const progressPercent = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;

  const programStart = programConfig?.startDate;
  const programEnd = programConfig?.endDate;
  let programDaysLeft: number | null = null;
  if (programEnd) {
    const end = new Date(programEnd.slice(0, 10));
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    const diff = Math.ceil((end.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
    programDaysLeft = diff < 0 ? 0 : diff;
  }
  const formatProgramDate = (s: string) => {
    const d = new Date(s.slice(0, 10));
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="space-y-6 sm:space-y-8 w-full min-w-0">
      {/* Teens Lab hero – catchy, with picture */}
      <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 text-white p-6 sm:p-8 md:p-10 shadow-xl">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
          <div className="flex-shrink-0">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full ring-4 ring-white/30 overflow-hidden bg-white/20 flex items-center justify-center">
              {avatar ? (
                <Image
                  src={normalizeImageUrl(avatar)}
                  alt={firstName}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              ) : (
                <span className="text-4xl font-bold text-white/90">
                  {firstName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-200/95 mb-1">
              Teens Lab
            </p>
            <h1 className="text-xl sm:text-2xl md:text-4xl font-black tracking-tight">
              Hey {firstName}! 👋
            </h1>
            <p className="mt-2 text-white/90 text-sm sm:text-base md:text-lg max-w-xl">
              Your space to learn, grow, and connect. You&apos;re doing great. Keep it up.
            </p>
          </div>
        </div>
        {/* White Artboard 1 in background */}
        <div className="absolute inset-0 flex items-center justify-end pointer-events-none overflow-hidden">
          <div className="relative w-56 h-56 sm:w-72 sm:h-72 opacity-[0.45]">
            <Image
              src="/image/Artboard1.png"
              alt=""
              fill
              className="object-contain brightness-0 invert"
              sizes="(max-width: 640px) 224px, 288px"
              aria-hidden
              unoptimized
            />
          </div>
        </div>
      </section>

      {/* Program dates (when admin has set program schedule) */}
      {programStart && programEnd && (
        <section className="rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
          <p className="text-sm font-medium text-gray-700">
            Program: {formatProgramDate(programStart)} – {formatProgramDate(programEnd)}
            {programDaysLeft !== null && (
              <span className="text-green-600 font-semibold ml-2">
                · {programDaysLeft} day{programDaysLeft !== 1 ? 's' : ''} left
              </span>
            )}
          </p>
        </section>
      )}

      {/* Module progress – fancy & catchy */}
      <section>
        <h2 className="text-lg font-bold text-[#101828] mb-4">
          Your progress 🚀
        </h2>
        <Link
          href="/dashboard/modules"
          className="block rounded-2xl border-2 border-green-200/50 bg-gradient-to-br from-green-50 to-emerald-50/80 p-4 sm:p-6 shadow-sm hover:shadow-md hover:border-green-200 transition-all"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <div className="flex-1">
              <p className="text-sm font-semibold text-green-800/90">
                {completedCount === totalModules && totalModules > 0
                  ? "You've completed all modules! 🎉"
                  : totalModules === 0
                    ? "Start your first module"
                    : `${completedCount} of ${totalModules} modules done, you're crushing it!`}
              </p>
              {completedCount === totalModules && totalModules > 0 && (
                <p className="text-xs text-green-700/80 mt-1">
                  Keep exploring, book a call with a mentor, or join a live session.
                </p>
              )}
              <div className="mt-3 h-3 rounded-full bg-white/80 overflow-hidden shadow-inner">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
            <span className="inline-flex items-center justify-center rounded-xl bg-green-200 text-white font-bold text-xl sm:text-2xl min-w-[3.5rem] sm:min-w-[4rem] h-12 sm:h-14">
              {progressPercent}%
            </span>
          </div>
          <p className="mt-3 text-sm font-medium text-green-700">
            {completedCount === totalModules && totalModules > 0 ? 'View modules' : 'Continue learning'} →
          </p>
        </Link>
      </section>

      {/* Reminders & Notifications */}
      <section>
        <h2 className="text-lg font-bold text-[#101828] mb-4 flex items-center gap-2">
          <span className="text-green-200"><NotificationIcon width={20} height={20} /></span>
          Reminders & notifications
        </h2>
        <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
          {showFeedbackReminder && (
            <ReminderCard
              variant="highlight"
              title="Share feedback on your last call"
              description="Let your mentor and the Osmosis team know how your last session went. Your feedback helps improve the experience."
              href="/dashboard/calls/mentee?role=previous"
              linkLabel="Give feedback"
              icon={<Star />}
            />
          )}
          {upcoming.length > 0 && (
            <ReminderCard
              title="Upcoming call"
              description={`You have ${upcoming.length} upcoming call${upcoming.length > 1 ? 's' : ''}. Get ready and join on time.`}
              href="/dashboard/calls/mentee?role=upcoming"
              linkLabel="View upcoming calls"
              icon={<CallIcon />}
            />
          )}
          <ReminderCard
            title="Live sessions"
            description="Watch and join live sessions, and join the conversation with comments."
            href="/dashboard/live-sessions"
            linkLabel="Browse live sessions"
            icon={<LiveSessionIcon />}
          />
          {upcoming.length === 0 && !showFeedbackReminder && (
            <ReminderCard
              title="Book a call with a mentor"
              description="Choose a topic, pick a mentor, and schedule a call when you're ready."
              href="/dashboard/book-a-call"
              linkLabel="Book a call"
              icon={<CallIcon />}
            />
          )}
        </div>
      </section>

      {/* Quick links – teen-friendly */}
      <section>
        <h2 className="text-lg font-bold text-[#101828] mb-4">Quick links</h2>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Link
            href="/dashboard/calls/mentee"
            className="rounded-xl sm:rounded-2xl border-2 border-gray-200 bg-white px-4 py-2.5 sm:px-5 sm:py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-green-50 hover:border-green-200/60 transition-all touch-manipulation"
          >
            My calls
          </Link>
          <Link
            href="/dashboard/book-a-call"
            className="rounded-xl sm:rounded-2xl border-2 border-gray-200 bg-white px-4 py-2.5 sm:px-5 sm:py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-green-50 hover:border-green-200/60 transition-all touch-manipulation"
          >
            Book a call
          </Link>
          <Link
            href="/dashboard/modules"
            className="rounded-xl sm:rounded-2xl border-2 border-gray-200 bg-white px-4 py-2.5 sm:px-5 sm:py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-green-50 hover:border-green-200/60 transition-all touch-manipulation"
          >
            Modules
          </Link>
          <Link
            href="/dashboard/live-sessions"
            className="rounded-xl sm:rounded-2xl border-2 border-gray-200 bg-white px-4 py-2.5 sm:px-5 sm:py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-green-50 hover:border-green-200/60 transition-all touch-manipulation"
          >
            Live sessions
          </Link>
        </div>
      </section>
    </div>
  );
}
