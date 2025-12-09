import React from 'react';
import Skeleton from './Skeleton';

export default function DashboardSkeleton() {
  return (
    <div className="flex flex-col md:flex-row gap-6 p-4 w-full">
      <div className="flex-[2] gap-2 bg-white flex justify-between rounded-md w-full shadow-sm text-white  p-6 space-y-4">
        <div className="w-full flex justify-between flex-col gap-4">
          <div className="flex-col gap-2 flex">
            <Skeleton width="w-full" height="h-6" rounded="rounded" />{' '}
            <Skeleton width="w-full" height="h-4" rounded="rounded" />{' '}
            <Skeleton width="w-full" height="h-4" rounded="rounded" />{' '}
          </div>
          <Skeleton width="w-32" height="h-10" rounded="rounded-md" />{' '}
        </div>
        <div className="flex w-full gap-3 mt-4">
          <Skeleton width="w-60" height="h-full" rounded="rounded-md" />
        </div>
      </div>

      <div className="flex-[1.2] flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((_, idx) => (
            <div
              key={idx}
              className="flex gap-2 flex-col items-start p-4 border rounded-md shadow-sm bg-white"
            >
              <div className="flex gap-2 items-center">
                <Skeleton width="w-6" height="h-6" rounded="rounded-full" />{' '}
                <Skeleton width="w-20" height="h-4" /> {/* Label */}
              </div>
              <Skeleton width="w-full" height="h-4" /> {/* Number */}
            </div>
          ))}
        </div>

        <div className="p-4 flex items-center flex-col gap-3 rounded-md bg-white border shadow-sm">
          <Skeleton width="w-3/4" height="h-5" />
          <Skeleton width="w-1/3" height="h-4" />
        </div>
      </div>
    </div>
  );
}
