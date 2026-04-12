import React from 'react';
import { Printer, StarIcon, UserAddIcon } from '@/assets/icons';

type CallHistoryRow = {
  id: string;
  menteeName: string;
  date: string;
  time?: string;
  topic: string;
  callLength: string;
  comment: string;
  rating: number;
};

export default function CallDetail({
  call,
  onBack,
  counterpartyLabel = 'Mentee name',
}: {
  call: CallHistoryRow | null;
  onBack: () => void;
  counterpartyLabel?: string;
}) {
  if (!call) {
    return (
      <div className="max-w-[520px]">
        <div className="flex items-center justify-between">
          <h3 className="text-green-200 text-lg font-bold">Call Details</h3>
          <button
            onClick={onBack}
            className="text-xs text-green-300 px-2.5 py-1.5 bg-[#DCFFAD91] rounded-md hover:bg-[#DCFFAD]/60"
          >
            Back
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-3">No call selected.</p>
      </div>
    );
  }

  const dateTime = call.time ? `${call.date}, ${call.time}` : call.date;

  return (
    <div className="max-w-[520px] w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="text-xs text-green-300 px-2.5 py-1.5 bg-[#DCFFAD91] rounded-md hover:bg-[#DCFFAD]/60"
          >
            Back
          </button>
          <h3 className="text-green-200 text-lg font-bold">Call Details</h3>
        </div>
        <button
          type="button"
          className="flex items-center text-sm font-medium px-4 py-2 gap-1.5 bg-green-50 text-green-200 rounded-lg hover:bg-green-100/80 transition-colors"
        >
          <Printer />
          Print
        </button>
      </div>
      <div className="rounded-xl border border-green-200/60 bg-white p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex gap-2 items-center">
          <div className="shrink-0 scale-[0.8] origin-left">
            <UserAddIcon />
          </div>
          <div>
            <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">
              {counterpartyLabel}
            </p>
            <p className="text-sm font-semibold text-[#101828]">{call.menteeName}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">
              Date & Time
            </p>
            <p className="text-sm font-medium text-[#101828]">{dateTime}</p>
          </div>
          <div>
            <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">
              Topic
            </p>
            <p className="text-sm font-medium text-[#101828]">{call.topic}</p>
          </div>
          <div>
            <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">
              Duration
            </p>
            <p className="text-sm font-medium text-[#101828]">{call.callLength}</p>
          </div>
        </div>

        <div>
          <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider mb-0.5">
            Comment
          </p>
          <p className="text-sm font-medium text-[#101828]">{call.comment}</p>
        </div>

        <div className="flex gap-3 items-center">
          <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">
            Rating
          </p>
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon
                key={i}
                fill={i < call.rating ? '#F59E0B' : '#E5E7EB'}
              />
            ))}
            <span className="ml-1.5 text-xs text-gray-500">{call.rating}/5</span>
          </div>
        </div>
      </div>
    </div>
  );
}
