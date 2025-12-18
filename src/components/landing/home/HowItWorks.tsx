import {
  ExpertIcon,
  LongArrowIcon,
  OneToOneIcon,
  PeersIcon,
  PlayBookIcon,
} from '@/assets/icons';
import React from 'react';

export default function HowItWorks() {
  return (
    <div className="w-full font-montserrat montserrat grid grid-cols-1 lg:grid-cols-3 gap-3 py-12 md:py-20 px-4 md:px-8 lg:px-[84px]">
      <div className="flex flex-col gap-8">
        <div>
          <span className="uppercase bg-[#94FF92] rounded-full text-green-200 px-10 py-2 font-medium">
            How it works
          </span>
        </div>
        <h3 className="text-green-200 lg:max-w-[341px]  text-[26px] leading-8 md:leading-14 md:text-5xl font-bold">
          Your Teen&#39;s 3-Month Transformation Journey{' '}
        </h3>
        <h2 className="font-semibold text-lg md:text-2xl ">
          The Osmosis Toolkit
          <span className="flex items-center gap-2">
            Includes:
            <span className="mt-1">
              <LongArrowIcon />
            </span>
          </span>
        </h2>
      </div>
      <div className="lg:ml-10 h-full flex flex-col justify-between ">
        <div className=" py-4   flex flex-col gap-3 cursor-pointer">
          <OneToOneIcon
            className="
            transition-all duration-300
            text-green-100 "
          />
          <div
            className="text-green-200  
           transition-colors"
          >
            <h3 className="text-lg md:text-2xl font-semibold">
              1-on-1 Mentorship:
            </h3>
            <h3 className="md:text-lg leading-8">
              Personalized sessions with a variety of experienced mentors from
              different industries.
            </h3>
          </div>
        </div>
        <div className=" py-4 group flex flex-col gap-3 cursor-pointer">
          <PeersIcon
            className="
            text-green-100 
            transition-all duration-300
            group-hover:text-green-100 "
          />
          <div
            className="text-green-200  
          group-hover:text-green-200 transition-colors"
          >
            <h3 className="text-lg md:text-2xl font-semibold">
              Peer Mastermind Groups:{' '}
            </h3>
            <h3 className="md:text-lg leading-8">
              A supportive community of driven peers to grow with.
            </h3>
          </div>
        </div>
      </div>
      <div className=" h-full flex flex-col justify-between ">
        <div className=" py-4 group flex flex-col gap-3 cursor-pointer">
          <ExpertIcon
            className="
            text-green-100 
            transition-all duration-300
            group-hover:text-green-100 "
          />
          <div
            className="text-green-200  
          group-hover:text-green-200 transition-colors"
          >
            <h3 className="text-lg md:text-2xl font-semibold">
              Expert-Led Masterclasses:
            </h3>
            <h3 className="md:text-lg leading-8">
              Engaging workshops on the life skills school doesn&#39;t teach.
            </h3>
          </div>
        </div>
        <div className=" py-4   flex flex-col gap-3 cursor-pointer">
          <PlayBookIcon
            className="
            text-green-100 
            transition-all duration-300
            group-hover:text-green-100 "
          />
          <div
            className="text-green-200  
          group-hover:text-green-200 transition-colors"
          >
            <h3 className="text-lg md:text-2xl font-semibold">
              The Osmosis Playbook™:{' '}
            </h3>
            <h3 className="md:text-lg leading-8">
              Their personal, physical guide to document their entire journey.{' '}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
