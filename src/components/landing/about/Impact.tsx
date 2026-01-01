import { LongArrowUpIcon } from '@/assets/icons';
import React from 'react';

export default function Impact() {
  return (
    <div className="montserrat  flex px-8 gap-4 flex-col mx-auto max-w-[880px] w-full py-[120px]">
      <div className="flex gap-6 w-full">
        <div className=" ">
          <LongArrowUpIcon />
        </div>
        <div className="flex flex-col  h-full items-start justify-between py-3">
          <h3 className="text-green-200  text-start text-[26px]  md:text-[40px] font-bold">
            Impact{' '}
          </h3>
          <p className="text-green-200 font-semibold md:text-2xl ">
            Here’s what you can expect.
          </p>
        </div>
      </div>
      <div className="grid  grid-cols-1  md:grid-cols-2 gap-4 md:gap-14">
        <div className="mt-8  flex flex-col gap-3">
          <div className=" bg-green-100 m h-14 w-14 text-3xl rounded-full text-white font-semibold justify-center items-center flex">
            1
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-lg text-green-200   md:text-2xl  flex">
              Radical Increase in Self-Confidence & Resilience:
            </h3>
            <p className="text-base leading-8 text-green-200  md:text-xl ">
              Teens will develop a core belief in their ability to handle
              challenges and navigate new situations.
            </p>
          </div>
        </div>
        <div className="mt-8  flex flex-col gap-3">
          <div className=" bg-green-100  h-14 w-14 text-3xl rounded-full text-white font-semibold justify-center items-center flex">
            2
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold  text-lg text-green-200  md:text-2xl  flex">
              Enhanced Critical Thinking & Decision Quality:{' '}
            </h3>
            <p className="text-base leading-8 text-green-200  md:text-xl ">
              The ability to pause, analyze, and make choices aligned with their
              personal values and long-term goals.
            </p>
          </div>
        </div>
        <div className="mt-8 group flex flex-col gap-3">
          <div className=" bg-green-100 h-14 w-14 text-3xl rounded-full text-white font-semibold justify-center items-center flex">
            3
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-lg text-green-200  md:text-2xl  flex">
              A Clear & Actionable Personal Growth Plan:{' '}
            </h3>
            <p className="text-base leading-8 text-green-200  md:text-xl ">
              A tangible document outlining their 1-year and 5-year goals,
              including academic, personal, and career milestones.
            </p>
          </div>
        </div>
        <div className="mt-8 group flex flex-col gap-3">
          <div className=" bg-green-100  h-14 w-14 text-3xl rounded-full text-white font-semibold justify-center items-center flex">
            4
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-lg text-green-200  md:text-2xl  flex">
              Improved Communication & Emotional Intelligence:{' '}
            </h3>
            <p className="text-base leading-8 text-green-200  md:text-xl ">
              Greater ability to articulate their needs, listen to others, and
              manage their emotional responses
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
