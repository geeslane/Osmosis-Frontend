import { ArrowUpIcon, CheckedIcon } from '@/assets/icons';
import Link from 'next/link';
import React from 'react';

export default function Clarity() {
  return (
    <div className="max-w-[856px] mx-auto pt-16  md:pt-24 px-8 lg:px-6">
      <div className="w-full  font-montserrat montserrat  flex flex-col justify-center gap-6 md:gap-8">
        <h3 className="text-green-200 text-[26px] leading-8 md:leading-14 md:text-5xl font-bold">
          This is Osmosis. Where Clarity is Absorbed, Not Forced.{' '}
        </h3>
        <h3 className="text-green-200 md:text-xl">
          Just like the biological process, our program creates the perfect
          environment for growth. We surround your teenager with positive
          influences, powerful tools, and personalized mentorship, allowing them
          to naturally absorb what they need to thrive.
        </h3>
        <div className="">
          <div className="flex flex-col gap-4">
            <h3 className="text-green-200 md:text-xl font-medium">
              We help them bridge the gap between &#34;I don&rsquo;t know&#34;
              and &#34;I know myself.&#34;
            </h3>
            <div className="flex gap-3 ">
              <div className="w-[30px]">
                <CheckedIcon />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-green-200  md:text-xl font-semibold">
                  Confusion → Clarity:{' '}
                </h3>
                <p className="text-green-200 md:text-xl">
                  By defining their core values and personal mission.
                </p>
              </div>
            </div>
            <div className="flex gap-3 ">
              <div className="w-[30px]">
                <CheckedIcon />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-green-200  md:text-xl font-semibold">
                  Overwhelm → Action:{' '}
                </h3>
                <p className="text-green-200 md:text-xl max-w-[537px]">
                  By learning a powerful framework for making confident
                  decisions.{' '}
                </p>
              </div>
            </div>
            <div className="flex gap-3 ">
              <div className="w-[30px]">
                <CheckedIcon />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-green-200  md:text-xl font-semibold">
                  Aimlessness → Purpose:{' '}
                </h3>
                <p className="text-green-200 md:text-xl max-w-[537px]">
                  By designing an actionable roadmap for their future.
                </p>
              </div>
            </div>
          </div>
          <div className="w-full flex justify-start mt-8">
            <Link
              href="/"
              className="w-[375px] mb-20 mb:mb-0 montserrat flex items-center justify-center gap-2 py-2 border rounded-xl text-white font-semibold transition-colors bg-green-100"
            >
              See the 3-Month Program Outline <ArrowUpIcon />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
