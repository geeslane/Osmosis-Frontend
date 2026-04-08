import PageTitle from '@/components/PageTitle';
import AdminCallsTable from '@/components/dashboard/calls/Admin/AdminCallsTable';
import { generateMetadata } from '@/utils/metadata';
import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = generateMetadata({
  title: 'Osmosis | Calls',
  description: 'Admin calls list.',
});

export default function page() {
  return (
    <div>
      <PageTitle title="Calls" />
      <div className="mt-6">
        <AdminCallsTable />
      </div>
    </div>
  );
}

