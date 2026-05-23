'use client';
import { ArrowUpIcon } from '@/assets/icons';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const MENTOR_HERO_IMAGE =
  'https://images.pexels.com/photos/5234735/pexels-photo-5234735.jpeg?auto=compress&cs=tinysrgb&w=1400';

export default function MentorHero() {
  return (
    <div>
      <div className="flex flex-col max-w-[1600px] mx-auto md:px-10 items-stretch px-4 lg:px-[80px] py-3 md:pt-[90px] lg:flex-row lg:items-center lg:gap-12 xl:gap-16">
        <div className="flex-1 font-montserrat montserrat md:items-start pt-[48px] lg:pt-0">
          <div className="w-full max-w-[879px] mx-auto lg:mx-0 flex flex-col gap-4 md:gap-8">
            <h3 className="font-montserrat text-green-200 montserrat text-[32px] md:text-[72px] leading-9 font-bold md:leading-[1.1] lg:text-start text-center">
              Become a Mentor.{' '}
            </h3>
            <h3 className="font-montserrat text-green-200 montserrat text-[24px] md:leading-14 md:text-[48px] font-bold lg:text-start text-center">
              Transform a Teen’s Life and Shape The Next Generation.
            </h3>

            <p className="text-black-200 montserrat px-4 md:px-0 lg:text-start text-center md:text-xl">
              We are looking for experienced teen coaches, mentors, and
              professionals passionate about teenagers to guide them through
              their journey of self-discovery. Your experience could be their
              clarity.{' '}
            </p>
            <div className="w-full flex justify-center lg:justify-start pb-8 lg:pb-0">
              <Link
                href="/mentor/signup"
                className="w-[317px] mb:mb-0 montserrat flex items-center justify-center gap-2 py-2 border rounded-xl text-white font-semibold transition-colors bg-green-100"
              >
                Apply to Become a Mentor <ArrowUpIcon />
              </Link>
            </div>
          </div>
        </div>

        <div className="flex-1 flex justify-center lg:justify-end w-full min-w-0 pb-12 lg:pb-8">
          <div className="relative w-full max-w-[min(100%,520px)] aspect-[4/5] sm:aspect-[5/6] rounded-2xl overflow-hidden">
              <Image
                src={MENTOR_HERO_IMAGE}
                alt="Young women studying together"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 45vw"
                priority
              />
          </div>
        </div>
      </div>
      <div>
        <Image
          src={'/image/Oval.png'}
          alt="Oval"
          width={150}
          height={138}
          className="hidden lg:flex"
        />
      </div>
    </div>
  );
}
