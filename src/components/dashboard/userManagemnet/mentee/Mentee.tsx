'use client';

import { GoBackIcon } from '@/assets/icons';
import Empty from '@/components/ui/NotFound/Empty';
import React from 'react';
import { data } from '@/utils/data';
import { useSearchParams, useRouter } from 'next/navigation';
import MenteeTable from './MenteeTable';
import MenteeDetail from './MenteeDetail';

export default function Mentee() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const view = searchParams.get('viewmentee') || 'listmentee';
  const selectedId = searchParams.get('id');
  const menteeData = data || [];
  const selectedMentee = selectedId
    ? menteeData.find((a) => a.id === selectedId)
    : null;

  const setParam = (newView: string, id?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('viewmentee', newView);
    if (id) params.set('id', id);
    else params.delete('id');
    router.replace(`?${params.toString()}`);
  };

  const handleBack = () => setParam('listmentee');

  return (
    <div className=" w-full max-w-[1092px]">
      {view === 'addmentee' && (
        <div className="max-w-[745px]">
          <div className="flex flex-col gap-8 py-4">
            <div
              onClick={handleBack}
              className="flex  w-20  cursor-pointer  items-center gap-1"
            >
              <GoBackIcon />
              <h3 className="text-sm text-green-200 font-medium">Back</h3>
            </div>
            <h3 className="text-green-200 text-2xl font-bold">Add Mentor</h3>
            <div className="rounded-md border px-4 md:px-[64px] border-green-400 py-5 w-full">
              Add Mentor Incoming Design
            </div>
          </div>
        </div>
      )}

      {view === 'viewmentee' && selectedMentee && (
        <div className="w-full ">
          <div className="flex flex-col gap-8 py-4">
            <div
              onClick={handleBack}
              className="flex cursor-pointer w-20  items-center gap-1"
            >
              <GoBackIcon />
              <h3 className="text-sm text-green-200 font-medium">Back</h3>
            </div>
            <MenteeDetail selectedMentee={selectedMentee} />
          </div>
        </div>
      )}

      {view === 'listmentee' && (
        <div className="rounded-md border border-green-400 py-5">
          <div className="flex justify-between px-6 items-center">
            <div className="flex items-center gap-2 text-green-200 text-2xl font-semibold">
              Mentees List
              <span className="bg-[#DCFFAD91] w-[24px] h-[24px] flex justify-center items-center rounded-full text-green-100 text-xs">
                {menteeData.length}
              </span>
            </div>
          </div>

          {menteeData.length === 0 ? (
            <div className="max-w-[400px] mx-auto my-[65px]">
              <Empty
                title="No Mentor for now."
                description="Check Back Later"
              />
            </div>
          ) : (
            <MenteeTable
              data={menteeData}
              onAddAdmin={() => setParam('addmentee')}
              onViewMentee={(mentee) => setParam('viewmentee', mentee.id)}
            />
          )}
        </div>
      )}
    </div>
  );
}
