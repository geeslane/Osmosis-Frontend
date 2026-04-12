'use client';

import { GoBackIcon, UserAddIcon } from '@/assets/icons';
import type { PreviousCallRow } from '@/utils/mapCallApi';
import React from 'react';

function show(s: string | undefined | null) {
  const t = s?.trim();
  return t ? t : '—';
}

type ViewCallProps = {
  call: PreviousCallRow;
  onBack: () => void;
};

export default function ViewCall({ call, onBack }: ViewCallProps) {
  const dateTime = call.time ? `${call.date}, ${call.time}` : call.date;

  return (
    <div className="mt-10 max-w-[520px]">
      <button
        type="button"
        onClick={onBack}
        className="flex cursor-pointer items-center gap-2 text-green-200 font-medium hover:opacity-80 transition-opacity mb-6"
      >
        <GoBackIcon />
        <span className="text-sm">Back</span>
      </button>

      <h2 className="text-xl font-bold text-[#101828] mb-4">
        Previous call detail
      </h2>

      <div className="rounded-xl border border-green-200/60 bg-white p-5 shadow-sm space-y-5">
        <div className="flex gap-2 items-center">
          <div className="shrink-0 text-green-300">
            <UserAddIcon />
          </div>
          <div>
            <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">
              Mentee&apos;s name
            </p>
            <p className="text-base font-semibold text-[#101828]">{show(call.name)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
          <div>
            <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">
              Date
            </p>
            <p className="text-sm font-medium text-[#101828]">{show(dateTime)}</p>
          </div>
          <div>
            <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">
              Topic
            </p>
            <p className="text-sm font-medium text-[#101828]">{show(call.topic)}</p>
          </div>
        </div>

        <div className="pt-2 border-t border-gray-100">
          <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider mb-1">
            Mentee feedback
          </p>
          <p className="text-sm font-medium text-[#101828]">
            Rating:{' '}
            {call.rating != null && call.rating >= 1 && call.rating <= 5
              ? `${call.rating}/5`
              : '—'}
          </p>
          <p className="text-sm font-medium text-[#101828] mt-2">
            {show(call.menteeComment)}
          </p>
        </div>

        {call.menteeNotes ? (
          <div className="pt-2 border-t border-gray-100">
            <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider mb-1">
              Message when booking
            </p>
            <p className="text-sm font-medium text-[#101828]">{show(call.menteeNotes)}</p>
          </div>
        ) : null}

        {(call.mentorComment || call.mentorPrivateNotes) && (
          <div className="pt-2 border-t border-gray-100 space-y-3">
            {call.mentorComment ? (
              <div>
                <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider mb-1">
                  Your feedback (shared)
                </p>
                <p className="text-sm font-medium text-[#101828]">{show(call.mentorComment)}</p>
              </div>
            ) : null}
            {call.mentorPrivateNotes ? (
              <div>
                <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider mb-1">
                  Private notes
                </p>
                <p className="text-sm font-medium text-[#101828]">{show(call.mentorPrivateNotes)}</p>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
