import { LongArrowUpIcon } from '@/assets/icons';
import React from 'react';

export default function WhyJoinUs() {
  return (
    <div className="montserrat  flex px-6 gap-4 flex-col mx-auto max-w-[770px] w-full py-[120px]">
      <div className="flex w-full">
        <div className=" ">
          <LongArrowUpIcon />
        </div>
        <div className=" flex flex-col justify-between py-3">
          <h3 className="text-green-200 text-start text-[26px]  md:text-[40px] font-bold">
            Why Join Us?
          </h3>
        </div>
      </div>
      <div className="grid  grid-cols-1 md:grid-cols-2 gap-4">
        <div className="mt-8 group flex flex-col gap-3">
          <div className="group-hover:bg-green-100 bg-green-100 md:bg-[#A3A2A2] h-14 w-14 text-3xl rounded-full text-white font-semibold justify-center items-center flex">
            1
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-lg text-green-200 md:text-[#A3A2A2] group-hover:text-green-200 md:text-2xl  flex">
              Create a Lasting Legacy{' '}
            </h3>
            <p className="text-base text-green-200 md:text-[#A3A2A2] group-hover:text-green-200 md:text-xl ">
              Share your wisdom and help shape the next generation of bold,
              capable leaders. Your influence today becomes someone’s turning
              point tomorrow.
            </p>
          </div>
        </div>
        <div className="mt-8 group flex flex-col gap-3">
          <div className="group-hover:bg-green-100 bg-green-100 md:bg-[#A3A2A2] h-14 w-14 text-3xl rounded-full text-white font-semibold justify-center items-center flex">
            2
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-lg text-green-200 md:text-[#A3A2A2] group-hover:text-green-200 md:text-2xl  flex">
              Become Part of an Elite Network{' '}
            </h3>
            <p className="text-base text-green-200 md:text-[#A3A2A2] group-hover:text-green-200 md:text-xl ">
              TConnect with high-performing professionals, innovators, and
              thought leaders who share your drive for excellence and purpose.
            </p>
          </div>
        </div>
        <div className="mt-8 group flex flex-col gap-3">
          <div className="group-hover:bg-green-100 bg-green-100 md:bg-[#A3A2A2] h-14 w-14 text-3xl rounded-full text-white font-semibold justify-center items-center flex">
            3
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-lg text-green-200 md:text-[#A3A2A2] group-hover:text-green-200 md:text-2xl  flex">
              Make a Meaningful, Measurable Impact{' '}
            </h3>
            <p className="text-base text-green-200 md:text-[#A3A2A2] group-hover:text-green-200 md:text-xl ">
              Your guidance can change the trajectory of a young person’s
              life—opening doors, expanding horizons, and empowering real
              transformation.
            </p>
          </div>
        </div>
        <div className="mt-8 group flex flex-col gap-3">
          <div className="group-hover:bg-green-100 bg-green-100 md:bg-[#A3A2A2] h-14 w-14 text-3xl rounded-full text-white font-semibold justify-center items-center flex">
            4
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-lg text-green-200 md:text-[#A3A2A2] group-hover:text-green-200 md:text-2xl  flex">
              Gain Fresh, Future-Focused Perspectives{' '}
            </h3>
            <p className="text-base text-green-200 md:text-[#A3A2A2] group-hover:text-green-200 md:text-xl ">
              Engage with the emerging thinkers, creators, and leaders of
              tomorrow. Their curiosity and insight will challenge and inspire
              you in return.
            </p>
          </div>
        </div>
        <div className="mt-8 group flex flex-col gap-3">
          <div className="group-hover:bg-green-100 bg-green-100 md:bg-[#A3A2A2] h-14 w-14 text-3xl rounded-full text-white font-semibold justify-center items-center flex">
            5
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-lg text-green-200 md:text-[#A3A2A2] group-hover:text-green-200 md:text-2xl  flex">
              Visibility & Recognition{' '}
            </h3>
            <p className="text-base text-green-200 md:text-[#A3A2A2] group-hover:text-green-200 md:text-xl ">
              Mentors receive high-credibility visibility across Osmosis
              platforms, including spotlight features, interviews, events, and
              social showcases — reinforcing their personal brand as leaders who
              invest in the next generation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
