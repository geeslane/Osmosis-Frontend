import Detail from '@/components/dashboard/users/mentee/Detail';
import { generateMetadata } from '@/utils/metadata';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = generateMetadata({
  title: 'Osmosis | Users',
  description: 'Manage users within the Osmosis platform.',
});

export default function page() {
  return (
    <div className="mt-[37px]">
      <Detail />
    </div>
  );
}
