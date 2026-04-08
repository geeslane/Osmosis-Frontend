import { ArrowUpIcon } from '@/assets/icons';
import Link from 'next/link';
import React from 'react';

export default function Investment() {
  return (
    <div className="w-full font-montserrat montserrat flex flex-col justify-center items-center gap-8 py-12 md:py-20 px-8 md:px-8 lg:px-12">
      <div className="Investmentbg flex px-10 md:px-[100px] items-center justify-center flex-col gap-6 max-w-[900px] min-h-[400px] rounded-xl w-full py-8">
        <h3 className="text-green-100 text-center text-lg leading-8 md:leading-10 md:text-xl font-bold">
          The Future is Coming. Help Them Design It.
        </h3>
        <div className="flex flex-col gap-4">
          <p className="text-white md:text-xl text-center leading-relaxed">
            Don&#39;t let your teen&#39;s potential get lost in the noise. Give
            them clarity, confidence, and direction to thrive.
          </p>
          <p className="text-white md:text-xl text-center leading-relaxed">
            Spots fill fast. Book a free Discovery Call and see if this
            investment is the right fit for your teen.
          </p>
        </div>
        <div className="mt-4">
          <Link
            href="/"
            className="md:px-6 justify-center  max-w-[380px]  px-2 flex items-center gap-1 py-2  border-0 rounded-xl text-white font-semibold transition-colors bg-green-100"
          >
            Book a Free Call & Secure Their Spot <ArrowUpIcon />
          </Link>
        </div>
      </div>
    </div>
  );
}
