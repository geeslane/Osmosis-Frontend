'use client';
import { CheckedIcon } from '@/assets/icons';
import { IMAGES } from '@/utils/data';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

export default function Lead() {
  const [positions, setPositions] = useState(IMAGES);
  useEffect(() => {
    const interval = setInterval(() => {
      setPositions((prev) => {
        const copy = [...prev];
        const last = copy.pop();
        copy.unshift(last as string);
        return copy;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full max-w-[1300px] mx-auto  py-3 md:py-20 px-8 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          <div className="flex items-center gap-3 flex-1 ">
            <div className="flex gap-2 flex-col rounded-xl ">
              <Image
                src={positions[0]}
                alt=""
                width={165}
                height={167}
                className="rounded-xl transition-all duration-700"
              />
              <Image
                src={positions[1]}
                alt=""
                width={165}
                height={167}
                className="rounded-xl transition-all duration-700"
              />
            </div>

            <div className="relative flex justify-center h-full">
              <div className="absolute inset-0 m-auto ml-8 md:w-[268px] h-[200px] md:h-[311px] bg-[#CFE8AF] rounded-xl z-0"></div>
              <div className="relative z-10 flex mr-3 flex-col gap-3">
                <Image
                  src={positions[2]}
                  alt=""
                  width={265}
                  height={147}
                  className="rounded-xl transition-all duration-700"
                />
                <Image
                  src={positions[3]}
                  alt=""
                  width={265}
                  height={167}
                  className="rounded-xl transition-all duration-700"
                />
              </div>
            </div>
          </div>
          <div className="w-full flex-1 font-montserrat montserrat  flex flex-col justify-center gap-6 md:gap-8">
            <h3 className="text-green-200 text-[26px] leading-8 md:leading-14 md:text-5xl font-bold">
              They’re Drowning in Noise. You’re Looking for a Lifeline.
            </h3>
            <h3 className="text-green-200 md:text-xl">
              You see it every day. The pressure to choose the
              &rdquo;right&rdquo; university, the &rdquo;right&rdquo; career,
              the &rdquo;right&rdquo; friends. The constant comparison on social
              media. The gap between the confident child you know and the
              uncertain young adult struggling to find their place.
            </h3>
            <div className="flex flex-col gap-4">
              <h3 className="text-green-200 md:text-xl">This leads to:</h3>
              <div className="flex gap-3 ">
                <div className="w-[30px]">
                  <CheckedIcon />
                </div>
                <h3 className="text-green-200  md:text-xl font-semibold">
                  Anxiety-fueled decisions instead of confident choices.
                </h3>
              </div>
              <div className="flex gap-3">
                <div className="w-[30px]">
                  <CheckedIcon />
                </div>{' '}
                <h3 className="text-green-200 md:text-xl font-semibold">
                  A search for external validation instead of building internal
                  self-worth.{' '}
                </h3>
              </div>
              <div className="flex gap-3">
                <div className="w-[30px]">
                  <CheckedIcon />
                </div>
                <h3 className="text-green-200 md:text-xl font-semibold">
                  A feeling of being alone in their struggles, even when
                  surrounded by people.
                </h3>
              </div>
            </div>
            <h3 className="text-green-200 md:text-xl">
              You want to help, but you know they need guidance from someone
              other than a parent. You need a trusted partner in their corner.
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
}
