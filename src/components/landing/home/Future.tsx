import { ArrowUpIcon } from '@/assets/icons';
import Link from 'next/link';
import React from 'react';

export default function Future() {
  return (
    <div className="w-full font-montserrat montserrat flex flex-col justify-center items-center  gap-8 py-12 md:py-20 px-4 md:px-8 lg:px-16">
      <h3 className="text-green-200 max-w-[1000px] text-center  text-[26px] leading-8 md:leading-18 md:text-[72px] font-bold">
        The Future is Coming. Let&#39;s Help Them Design It.{' '}
      </h3>
      <div>
        <p className="max-w-[1000px] text-center md:text-xl text-green-200">
          Don&#39;t let your teenager&#39;s potential get lost in the noise.
          Give them the clarity, confidence, and direction to not just succeed,
          but thrive.
        </p>
        <p className="max-w-[1000px] text-center md:text-xl text-green-200">
          The next cohort is filling up fast. Schedule a free, no-obligation
          Discovery Call with our team to discuss your teen&#39;s specific needs
          and see if Osmosis is the right fit.
        </p>
      </div>
      <div className="">
        <Link
          href="/"
          className="md:px-6 justify-center  max-w-[380px]  px-2 flex items-center gap-1 py-2 border rounded-lg text-white font-semibold transition-colors bg-green-100"
        >
          Book a Free Call & Secure Their Spot <ArrowUpIcon />
        </Link>
      </div>
    </div>
  );
}
