import { CheckedIcon } from '@/assets/icons';
import ProgramStructureMentorGallery from '@/components/landing/ProgramStructureMentorGallery';
import React from 'react';

export default function Structure() {
  return (
    <div className="w-full max-w-[1300px] mx-auto flex flex-col justify-center items-center gap-10 lg:flex-row md:py-20 px-8 md:px-8 lg:px-16">
      <ProgramStructureMentorGallery returnFrom="about" />
      <div className="w-full flex-1 font-montserrat montserrat lg:ml-10 flex flex-col gap-6 md:gap-8">
        <h3 className="text-green-200 text-[26px] leading-8 md:leading-14 md:text-5xl font-bold">
          Program Structure
        </h3>
        <h3 className="text-green-200 md:text-xl">
          100% virtual, live sessions to foster real connection.
        </h3>
        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            <div className="w-[30px]">
              <CheckedIcon />
            </div>
            <h3 className="text-green-200 md:text-xl">
              Weekly 60-minute group workshop with industry experts
            </h3>
          </div>
          <div className="flex gap-3">
            <div className="w-[30px]">
              <CheckedIcon />
            </div>
            <h3 className="text-green-200 md:text-xl">
              Weekly 30-minute private session with a mentor
            </h3>
          </div>
          <div className="flex gap-3">
            <div className="w-[30px]">
              <CheckedIcon />
            </div>
            <h3 className="text-green-200 md:text-xl">
              Weekly 45-minute session with their peers
            </h3>
          </div>
        </div>
        <h3 className="text-green-200 md:text-xl">
          That&apos;s approximately 2.5 hours of scheduled sessions per week, plus
          time for personal reflection and weekly assignments.
        </h3>
      </div>
    </div>
  );
}
