import CallRoleContent from '@/components/dashboard/calls/Mentee/CallRoleContent';
import CallTabs from '@/components/dashboard/calls/Mentee/CallTabs';
import PageTitle from '@/components/PageTitle';
import Button from '@/components/ui/button/Button';
import { generateMetadata } from '@/utils/metadata';
import Link from 'next/link';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = generateMetadata({
  title: 'Osmosis | My calls',
  description:
    'Instructor-led Osmosis modules designed for deep learning through structured live sessions, real-time explanations, interactive problem-solving, and guided Q&A.',
});
export default function page() {
  return (
    <div>
      <PageTitle title="My calls" />
      <div className="flex flex-wrap justify-end gap-2 mb-4">
        <Link href="/dashboard/book-a-call">
          <Button className="bg-green-200 text-white px-4 py-2.5 sm:px-5 rounded-xl text-sm font-medium touch-manipulation w-full sm:w-auto">
            Book a call
          </Button>
        </Link>
      </div>
      <CallTabs />
      <CallRoleContent />
    </div>
  );
}
