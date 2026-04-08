'use client';

import {
  CallIcon,
  LiveSessionIcon,
  NotificationIcon,
  Star,
} from '@/assets/icons';
import { useGetMentorPreviousCallsQuery } from '@/store/calls/calls.api';
import { useGetMentorDashboardStatsQuery } from '@/store/dashboard/dashboard.api';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { shouldShowMentorFeedbackReminder } from '@/utils/dashboardCallReminders';
import WelcomeSection from './WelcomeSection';
import StatCard from './StatCard';
import ReminderCard from './ReminderCard';
import Link from 'next/link';
import React from 'react';

export default function MentorDashboard() {
  const user = useSelector((state: RootState) => state.profile.user);
  const displayName = (user as { full_name?: string; fullName?: string })?.full_name ?? (user as { fullName?: string })?.fullName ?? '';
  const firstName = displayName.split(' ')[0] || 'there';
  const { data: stats } = useGetMentorDashboardStatsQuery(undefined, {
    skip: user?.role !== 'MENTOR',
  });
  const { data: previousCallsData } = useGetMentorPreviousCallsQuery(undefined, {
    skip: user?.role !== 'MENTOR',
  });
  const rating = stats?.averageRating ?? 0;
  const totalCalls = stats?.totalCalls ?? 0;
  const showFeedbackReminder = shouldShowMentorFeedbackReminder(
    previousCallsData?.data ?? []
  );

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
            value={rating ? `${Number(rating).toFixed(1)}` : '—'}
            icon={<Star />}
          />
          <StatCard
            label="Calls had"
            value={totalCalls}
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

      {/* Quick links */}
      <section>
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
