'use client';

import { GoBackIcon } from '@/assets/icons';
import Empty from '@/components/ui/NotFound/Empty';
import React from 'react';
import { data } from '@/utils/data';
import { useSearchParams, useRouter } from 'next/navigation';
import MentorTable from './MentorTable';
import MentorDetail from '@/components/common/Details/MentorDetails';
import Button from '@/components/ui/button/Button';

export default function Mentor() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const view = searchParams.get('viewmentor') || 'listmentor';
  const selectedId = searchParams.get('id');
  const selectedMentor = selectedId
    ? data.find((a) => a.id === selectedId)
    : null;

  const setParam = (newView: string, id?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('viewmentor', newView);
    if (id) params.set('id', id);
    else params.delete('id');
    router.replace(`?${params.toString()}`);
  };

  const handleBack = () => setParam('listmentor');

  return (
    <div className=" w-full max-w-full">
      {view === 'addmentor' && (
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

      {view === 'viewmentor' && selectedMentor && (
        <div className="w-full ">
          <div className="flex flex-col gap-8 py-4">
            <div
              onClick={handleBack}
              className="flex cursor-pointer w-20  items-center gap-1"
            >
              <GoBackIcon />
              <h3 className="text-sm text-green-200 font-medium">Back</h3>
            </div>
            <MentorDetail selectedDetails={selectedMentor} />
            <div className="rounded-lg flex max-w-[506px] flex-col  gap-4 border border-[#6CBB0180] px-8  py-8 ">
              <h3 className="text-green-300 font-medium">Request</h3>
              <div className="flex flex-row gap-4">
                <Button className="bg-green-200 text-white font-semibold  px-8 py-2 flex items-center gap-1 rounded-xl">
                  Accept
                </Button>
                <Button className="bg-red-100 text-white font-semibold  px-8 py-2 flex items-center gap-1 rounded-xl">
                  Decline
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {view === 'listmentor' && (
        <div className="rounded-md border border-green-400 py-5">
          <div className="flex justify-between px-6 items-center">
            <div className="flex items-center gap-2 text-green-200 text-2xl font-semibold">
              Pending Mentors List
              <span className="bg-[#DCFFAD91] w-[24px] h-[24px] flex justify-center items-center rounded-full text-green-100 text-xs">
                {data.length}
              </span>
            </div>
          </div>

          {data.length === 0 ? (
            <div className="max-w-[400px] mx-auto my-[65px]">
              <Empty
                title="No Mentor for now."
                description="Check Back Later"
              />
            </div>
          ) : (
            <MentorTable
              data={data}
              onAddAdmin={() => setParam('addmentor')}
              onViewAdmin={(admin) => setParam('viewmentor', admin.id)}
            />
          )}
        </div>
      )}
    </div>
  );
}
