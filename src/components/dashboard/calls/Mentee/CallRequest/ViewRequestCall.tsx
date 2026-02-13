import { GoBackIcon, Printer, UserAddIcon } from '@/assets/icons';
import Button from '@/components/ui/button/Button';
import React from 'react';

export default function ViewRequestCall() {
  return (
    <div className="mt-10 space-y-[37px] max-w-[650px]">
      <div className="flex cursor-pointer items-center gap-1">
        <GoBackIcon />
        <h3 className="text-sm text-green-200 font-medium">Back</h3>
      </div>
      <div className="flex items-center justify-between">
        <h3 className="text-[32px] font-bold">Call Requests</h3>
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
          <div className="space-y-4">
            <h3 className="text-green-200 font-semibold text-2xl">
              Reason for rejection
            </h3>
            <h2>Give reason for rejection</h2>
            <input
              placeholder="Type your comment here."
              className="rounded-lg border text-[#ACACAC] focus:outline-none h-[38px] px-2 border-green-200 w-full"
            />
            <div className='flex justify-end '>
              <Button className="bg-green-200 text-white px-8 py-2 rounded-xl">
                Continue
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
