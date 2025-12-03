import { ArrowUpIcon } from '@/assets/icons';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function Navigating() {
  return (
    <section className="w-full py-12 md:py-20 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-14">
          <div className="w-full flex-1 font-montserrat montserrat  flex flex-col justify-center gap-6 md:gap-8">
            <h3 className="text-green-200 text-[26px] leading-8 md:leading-14 md:text-5xl font-bold">
              Is Your Teenager Navigating Their Future With a Map, or Just a
              Guess?{' '}
            </h3>
            <h3 className="text-green-200 md:text-xl">
              In a world of constant noise and endless pressure, it’s easy for
              teens to get lost. They have the potential, the talent, and the
              dreams, but they often lack the clarity and the tools to build
              their own path forward. Osmosis provides the map and the compass.
              We don’t give them the answers we guide them to discover them.
            </h3>
            <div className="">
              <Link
                href="/"
                className="md:px-6 justify-center  max-w-[380px]  px-2 flex items-center gap-1 py-2 border rounded-lg text-white font-semibold transition-colors bg-green-100"
              >
                Schedule a Free 20-minute Call <ArrowUpIcon />
              </Link>
            </div>
          </div>
          <div>
            <Image
              src={'/image/Navig.jpg'}
              alt=""
              width={555}
              height={555}
              className="rounded-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
