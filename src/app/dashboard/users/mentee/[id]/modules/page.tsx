import MenteeModulesList from '@/components/dashboard/users/mentee/MenteeModulesList';
import { generateMetadata } from '@/utils/metadata';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = generateMetadata({
  title: 'Osmosis | Mentee Module Progress',
  description: 'View mentee module progress and assignments.',
});

export default function MenteeModulesPage() {
  return (
    <div className="mt-[37px]">
      <MenteeModulesList />
    </div>
  );
}
