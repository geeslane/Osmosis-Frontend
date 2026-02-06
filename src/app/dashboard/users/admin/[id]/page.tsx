import AdminDetail from '@/components/dashboard/users/Admin/AdminDetail';
import { generateMetadata } from '@/utils/metadata';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = generateMetadata({
  title: 'Osmosis | Users',
  description: 'Manage users within the Osmosis platform.',
});
export default function Page() {
  return (
    <div className="max-w-[745px] mt-[37px]">
      <AdminDetail />
    </div>
  );
}
