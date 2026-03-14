import MentorshipCallsAdmin from '@/components/dashboard/calls/Admin/MentorshipCallsAdmin';
import PageTitle from '@/components/PageTitle';
import { generateMetadata } from '@/utils/metadata';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = generateMetadata({
  title: 'Osmosis | All Mentor–Mentee Calls',
  description:
    'View all calls between mentors and mentees across the platform.',
});

export default function AdminCallsPage() {
  return (
    <div>
      <PageTitle title="All Mentor–Mentee Calls" />
      <MentorshipCallsAdmin />
    </div>
  );
}
