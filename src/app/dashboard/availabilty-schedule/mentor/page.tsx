import MentorAvailabilitySchedule from '@/components/dashboard/schedule/mentor/MentorAvailabilitySchedule';
import PageTitle from '@/components/PageTitle';
import { generateMetadata } from '@/utils/metadata';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = generateMetadata({
  title: 'Osmosis | Availability Schedule',
  description:
    'Set your weekly availability, meeting link, and sync with Google Calendar for mentoring sessions.',
});

export default function MentorAvailabilityPage() {
  return (
    <div>
      <PageTitle title="Availability Schedule" />
      <MentorAvailabilitySchedule />
    </div>
  );
}
