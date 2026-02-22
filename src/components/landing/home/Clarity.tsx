import { CheckedIcon } from '@/assets/icons';
import React from 'react';

export default function Clarity() {
  return (
    <div className="max-w-[856px] mx-auto pt-16  md:pt-24 px-8 lg:px-6">
      <div className="w-full  font-montserrat montserrat  flex flex-col justify-center gap-6 md:gap-8">
        <h3 className="text-green-200 text-[26px] leading-8 md:leading-14 md:text-5xl font-bold">
          At Osmosis, Clarity is Absorbed, Not Forced.
        </h3>
        <p className="text-green-200 md:text-xl">
          Like the biological process, we create the right environment for growth. Your teen gets positive influences, strong tools, and mentorship so they absorb what they need to thrive.
        </p>
        <div>
          <div className="flex flex-col gap-4">
            <p className="text-green-200 md:text-xl font-medium">
              We bridge &#34;I don&rsquo;t know&#34; and &#34;I know myself.&#34;
            </p>
            <div className="flex gap-3">
              <div className="w-[30px] shrink-0">
                <CheckedIcon />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-green-200 md:text-xl font-semibold">
                  Confusion → Clarity
                </h3>
                <p className="text-green-200 md:text-xl">
                  Through defining core values and a personal mission.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-[30px] shrink-0">
                <CheckedIcon />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-green-200 md:text-xl font-semibold">
                  Overwhelm → Action
                </h3>
                <p className="text-green-200 md:text-xl max-w-[537px]">
                  Through a framework for confident decisions.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-[30px] shrink-0">
                <CheckedIcon />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-green-200 md:text-xl font-semibold">
                  Aimlessness → Purpose
                </h3>
                <p className="text-green-200 md:text-xl max-w-[537px]">
                  Through an actionable roadmap for their future.
                </p>
              </div>
            </div>
          </div>
          {/* <div className="w-full flex justify-start mt-8">
            <Link
              href="/"
              className="w-[375px] mb-20 mb:mb-0 montserrat flex items-center justify-center gap-2 py-2 border rounded-xl text-white font-semibold transition-colors bg-green-100"
            >
              See the 3-Month Program Outline <ArrowUpIcon />
            </Link>
          </div> */}
        </div>
      </div>
    </div>
  );
}
