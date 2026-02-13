import { PhoneIcon, RateUserIcon } from '@/assets/icons';
import Button from '@/components/ui/button/Button';
import SpeedGauge from '@/components/ui/Progress/SpeedGuage';
import React from 'react';

export default function Teenager() {
  const progress = 20;
  return (
    <div className="flex justify-between pt-[56px] items-center">
      <div className="">
        <div className="w-full flex items-center gap-2">
          <div className="bg-green-100 w-3 h-3 rounded-sm"></div>
          <h3 className="text-green-200 text-xs font-medium">Performance</h3>
        </div>
        <div className="flex items-center">
          <SpeedGauge value={70} />
          <div className="space-y-2 min-w-[160px]">
            <div className="flex justify-between items-center">
              <p className="text-sm text-[#1C1D1D] font-semibold">
                Deliverables
              </p>
              <h3 className="text-green-100 font-medium text-[10px]">
                {progress}/16 <span className="text-green-300">class</span>
              </h3>
            </div>
            <div className="h-2 w-full rounded-full bg-lime-100">
              <div
                className="h-2 rounded-full bg-lime-600 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
        <h3 className="text-green-200 text-sm font-medium ml-2 -mt-5">
          Module:<span className="font-semibold text-lg">12 of 16</span>
        </h3>
      </div>
      <div className="space-y-4 z-99">
        <Button
          leftIcon={<PhoneIcon color="#fff" />}
          className="bg-green-100 text-white font-semibold  px-8 py-5 flex items-center gap-1 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Schedule a Call
        </Button>
        <Button
          leftIcon={<RateUserIcon />}
          className="bg-green-200 text-white font-semibold  px-8 py-5 flex items-center gap-1 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Schedule a Call
        </Button>
      </div>
    </div>
  );
}
