import CreateSchedule from '@/components/dashboard/schedule/mentee/CreateSchecdule';
import PageTitle from '@/components/PageTitle';
import { generateMetadata } from '@/utils/metadata';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = generateMetadata({
  title: 'Osmosis | Schedule',
  description:
    'Plan, view, and manage your upcoming events, meetings, and activities within the Osmosis schedule.',
});

export default function page() {
  return (
    <div>
      <PageTitle title="Schedule" />
      <CreateSchedule />
    </div>
  );
}
