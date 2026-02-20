'use client';

import { GoBackIcon } from '@/assets/icons';
import LiveSessionDetail from '@/components/dashboard/live-sessions/LiveSessionDetail';
import React from 'react';
import { useRouter } from 'next/navigation';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function Page({ params }: PageProps) {
  const { id } = React.use(params);
  const router = useRouter();

  return (
    <div className="max-w-full">
      <div className="flex flex-col gap-8 py-4">
        <div
          onClick={() => router.push('/dashboard/live-sessions')}
          className="flex cursor-pointer items-center gap-1"
        >
          <GoBackIcon />
          <h3 className="text-sm text-green-200 font-medium">Back</h3>
        </div>

        <LiveSessionDetail id={id} />
      </div>
    </div>
  );
}
