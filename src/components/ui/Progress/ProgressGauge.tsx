import { SmileIcon } from '@/assets/icons';
import React from 'react';

type ProgressGaugeProps = {
  percentage: number;
};

export default function ProgressGauge({ percentage }: ProgressGaugeProps) {
  const pct = Math.min(Math.max(Math.round(percentage), 0), 100);

  return (
    <div className="flex w-full  flex-col ">
      {/* Header */}
      <div className="flex justify-center items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#DCFFAD91]">
          <span className="text-xl">
            <SmileIcon />
          </span>
        </div>
        <h2 className="text-lg font-semibold text-gray-900">Progress</h2>
      </div>

      {/* Gauge (SVG semicircle) */}
      <div className="relative h-[125px] w-full flex items-center justify-center">
        <svg
          width="175"
          height="175"
          viewBox="0 0 220 120"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20,100 A90,90 0 0 1 200,100"
            stroke="#DCFFAD91"
            strokeWidth="28"
            fill="none"
            strokeLinecap="inherit"
          />

          {/* foreground semicircle (progress) */}
          <path
            d="M20,100 A90,90 0 0 1 200,100"
            stroke="#6CBB01"
            strokeWidth="38"
            fill="none"
            strokeLinecap="inherit"
            pathLength="100"
            strokeDasharray={`${pct} ${100 - pct}`}
          />
        </svg>

        {/* Center text */}
        <div className="absolute bottom-8  flex flex-col items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-semibold text-green-300">
              {pct}%
            </span>
            {/*  <GuageFile /> */}
          </div>
        </div>
      </div>

      {/* Footer 
      <div className="-mt-4 relative text-center w-full">
        <p className="text-2xl font-semibold text-green-300 inline-flex items-center justify-center">
          Week {currentWeek}
        </p>
        <div className="mx-auto mt-2 h-[1px] w-20 bg-[#DCFFAD91]" />
        <p className="text-xs font-medium text-green-300 mt-2">of {totalWeeks} Weeks</p>
      </div> */}
    </div>
  );
}
