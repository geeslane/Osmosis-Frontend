'use client';
import MentorDetail from '@/components/common/Details/MentorDetails';
import React, { useState } from 'react';
import CallHistoryTable from './CallHistory';
import { GoBackIcon, PhoneIcon } from '@/assets/icons';

export default function Details({
  selectedDetails,
  handleBack,
}: {
  selectedDetails: any;
  handleBack: () => void;
}) {
  const [call, setCall] = useState(false);
  return (
    <div>
      {call ? (
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={handleBack}
              className="flex cursor-pointer items-center gap-2 text-green-200 font-medium hover:opacity-80 transition-opacity"
            >
              <GoBackIcon />
              <span className="text-sm">Back</span>
            </button>
          </div>
          <CallHistoryTable />
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={handleBack}
              className="flex cursor-pointer items-center gap-2 text-green-200 font-medium hover:opacity-80 transition-opacity shrink-0"
            >
              <GoBackIcon />
              <span className="text-sm">Back</span>
            </button>
            <h3 className="text-green-200 text-2xl md:text-3xl font-bold">
              Mentor Details
            </h3>
            <div className="flex-1 flex justify-end">
              <button
                onClick={() => setCall(true)}
                type="button"
                className="font-medium flex items-center py-2.5 px-6 rounded-xl gap-2 bg-[#DCFFAD91] hover:opacity-90 transition-opacity"
              >
                <span className="hidden font-semibold text-green-300 md:inline">
                  View Call History
                </span>
                <PhoneIcon color="#002825" />
              </button>
            </div>
          </div>
          <MentorDetail selectedDetails={selectedDetails} />
        </div>
      )}
    </div>
  );
}
