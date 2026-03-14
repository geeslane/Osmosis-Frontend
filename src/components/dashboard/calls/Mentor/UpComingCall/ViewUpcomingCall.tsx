'use client';
import { GoBackIcon, UserAddIcon } from '@/assets/icons';
import Button from '@/components/ui/button/Button';
import React from 'react';
import type { UpcomingCall } from './UpComingCallTable';

type ViewUpcomingCallProps = {
  call: UpcomingCall;
  onBack: () => void;
};

export default function ViewUpcomingCall({ call, onBack }: ViewUpcomingCallProps) {
  const dateTime = call.time ? `${call.date}, ${call.time}` : call.date;

  return (
    <div className="mt-10 space-y-6 max-w-[520px]">
      <button
        type="button"
        onClick={onBack}
        className="flex cursor-pointer items-center gap-1 text-left"
      >
        <GoBackIcon />
        <span className="text-sm text-green-200 font-medium">Back</span>
      </button>
      <h3 className="text-xl font-bold text-[#101828]">Upcoming call detail</h3>
      <div className="space-y-4 py-6 px-6 rounded-lg border-2 border-[#6CBB0180] bg-[#DCFFAD]/20">
        <div className="flex justify-between items-start gap-4">
          <div className="flex gap-2 flex-col">
            <div className="flex items-center gap-2">
              <UserAddIcon />
              <span className="text-[11px] text-green-300 font-medium uppercase tracking-wider">
                Mentee&apos;s name
              </span>
            </div>
            <p className="text-green-200 font-semibold text-lg">{call.name}</p>
          </div>
          <Button
            className="bg-green-100 text-white px-6 py-2 rounded-xl shrink-0"
            onClick={() => {
              if (call.callUrl) window.open(call.callUrl, '_blank', 'noopener,noreferrer');
            }}
          >
            Join call
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-[11px] text-[#667085] font-medium uppercase tracking-wider">Date & time</p>
            <p className="text-sm font-medium text-[#101828]">{dateTime}</p>
          </div>
          <div>
            <p className="text-[11px] text-[#667085] font-medium uppercase tracking-wider">Topic</p>
            <p className="text-sm font-medium text-[#101828]">{call.topic}</p>
          </div>
        </div>

        {call.notes && (
          <div>
            <p className="text-[11px] text-[#667085] font-medium uppercase tracking-wider mb-1">Notes</p>
            <p className="text-sm text-[#101828] whitespace-pre-wrap">{call.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
