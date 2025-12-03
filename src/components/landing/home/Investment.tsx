import { ArrowUpIcon } from '@/assets/icons';
import Link from 'next/link';
import React from 'react';

export default function Investment() {
  return (
    <div className="w-full font-montserrat montserrat flex flex-col justify-center items-center  gap-8 py-12 md:py-20 px-4 md:px-8 lg:px-16">
      <div className="Investmentbg flex px-10 md:px-[100px] items-center justify-center flex-col gap-4 max-w-[900px] h-[400px] rounded-xl w-full">
        <h3 className="text-green-100 text-center text-lg leading-8 md:leading-14 md:text-xl font-bold">
          They’re Drowning in Noise. You’re Looking for a Lifeline.
        </h3>
        <h3 className="text-white md:text-xl text-center">
          You can spend thousands on sports, tutoring, or hobbies that last a
          season. Osmosis is an investment in the skills that will last a
          lifetime: confidence, resilience, and direction.
        </h3>
        <div className="mt-6">
          <Link
            href="/"
            className="md:px-6 justify-center  max-w-[380px]  px-2 flex items-center gap-1 py-2  border-0 rounded-lg text-white font-semibold transition-colors bg-green-100"
          >
            Enroll your Child Now
            <ArrowUpIcon />
          </Link>
        </div>
      </div>
    </div>
  );
}
