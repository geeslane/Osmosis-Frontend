import Image from 'next/image';
import React from 'react';

export default function LookLike() {
  return (
    <div className="lg:-mt-40 lg:mb-40 flex md:max-w-[1133px] md:mx-auto gap-12 font-montserrat montserrat  md:px-10 items-center lg:px-[100px]">
      <div className="md:flex-1/3 lg:flex hidden  ">
        <div className="relative hidden md:flex items-center">
          <div className="bg-white flex flex-col gap-6 border-[#68624E] p-4 border-2 w-[301px] ml-6 absolute h-[695px] rounded-[40px]">
            <div className="flex justify-center items-center flex-col gap-2">
              <Image
                src="/image/mentor1.jpg"
                alt=""
                width={200}
                height={100}
                className="rounded-3xl h-full w-full"
              />
              <div className="flex flex-col items-center">
                <h3 className="text-green-200 text-2xl font-bold">
                  Alex Johnson
                </h3>
                <h3 className="text-green-100 text-sm font-medium">Mentor</h3>
              </div>
            </div>
            <div className="flex justify-center items-center flex-col gap-2">
              <Image
                src="/image/mentor1.jpg"
                alt=""
                width={200}
                height={100}
                className="rounded-3xl h-full w-full"
              />
              <div className="flex flex-col items-center">
                <h3 className="text-green-200 text-2xl font-bold">
                  Alex Johnson
                </h3>
                <h3 className="text-green-100 text-sm font-medium">Mentor</h3>
              </div>
            </div>
          </div>
          <div className="bg-[#CFE8AF] w-[301px] h-[550px] rounded-[40px] "></div>
        </div>
      </div>
      <div className="md:flex-2/3 gap-4 flex flex-col md:max-w-[751px] ">
        <h3 className="font-montserrat text-green-200 montserrat text-[24px] md:leading-14   md:text-[48px]   font-bold  lg:text-start text-center  ">
          What Our Mentoring Looks Like{' '}
        </h3>
        <div className="flex flex-col gap-5">
          <p className="text-black-200 montserrat px-4  lg:text-start text-center  md:text-xl">
            At Osmosis, each mentor selects 2–3 topics they are passionate about
            mentoring teenagers on.
          </p>
          <p className="text-black-200 montserrat px-4  lg:text-start text-center  md:text-xl">
            After choosing their topics, mentors set up their availability by
            uploading their calendars to the Osmosis platform. This allows
            teenagers to view open time slots and schedule mentoring sessions
            only at the mentor’s preferred times.
          </p>
          <p className="text-black-200 montserrat px-4  lg:text-start text-center  md:text-xl">
            Mentor commitment is flexible and intentionally light: just 2–4
            hours per month, depending on the topics selected, across the
            3-month mentorship cycle.
          </p>
          <p className="text-black-200 montserrat px-4  lg:text-start text-center  md:text-xl">
            This structure ensures mentors can contribute meaningfully without
            disrupting their professional schedule.
          </p>
          <p className="text-black-200 montserrat px-4  lg:text-start text-center  md:text-xl">
            Mentors receive structured training, onboarding, and support from
            the Osmosis team throughout the experience.
          </p>
        </div>
      </div>
    </div>
  );
}
