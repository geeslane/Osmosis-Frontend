import { GoBackIcon, Printer, UserAddIcon } from '@/assets/icons';
import React from 'react';

export default function ViewUpcomingCall() {
  return (
    <div className="mt-10 space-y-[37px] max-w-[650px]">
      <div className="flex cursor-pointer items-center gap-1">
        <GoBackIcon />
        <h3 className="text-sm text-green-200 font-medium">Back</h3>
      </div>
      <div className="flex items-center justify-between">
        <h3 className="text-[32px] font-bold">Previous Call Detail</h3>
        <button className=" text-green-200 flex items-center  font-medium px-8 py-4 gap-2 bg-[#DCFFAD91] rounded-md">
          <Printer />
          Print Call History{' '}
        </button>
      </div>
      <div className="space-y-4 mt-4 py-8 rounded-md border-2 px-[64px]  border-[#6CBB0180] ">
        <div className="flex flex-col gap-20">
          <div className="flex gap-2 flex-col">
            <UserAddIcon />
            <p className="text-green-300 text-sm font-medium">Mentees Name</p>
            <p className="text-green-200 font-semibold text-2xl ">
              Emmanuel Adegbola
            </p>
          </div>

          <div className="flex gap-12">
            <div className="flex flex-col gap-4">
              <p className="text-green-300 text-sm font-medium">Date</p>
              <p className="text-green-200 font-medium">12-10-2023</p>
            </div>

            <div className="flex flex-col gap-4">
              <p className="text-green-300 text-sm font-medium">Topic</p>
              <p className="text-green-200 font-medium">Joy in Chaos</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
