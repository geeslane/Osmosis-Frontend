import CallRoleContent from '@/components/dashboard/calls/CallRoleContent';
import PageTitle from '@/components/PageTitle';
import { generateMetadata } from '@/utils/metadata';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = generateMetadata({
  title: 'Osmosis | Mentee',
  description:
    'Instructor-led Osmosis modules designed for deep learning through structured live sessions, real-time explanations, interactive problem-solving, and guided Q&A.',
});
export default function page() {
  return (
    <div>
      <PageTitle title="Mentee" />
      <CallRoleContent />
    </div>
  );
}
