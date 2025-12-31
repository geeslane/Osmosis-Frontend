import { ArrowUpIcon } from '@/assets/icons';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function Mentor() {
  return (
    <div>
      <div className="w-full font-montserrat montserrat flex flex-col justify-center items-center  gap-8 py-12 md:py-20 px-8 md:px-8 lg:px-16">
        <h3 className="text-green-200 max-w-[1000px] text-center  text-[26px] leading-8 md:leading-18 md:text-[72px] font-bold">
          Our Mentors{' '}
        </h3>
        <div>
          <p className="max-w-[754px] mx-auto text-center md:text-xl text-green-200">
            Behind every confident teen is a mentor who believes in them.Our
            mentors are skilled professionals and passionate individuals who
            guide teenagers with empathy, accountability, and experience.
          </p>
          <div className="mt-6 flex justify-center">
            <Link
              href="/mentor/signup"
              className="md:px-6 justify-center  max-w-[380px]  px-4 flex items-center gap-1 py-2  border-0 rounded-xl text-white font-semibold transition-colors bg-green-100"
            >
              Become a Mentor
              <ArrowUpIcon />
            </Link>
          </div>
          <div className="grid mt-10 lg:mx-[64px]  grid-cols-2 gap-6 md:grid-cols-4 ">
            <div className="flex flex-col gap-2 items-center justify-center w-full">
              <Image
                src={'/image/prod.jpg'}
                alt=""
                width={300}
                height={300}
                className="rounded-xl transition-all duration-700"
              />
              <div className="flex flex-col items-center">
                <h3 className="text-green-100 font-bold md:text-xl">
                  Alex Johnson
                </h3>
                <p className="text-green-200 text-sm font-medium">Mentor</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 items-center justify-center w-full">
              <Image
                src={'/image/prod.jpg'}
                alt=""
                width={300}
                height={300}
                className="rounded-xl transition-all duration-700"
              />
              <div className="flex flex-col items-center">
                <h3 className="text-green-100 font-bold md:text-xl">
                  Alex Johnson
                </h3>
                <p className="text-green-200 text-sm font-medium">Mentor</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 items-center justify-center w-full">
              <Image
                src={'/image/prod.jpg'}
                alt=""
                width={300}
                height={300}
                className="rounded-xl transition-all duration-700"
              />
              <div className="flex flex-col items-center">
                <h3 className="text-green-100 font-bold md:text-xl">
                  Alex Johnson
                </h3>
                <p className="text-green-200 text-sm font-medium">Mentor</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 items-center justify-center w-full">
              <Image
                src={'/image/prod.jpg'}
                alt=""
                width={300}
                height={300}
                className="rounded-xl transition-all duration-700"
              />
              <div className="flex flex-col items-center">
                <h3 className="text-green-100 font-bold md:text-xl">
                  Alex Johnson
                </h3>
                <p className="text-green-200 text-sm font-medium">Mentor</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
