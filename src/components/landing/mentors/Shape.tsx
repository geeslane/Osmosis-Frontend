import { ArrowUpIcon } from '@/assets/icons';
import Link from 'next/link';
import React from 'react';

export default function Shape() {
  return (
    <div className="w-full font-montserrat montserrat flex flex-col justify-center items-center  gap-8 py-24 md:py-24 px-4 md:px-8 lg:px-16">
      <div className="Investmentbg flex px-10 md:px-[180px] items-center justify-center flex-col gap-4 max-w-[900px] h-[400px] rounded-xl w-full">
        <h3 className="text-green-100 text-center text-2xl leading-8 md:leading-14 md:text-[40px] font-bold">
          READY TO SHAPE THE NEXT GENERATION?{' '}
        </h3>
        <h3 className="text-white md:text-xl text-center">
          Become part of a mission greater than yourself. Your experience can
          change a teenager’s life.
        </h3>
        <div className="mt-6">
          <Link
            href="/mentor/signup"
            className="md:px-6 justify-center  max-w-[380px]  px-2 flex items-center gap-1 py-2  border-0 rounded-xl text-white font-semibold transition-colors bg-green-100"
          >
            Apply to Become a Mentor
            <ArrowUpIcon />
          </Link>
        </div>
      </div>
    </div>
  );
}
