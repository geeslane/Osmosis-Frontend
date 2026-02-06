import PageTitle from '@/components/PageTitle';
import { generateMetadata } from '@/utils/metadata';
import { Metadata } from 'next';
import React from 'react';
import UsersTabs from '@/components/dashboard/users/UsersTabs';

export const metadata: Metadata = generateMetadata({
  title: 'Osmosis | Users',
  description:
    'Manage users within the Osmosis platform.',
});

export default function page() {
  return (
    <div>
      <PageTitle title="Users" />
      <UsersTabs />
    </div>
  );
}
