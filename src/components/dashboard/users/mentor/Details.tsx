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
        <div className="flex flex-col gap-[37px]">
          <div
            onClick={handleBack}
            className="flex cursor-pointer w-20  items-center gap-1"
          >
            <GoBackIcon />
            <h3 className="text-sm text-green-200 font-medium">Back</h3>
          </div>
          <CallHistoryTable />
        </div>
      ) : (
        <div className="flex flex-col gap-[37px]">
          <div
            onClick={handleBack}
            className="flex cursor-pointer w-20  items-center gap-1"
          >
            <GoBackIcon />
            <h3 className="text-sm text-green-200 font-medium">Back</h3>
          </div>
          <div className="flex justify-between items-center ">
            <h3
              onClick={handleBack}
              className="text-green-200 text-3xl font-bold"
            >
              Mentee Details
            </h3>
            <button
              onClick={() => setCall(true)}
              className="font-medium flex items-center py-3 justify-center px-8 rounded-xl gap-2 bg-[#DCFFAD91]"
            >
              <h3 className="hidden font-semibold text-green-300 md:flex ">
                View Call History
              </h3>
              <PhoneIcon color={'#002825'} />
            </button>{' '}
          </div>
          <MentorDetail selectedDetails={selectedDetails} />
        </div>
      )}
    </div>
  );
}
