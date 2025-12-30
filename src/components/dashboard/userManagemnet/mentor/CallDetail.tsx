import React from 'react';
import { Printer, StarIcon, UserAddIcon } from '@/assets/icons';

type CallHistoryRow = {
  id: string;
  menteeName: string;
  date: string;
  topic: string;
  callLength: string;
  comment: string;
  rating: number;
};

export default function CallDetail({
  call,
  onBack,
}: {
  call: CallHistoryRow | null;
  onBack: () => void;
}) {
  if (!call) {
    return (
      <div className="">
        <div className="flex items-center justify-between">
          <h3 className="text-green-200 text-2xl font-bold">Call Details</h3>
          <button
            onClick={onBack}
            className="text-sm text-green-300 px-3 py-2 bg-[#DCFFAD91] rounded-md"
          >
            Back{' '}
          </button>
        </div>
        <p className="text-sm text-[#667085] mt-4">No call selected.</p>
      </div>
    );
  }

  return (
    <div className=" max-w-[650px] w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-green-200 text-3xl font-bold">Call Detail</h3>
        <button
          onClick={onBack}
          className=" text-green-200 flex items-center  font-medium px-8 py-4 gap-2 bg-[#DCFFAD91] rounded-md"
        >
          <Printer />
          Print Call History{' '}
        </button>
      </div>
      <div className="space-y-4 mt-4 py-8 rounded-md border-2 px-[64px]  border-[#6CBB0180] ">
        <div className="flex flex-col gap-20">
          <div className="flex gap-2 flex-col">
            <UserAddIcon />
            <p className="text-green-300 text-sm font-medium">Mentees Name</p>
            <p className="text-green-200 font-medium ">{call.menteeName}</p>
          </div>

          <div className="flex gap-12">
            <div className="flex flex-col gap-4">
              <p className="text-green-300 text-sm font-medium">Date</p>
              <p className="text-green-200 font-medium">{call.date}</p>
            </div>

            <div className="flex flex-col gap-4">
              <p className="text-green-300 text-sm font-medium">Topic</p>
              <p className="text-green-200 font-medium">{call.topic}</p>
            </div>

            <div className="flex flex-col gap-4">
              <p className="text-green-300 text-sm font-medium">Call Length</p>
              <p className="text-green-200 font-medium">{call.callLength}</p>
            </div>
          </div>

          <div className="md:col-span-2 space-y-4">
            <p className="text-green-300 text-sm font-medium">Comment</p>
            <p className="text-green-200 font-medium">{call.comment}</p>
          </div>

          <div className="flex gap-4 items-center">
            <p className="text-green-300 text-sm font-medium">Rating</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon
                    key={i}
                    fill={i < call.rating ? '#F59E0B' : '#E5E7EB'}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
