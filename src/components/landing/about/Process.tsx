import {
  ExpertIcon,
  LongArrowIcon,
  OneToOneIcon,
  PeersIcon,
} from '@/assets/icons';
import React from 'react';

export default function Process() {
  return (
    <div className="montserrat px-6 flex gap-8 flex-col mx-auto max-w-[1070px] w-full py-[120px]">
      <div className="flex flex-col gap-4">
        <p className="text-green-200 text-start text-[26px]  md:text-[40px] font-bold">
          Our Coaching Process
        </p>
        <p className="md:text-2xl  text-green-200 font-semibold ">
          The tools and environment for transformation.
        </p>
        <div className="">
          <LongArrowIcon />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
        <div className=" py-4  group flex h-full flex-col gap-3 cursor-pointer">
          <OneToOneIcon
            className="
                          text-green-100 
                          transition-all duration-300
                          group-hover:text-green-100 "
          />
          <div
            className="text-green-200 flex gap-2 flex-col 
                        group-hover:text-green-200 transition-colors"
          >
            <h3 className="text-lg md:text-2xl font-semibold">
              1-on-1 Mentorship:
            </h3>
            <h3 className="md:text-lg">
              Each teen is able to book a session with a certified mentor for
              personalized guidance, accountability, and a safe space to explore
              their biggest questions.
            </h3>
          </div>
        </div>

        <div className=" py-4 group flex h-full flex-col gap-3 cursor-pointer">
          <ExpertIcon
            className="
                          text-green-100 
                          transition-all duration-300
                          group-hover:text-green-100 "
          />
          <div
            className="text-green-200  flex gap-2 flex-col
                        group-hover:text-green-200 transition-colors"
          >
            <h3 className="text-lg md:text-2xl font-semibold">
              Expert-Led Masterclasses:
            </h3>
            <h3 className="md:text-lg">
              Weekly deep-dive workshops on crucial topics like habit formation,
              financial literacy, effective communication, and emotional
              resilience, led by industry experts.{' '}
            </h3>
          </div>
        </div>

        <div className=" py-4 group flex h-full flex-col gap-3 cursor-pointer">
          <PeersIcon
            className="
                          text-green-100 
                          transition-all duration-300
                          group-hover:text-green-100 "
          />
          <div
            className="text-green-200 -mt-2 flex gap-2 flex-col
                        group-hover:text-green-200 transition-colors"
          >
            <h3 className="text-lg md:text-2xl font-semibold">
              Peer Mastermind Groups:{' '}
            </h3>
            <h3 className="md:text-lg ">
              Weekly deep-dive workshops on crucial topics like habit formation,
              financial literacy, effective communication, and emotional
              resilience, led by industry experts.{' '}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
