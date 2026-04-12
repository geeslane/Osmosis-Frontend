'use client';
import { GoBackIcon, UserAddIcon } from '@/assets/icons';
import React from 'react';
import type { RequestCall } from './CallRequestTable';

type ViewRequestCallProps = {
  request: RequestCall;
  onBack: () => void;
};

export default function ViewRequestCall({ request, onBack }: ViewRequestCallProps) {
  const dateTime = request.time ? `${request.date}, ${request.time}` : request.date;

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
      <h3 className="text-xl font-bold text-[#101828]">Call request detail</h3>
      <div className="space-y-4 py-6 px-6 rounded-lg border-2 border-[#6CBB0180] bg-[#DCFFAD]/20">
        <div className="flex gap-2 flex-col">
          <div className="flex items-center gap-2">
            <UserAddIcon />
            <span className="text-[11px] text-green-300 font-medium uppercase tracking-wider">
              Mentor&apos;s name
            </span>
          </div>
          <p className="text-green-200 font-semibold text-lg">{request.name}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-[11px] text-[#667085] font-medium uppercase tracking-wider">Date & time</p>
            <p className="text-sm font-medium text-[#101828]">{dateTime}</p>
          </div>
          <div>
            <p className="text-[11px] text-[#667085] font-medium uppercase tracking-wider">Topic</p>
            <p className="text-sm font-medium text-[#101828]">{request.topic}</p>
          </div>
        </div>

        <div>
          <p className="text-[11px] text-[#667085] font-medium uppercase tracking-wider">Status</p>
          <span
            className={`inline-block rounded-full px-3 py-1 text-xs font-medium mt-1 ${
              request.status === 'Active'
                ? 'bg-green-50 text-green-600'
                : request.status === 'Inactive'
                  ? 'bg-red-50 text-red-600'
                  : 'bg-amber-50 text-amber-600'
            }`}
          >
            {request.status}
          </span>
        </div>

        {request.note && (
          <div>
            <p className="text-[11px] text-[#667085] font-medium uppercase tracking-wider mb-1">Your note</p>
            <p className="text-sm text-[#101828] whitespace-pre-wrap">{request.note}</p>
          </div>
        )}
      </div>
    </div>
  );
}
