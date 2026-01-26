'use client';

import { GoBackIcon } from '@/assets/icons';
import AdminDetail from '@/components/dashboard/users/Admin/AdminDetail';
import React from 'react';
import { useRouter } from 'next/navigation';

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function Page({ params }: PageProps) {
  const { id } = React.use(params);
  const router = useRouter();

  return (
    <div className="max-w-[745px]">
      <div className="flex flex-col gap-8 py-4">
        <div
          onClick={() => router.push('/dashboard/users?role=admins')}
          className="flex cursor-pointer items-center gap-1"
        >
          <GoBackIcon />
          <h3 className="text-sm text-green-200 font-medium">Back</h3>
        </div>

        <AdminDetail id={id} />
      </div>
    </div>
  );
}
