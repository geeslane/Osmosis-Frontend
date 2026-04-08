import MenteeModuleDetail from '@/components/dashboard/users/mentee/MenteeModuleDetail';
import { generateMetadata } from '@/utils/metadata';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = generateMetadata({
  title: 'Osmosis | Mentee Module',
  description: 'View module details and mentee assignment submission.',
});

export default function MenteeModulePage() {
  return (
    <div className="mt-[37px]">
      <MenteeModuleDetail />
    </div>
  );
}
