'use client';
import { ArrowUpIcon } from '@/assets/icons';
import Image from 'next/image';
import Link from 'next/link';

export default function ContactHero() {
  return (
    <div className="flex h-full flex-col ">
      <div className="flex font-montserrat montserrat items-center pt-[48px] justify-between">
        <Image
          src={'/image/Oval.png'}
          alt="Oval"
          width={250}
          height={238}
          className="hidden lg:flex"
        />
        <div className="w-full max-w-[1100px] px-2 mx-auto flex flex-col gap-4 md:gap-8">
          <h3 className="font-montserrat text-green-200 montserrat text-[32px]  md:text-[72px] leading-9  font-bold md:leading-18 text-center">
            The Future is Coming. Let&#39;s Help Them Design It.{' '}
          </h3>
          <p className="text-green-200 montserrat px-4  text-center  md:text-xl">
            Don&#39;t let your teenager&#39;s potential get lost in the noise.
            Give them the clarity, confidence, and direction to not just
            succeed, but thrive. <br />
            The next cohort is filling up fast. Schedule a free, no-obligation
            Discovery Call with our team to discuss your teen&#39;s specific
            needs and see if Osmosis is the right fit.
          </p>
        </div>
        <Image
          src={'/image/Oval2.png'}
          alt="Oval"
          width={250}
          height={238}
          className="hidden lg:flex"
        />
      </div>

      <div className="w-full md:mt-5 mt-12  flex justify-center">
        <Link
          href="/"
          className="px-6  flex items-center gap-2 py-2 border rounded-lg text-white font-semibold transition-colors bg-green-100"
        >
          Book a Free Call & Secure Their Spot <ArrowUpIcon />
        </Link>
      </div>
    
    </div>
  );
}
