import BookACallGuard from '@/components/dashboard/schedule/mentee/BookACallGuard';
import PageTitle from '@/components/PageTitle';
import { generateMetadata } from '@/utils/metadata';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = generateMetadata({
  title: 'Osmosis | Book a call',
  description:
    'Book a call with a mentor. Choose a topic, pick a mentor, and select a time that works for you.',
});

export default function page() {
  return (
    <div>
      <PageTitle title="Book a call" />
      <BookACallGuard />
    </div>
  );
}
