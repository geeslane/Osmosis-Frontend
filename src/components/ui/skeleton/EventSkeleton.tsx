import React from 'react';
import Skeleton from './Skeleton';

export default function EventSkeleton() {
  return (
    <div className="flex items-start gap-4 p-4 border rounded-md shadow-sm w-full ">
      <Skeleton width="w-20" height="h-20" rounded="rounded-md" />
      <div className="flex-1 space-y-2">
        <Skeleton width="w-3/4" height="h-5" rounded="rounded-sm" />
        <div className="flex justify-between">
          <div className=" w-full flex flex-col gap-1">
            <Skeleton width="w-1/2" height="h-4" />
            <Skeleton width="w-2/3" height="h-4" />
          </div>
          <Skeleton width="w-16" height="h-4" />
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="flex gap-4">
            <Skeleton width="w-12" height="h-4" />
            <Skeleton width="w-12" height="h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
