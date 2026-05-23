'use client';

import {
  CallIcon,
  LiveSessionIcon,
  LoadingIcon,
  NotificationIcon,
  Star,
  StarIcon,
} from '@/assets/icons';
import { useGetMentorPreviousCallsQuery } from '@/store/calls/calls.api';
import { useGetMentorDashboardStatsQuery } from '@/store/dashboard/dashboard.api';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { shouldShowMentorFeedbackReminder } from '@/utils/dashboardCallReminders';
import { deriveMentorStatsFromPreviousCalls } from '@/utils/mentorDashboardStats';
import WelcomeSection from './WelcomeSection';
import StatCard from './StatCard';
import ReminderCard from './ReminderCard';
import Link from 'next/link';
import React, { useMemo } from 'react';

export default function MentorDashboard() {
  const user = useSelector((state: RootState) => state.profile.user);
  const displayName = (user as { full_name?: string; fullName?: string })?.full_name ?? (user as { fullName?: string })?.fullName ?? '';
  const firstName = displayName.split(' ')[0] || 'there';
  const { data: stats, isError: statsError, isLoading: statsLoading } =
    useGetMentorDashboardStatsQuery(undefined, {
      skip: user?.role !== 'MENTOR',
    });
  const { data: previousCallsData, isLoading: previousCallsLoading } =
    useGetMentorPreviousCallsQuery(undefined, {
      skip: user?.role !== 'MENTOR',
    });
  const statsPending =
    user?.role === 'MENTOR' && (statsLoading || previousCallsLoading);
  const { rating, totalCalls } = useMemo(() => {
    const apiRating = stats?.averageRating ?? 0;
    const apiTotal = stats?.totalCalls ?? 0;
    const calls = previousCallsData?.data ?? [];
    const derived = deriveMentorStatsFromPreviousCalls(calls);
    const apiEmpty = apiTotal === 0 && apiRating === 0;
    const useDerived =
      (statsError && calls.length > 0) ||
      (!statsError && apiEmpty && calls.length > 0);
    if (useDerived) {
      return { rating: derived.averageRating, totalCalls: derived.totalCalls };
    }
    return { rating: apiRating, totalCalls: apiTotal };
  }, [stats, statsError, previousCallsData]);
  const showFeedbackReminder = shouldShowMentorFeedbackReminder(
    previousCallsData?.data ?? []
  );

  const ratingStarsFilled =
    rating && rating > 0
      ? Math.min(5, Math.max(0, Math.round(Number(rating))))
      : 0;

  return (
    <div className="space-y-6 sm:space-y-8 w-full min-w-0">
      <WelcomeSection
        title={`Hi ${firstName}, welcome back.`}
        subtitle="Here’s your mentoring overview. Keep an eye on reminders and your upcoming sessions."
      />

      {/* Stats */}
      <section>
        <h2 className="text-lg font-semibold text-[#101828] mb-4">Your overview</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            label="Rating"
            value={
              statsPending ? (
                <div className="flex min-h-[7rem] items-center justify-start py-1">
                  <LoadingIcon
                    width="36"
                    height="36"
                    className="animate-spin text-green-200"
                    aria-hidden
                  />
                  <span className="sr-only">Loading rating…</span>
                </div>
              ) : (
                <div className="space-y-3">
                  <div
                    className="flex gap-1 items-center"
                    role="img"
                    aria-label={
                      rating && rating > 0
                        ? `Average rating ${Number(rating).toFixed(1)} out of 5`
                        : 'No rating yet'
                    }
                  >
                    {[1, 2, 3, 4, 5].map((i) => (
                      <StarIcon
                        key={i}
                        className="w-6 h-6 sm:w-7 sm:h-7 shrink-0"
                        fill={i <= ratingStarsFilled ? '#F59E0B' : '#E5E7EB'}
                      />
                    ))}
                  </div>
                  <span
                    className="inline-block rounded-lg bg-amber-50 px-3 py-1.5 text-2xl sm:text-3xl font-bold text-[#101828] tabular-nums shadow-sm ring-1 ring-amber-100/80"
                  >
                    {rating && rating > 0 ? Number(rating).toFixed(1) : '—'}
                  </span>
                </div>
              )
            }
          />
          <StatCard
            label="Calls had"
            value={
              statsPending ? (
                <div className="flex min-h-[7rem] items-center justify-start py-1">
                  <LoadingIcon
                    width="36"
                    height="36"
                    className="animate-spin text-green-200"
                    aria-hidden
                  />
                  <span className="sr-only">Loading call count…</span>
                </div>
              ) : (
                totalCalls
              )
            }
            icon={<CallIcon />}
          />
        </div>
      </section>

      {/* Reminders */}
      <section>
        <h2 className="text-lg font-semibold text-[#101828] mb-4 flex items-center gap-2">
          <span className="text-green-200">
            <NotificationIcon width={20} height={20} />
          </span>
          Reminders & notifications
        </h2>
        <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
          {showFeedbackReminder && (
            <ReminderCard
              variant="highlight"
              title="Add feedback for your last meeting"
              description="Share how the session went and what the team or parents should know. Your notes help us support the teen better."
              href="/dashboard/calls/mentor?role=previous"
              linkLabel="Add feedback"
              icon={<Star />}
            />
          )}
          <ReminderCard
            title="Upcoming calls"
            description="View and manage your scheduled calls. Join on time and add notes after each session."
            href="/dashboard/calls/mentor?role=upcoming"
            linkLabel="View upcoming calls"
            icon={<CallIcon />}
          />
          <ReminderCard
            title="Live sessions"
            description="Create and manage live sessions. Add notes and recordings for teens to watch."
            href="/dashboard/live-sessions"
            linkLabel="Go to live sessions"
            icon={<LiveSessionIcon />}
          />
        </div>
      </section>

      {/* Quick links – hidden on mobile */}
      <section className="hidden md:block">
        <h2 className="text-lg font-semibold text-[#101828] mb-4">Quick links</h2>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Link
            href="/dashboard/calls/mentor"
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 sm:px-5 sm:py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 hover:border-green-200/60 transition-colors touch-manipulation"
          >
            Calls
          </Link>
          <Link
            href="/dashboard/calls/mentor?role=upcoming"
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 sm:px-5 sm:py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 hover:border-green-200/60 transition-colors touch-manipulation"
          >
            Upcoming calls
          </Link>
          <Link
            href="/dashboard/calls/mentor?role=requests"
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 sm:px-5 sm:py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 hover:border-green-200/60 transition-colors touch-manipulation"
          >
            Call requests
          </Link>
          <Link
            href="/dashboard/availabilty-schedule/mentor"
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 sm:px-5 sm:py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 hover:border-green-200/60 transition-colors touch-manipulation"
          >
            Availability
          </Link>
          <Link
            href="/dashboard/live-sessions"
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 sm:px-5 sm:py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 hover:border-green-200/60 transition-colors touch-manipulation"
          >
            Live sessions
          </Link>
        </div>
      </section>
    </div>
  );
}
