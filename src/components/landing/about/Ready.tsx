import { ArrowUpIcon } from '@/assets/icons';
import Link from 'next/link';
import React from 'react';

export default function Ready() {
  return (
    <div className="w-full font-montserrat montserrat flex flex-col justify-center items-center  gap-8 py-12 md:py-20 px-4 md:px-8 lg:px-16">
      <div className="Investmentbg flex px-10 md:px-[100px] items-center justify-center flex-col gap-4 max-w-[900px] h-[480px] rounded-xl w-full">
        <h3 className="text-green-100 text-center text-lg leading-8 md:leading-14 md:text-xl font-bold">
          Ready to Invest in Their Future Today?{' '}
        </h3>
        <h3 className="text-white md:text-xl text-center">
          Your teenager has limitless potential. We provide the environment for
          them to realize it. Let’s discuss how Osmosis can be the turning point
          in their journey. Spots are limited to ensure a high-quality,
          personalized experience.
        </h3>
        <div className="mt-6">
          <Link
            href="/"
            className="md:px-6 justify-center  max-w-[380px] text-sm md:text-base  px-2 flex items-center gap-1 py-2  border-0 rounded-xl text-white font-semibold transition-colors bg-green-100"
          >
            Schedule a Free 20-Minute Call <ArrowUpIcon />
          </Link>
        </div>
        <h3 className="text-white text-sm mt-5 md:text-xl text-center">
          A no-obligation call to see if Osmosis is the right fit for your
          family.
        </h3>
      </div>
    </div>
  );
}
