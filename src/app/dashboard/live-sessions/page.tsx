import { LiveSessionIcon } from '@/assets/icons';
import Live from '@/components/dashboard/live-sessions/Live';
import PageTitle from '@/components/PageTitle';
import { generateMetadata } from '@/utils/metadata';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = generateMetadata({
  title: 'Osmosis | Live Sessions',
  description:
    'Live-Sessions, instructor-led Osmosis session focused on deep understanding through real-time explanations, interactive problem solving, and guided Q&A.',
});

export default function page() {
  return (
    <div>
      <PageTitle title="Live Sessions" />
      <div className="border-b-2 w-[141px] flex gap-2 items-center pb-3 border-green-100">
        <LiveSessionIcon className="text-green-100" />
        <h3 className="text-green-300 font-medium">Live Sessions</h3>
      </div>
      <Live />
    </div>
  );
}
