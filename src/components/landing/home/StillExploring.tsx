import { ArrowUpIcon } from '@/assets/icons';
import Link from 'next/link';
import React from 'react';

export default function StillExploring() {
  return (
    <section className="w-full font-montserrat montserrat py-12 md:py-20 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl  mx-auto">
        <h3 className="text-green-200  text-[26px] leading-8 md:leading-14 md:text-5xl font-bold">
          Still Exploring?{' '}
        </h3>
        <h3 className="mt-10 mb-3 text-[#282F2E] text-lg md:text-2xl">
          For your teen, by them. Let them take the first step.
        </h3>
        <Link
          href="/"
          className="justify-center text-green-100 pt-6 gap-1  text-2xl font-medium transition-colors"
        >
          Take a Free Personality Test.{' '}
        </Link>
      </div>
    </section>
  );
}
