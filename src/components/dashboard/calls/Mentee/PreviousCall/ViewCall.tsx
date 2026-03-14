'use client';

import { GoBackIcon, UserAddIcon } from '@/assets/icons';
import React from 'react';

type ViewCallProps = {
  onBack: () => void;
};

export default function ViewCall({ onBack }: ViewCallProps) {
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
              Mentor&apos;s name
            </p>
            <p className="text-base font-semibold text-[#101828]">
              Emmanuel Adegbola
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
          <div>
            <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">
              Date
            </p>
            <p className="text-sm font-medium text-[#101828]">12-10-2023</p>
          </div>
          <div>
            <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">
              Topic
            </p>
            <p className="text-sm font-medium text-[#101828]">Joy in Chaos</p>
          </div>
        </div>

        <div className="pt-2 border-t border-gray-100">
          <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider mb-1">
            Comment
          </p>
          <p className="text-sm font-medium text-[#101828]">
            Demonstrates strong active listening skills, ensuring people needs
            are fully understood before offering solutions.
          </p>
        </div>
      </div>
    </div>
  );
}
