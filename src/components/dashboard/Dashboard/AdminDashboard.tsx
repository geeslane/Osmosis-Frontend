'use client';

import {
  CallIcon,
  LiveSessionIcon,
  UserManagementIcon,
  ContentManagementIcon,
  PendingRequestIcon,
  ScheduleIcon,
  NotificationIcon,
} from '@/assets/icons';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import WelcomeSection from './WelcomeSection';
import ReminderCard from './ReminderCard';
import StatCard from './StatCard';
import LoadingEllipsis from '@/components/ui/LoadingEllipsis';
import Link from 'next/link';
import React from 'react';
import { useGetAdminDashboardStatsQuery } from '@/store/dashboard/dashboard.api';

function formatCount(n: number): string {
  return n.toLocaleString();
}

export default function AdminDashboard() {
  const user = useSelector((state: RootState) => state.profile.user);
  const displayName =
    (user as { full_name?: string; fullName?: string })?.full_name ??
    (user as { fullName?: string })?.fullName ??
    '';
  const firstName = displayName.split(' ')[0] || 'there';
  const isAdminRole = user?.role === 'SUPERADMIN' || user?.role === 'ADMIN';

  const { data: stats, isLoading: statsLoading } = useGetAdminDashboardStatsQuery(
    isAdminRole && (user?.role === 'SUPERADMIN' || user?.role === 'ADMIN')
      ? { role: user.role }
      : undefined,
    { skip: !isAdminRole }
  );

  const pending = stats?.pendingRequests ?? 0;

  return (
    <div className="space-y-6 sm:space-y-8 w-full min-w-0">
      <WelcomeSection
        title={`Hi ${firstName}, welcome back.`}
        subtitle="Here’s a snapshot of the platform. Use quick links to jump in, or follow up on program schedule and notifications below."
      />

      <section>
        <h2 className="text-lg font-semibold text-[#101828] mb-4">At a glance</h2>
        <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Pending requests"
            value={statsLoading ? <LoadingEllipsis /> : formatCount(pending)}
            icon={<PendingRequestIcon />}
            className={pending > 0 ? 'ring-1 ring-amber-200/90 bg-amber-50/40' : ''}
          />
          <StatCard
            label="Mentorship calls"
            value={statsLoading ? <LoadingEllipsis /> : formatCount(stats?.totalCalls ?? 0)}
            icon={<CallIcon />}
          />
          <StatCard
            label="Mentors"
            value={statsLoading ? <LoadingEllipsis /> : formatCount(stats?.totalMentors ?? 0)}
            icon={<UserManagementIcon className="w-6 h-6" />}
          />
          <StatCard
            label="Mentees"
            value={statsLoading ? <LoadingEllipsis /> : formatCount(stats?.totalMentees ?? 0)}
            icon={<UserManagementIcon className="w-6 h-6" />}
          />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-[#101828] mb-4">Quick links</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/dashboard/users"
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-green-200/60 transition-all flex items-start gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-200 flex-shrink-0">
              <UserManagementIcon />
            </div>
            <div>
              <h3 className="font-semibold text-[#101828]">Users</h3>
              <p className="text-sm text-gray-500 mt-0.5">Manage admins, mentors, and mentees</p>
            </div>
          </Link>
          <Link
            href="/dashboard/calls/admin"
            className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm hover:shadow-md hover:border-green-200/60 transition-all flex items-start gap-3 sm:gap-4 min-w-0"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-200 flex-shrink-0">
              <CallIcon />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-[#101828]">Mentorship calls</h3>
              <p className="text-sm text-gray-500 mt-0.5">View and manage all calls</p>
            </div>
          </Link>
          <Link
            href="/dashboard/modules"
            className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm hover:shadow-md hover:border-green-200/60 transition-all flex items-start gap-3 sm:gap-4 min-w-0"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-200 flex-shrink-0">
              <ContentManagementIcon />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-[#101828]">Modules</h3>
              <p className="text-sm text-gray-500 mt-0.5">Course content and deliverables</p>
            </div>
          </Link>
          <Link
            href="/dashboard/live-sessions"
            className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm hover:shadow-md hover:border-green-200/60 transition-all flex items-start gap-3 sm:gap-4 min-w-0"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-200 flex-shrink-0">
              <LiveSessionIcon />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-[#101828]">Live sessions</h3>
              <p className="text-sm text-gray-500 mt-0.5">Schedule and manage live sessions</p>
            </div>
          </Link>
          <Link
            href="/dashboard/pending-requests"
            className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm hover:shadow-md hover:border-green-200/60 transition-all flex items-start gap-3 sm:gap-4 min-w-0"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 flex-shrink-0">
              <PendingRequestIcon />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-[#101828]">Pending requests</h3>
              <p className="text-sm text-gray-500 mt-0.5">Review sign-up and access requests</p>
            </div>
          </Link>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-[#101828] mb-4">Stay on top of</h2>

        <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
          <ReminderCard
            title="Program Schedule"
            description="Set or adjust cohort dates and how modules map to the program calendar."
            href="/dashboard/program-schedule"
            linkLabel="Open Program Schedule"
            icon={<ScheduleIcon className="w-5 h-5" />}
          />
          <ReminderCard
            title="Notifications"
            description="Catch up on platform alerts and messages you may have missed."
            href="/dashboard/notifications"
            linkLabel="View notifications"
            icon={<NotificationIcon width={20} height={20} />}
          />
        </div>
      </section>
    </div>
  );
}
