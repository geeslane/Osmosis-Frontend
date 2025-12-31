import { CheckedIcon } from '@/assets/icons';
import React from 'react';

export default function Why() {
  return (
    <div className=" flex flex-col font-montserrat montserrat items-center justify-center py-24 px-8">
      <div className="max-w-[640px] flex flex-col gap-8 w-full ">
        <h3 className="text-green-200  text-[26px] leading-8 md:leading-14 md:text-5xl font-bold">
          Why Osmosis{' '}
        </h3>
        <div className="flex flex-col gap-3">
          <div className="flex gap-2  items-start">
            <div>
              <CheckedIcon />
            </div>
            <h3 className="text-base md:text-xl text-green-200">
              Access to a Large Number Of Real Mentors Across Industries
            </h3>
          </div>
          <div className="flex gap-2 items-start">
            <div>
              <CheckedIcon />
            </div>
            <h3 className="text-base md:text-xl text-green-200">
              Personalized Coaching Framework{' '}
            </h3>
          </div>
          <div className="flex gap-2 items-start">
            <div>
              <CheckedIcon />
            </div>
            <h3 className="text-base md:text-xl text-green-200">
              Teen-Centered, Psychologically-Safe Environment{' '}
            </h3>
          </div>
          <div className="flex gap-2 items-start">
            <div>
              <CheckedIcon />
            </div>
            <h3 className="text-base md:text-xl text-green-200">
              Affordable & Accessible via Online{' '}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
