'use client';
import { mentors } from '@/utils/data';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

export default function LookLike() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % mentors.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="lg:-mt-40 lg:mb-40 flex md:max-w-[1233px] md:mx-auto gap-12 montserrat px-2 md:px-10 items-center lg:px-[90px]">
      <div className="md:flex-1/3 lg:flex hidden mr-10">
        <div className="relative hidden md:flex items-center">
          <div className="bg-white flex flex-col gap-6 border-[#68624E] p-4 border-2 w-[301px] ml-6 absolute h-[695px] rounded-[40px] overflow-hidden">
            <div
              className="transition-all duration-700 ease-in-out"
              style={{ transform: `translateY(-${index * 30}%)` }}
            >
              {mentors.map((m, i) => (
                <div
                  key={i}
                  className="flex justify-center items-center flex-col gap-2 py-2"
                >
                  <Image
                    src={m.image}
                    alt={m.name}
                    width={200}
                    height={100}
                    className="rounded-3xl h-full w-full"
                  />
                  <div className="flex flex-col items-center">
                    <h3 className="text-green-200 text-2xl font-bold">
                      {m.name}
                    </h3>
                    <h3 className="text-green-100 text-sm font-medium">
                      {m.role}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#CFE8AF] w-[301px] h-[550px] rounded-[40px]"></div>
        </div>
      </div>

      <div className="md:flex-2/3 gap-8 flex flex-col md:max-w-[751px] ">
        <h3 className="font-montserrat text-green-200 montserrat text-[24px] md:leading-14   md:text-[48px]   font-bold  lg:text-start text-center  ">
          What Our Mentoring Looks Like{' '}
        </h3>
        <div className="flex flex-col gap-5 md:px-0 px-4">
          <p className="text-black-200 montserrat   lg:text-start text-center  md:text-xl">
            At Osmosis, each mentor selects 2–3 topics they are passionate about
            mentoring teenagers on.
          </p>
          <p className="text-black-200 montserrat lg:text-start text-center  md:text-xl">
            After choosing their topics, mentors set up their availability by
            uploading their calendars to the Osmosis platform. This allows
            teenagers to view open time slots and schedule mentoring sessions
            only at the mentor’s preferred times.
          </p>
          <p className="text-black-200 montserrat   lg:text-start text-center  md:text-xl">
            Mentor commitment is flexible and intentionally light: just 2–4
            hours per month, depending on the topics selected, across the
            3-month mentorship cycle.
          </p>
          <p className="text-black-200 montserrat  lg:text-start text-center  md:text-xl">
            This structure ensures mentors can contribute meaningfully without
            disrupting their professional schedule.
          </p>
          <p className="text-black-200 montserrat   lg:text-start text-center  md:text-xl">
            Mentors receive structured training, onboarding, and support from
            the Osmosis team throughout the experience.
          </p>
        </div>
      </div>
    </div>
  );
}
