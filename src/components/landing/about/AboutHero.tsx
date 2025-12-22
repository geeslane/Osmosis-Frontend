'use client';
import { AboutimageSources } from '@/utils/data';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

export default function AboutHero() {
  const [swap, setSwap] = useState(0);

  useEffect(() => {
    AboutimageSources.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });

    const interval = setInterval(() => {
      setSwap((prev) => (prev + 1) % 3);
    }, 3000);

    return () => clearInterval(interval);
  }, []);
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
        <div className="w-full max-w-[879px] px-2 mx-auto flex flex-col gap-4 md:gap-8">
          <h3 className="font-montserrat text-green-200 montserrat text-[32px]  md:text-[72px] leading-9  font-bold md:leading-18 text-center">
            Unlock Your Potential. Find Your Path.
          </h3>
          <p className="text-green-200 montserrat px-4  text-center  md:text-xl">
             Osmosis is the launching pad for teenagers to absorb the clarity,
            confidence, and self-leadership skills to thrive in a complex world.
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

      <div className="flex h-full relative justify-center gap-2 ">
        <Image
          src={'/image/group.png'}
          alt=""
          width={200}
          height={100}
          className="absolute w-full "
        />

        <div className="relative max-w-[1300px] mx-auto  w-full flex flex-col mt-12 gap-20">
          <div className="flex justify-center items-center mb-20">
            <div className="hidden md:flex absolute top-28 z-99 left-60 px-3 py-2 gap-3 justify-center items-center bg-white w-[260px] h-[50px] shadow-2xl rounded-full">
              <Image
                src={'/image/Avatar.png'}
                alt=""
                width={34}
                height={34}
                className="rounded-full object-cover"
              />
              <div className="flex flex-col justify-center gap-2 w-full h-full">
                <div className="bg-[#F3F4F6] rounded-full w-full h-3"></div>
                <div className="bg-[#F3F4F6] rounded-full w-[50%] h-2"></div>
              </div>
            </div>
            <div className="hidden md:flex absolute top-[16rem] z-99 right-40 px-3 py-2 gap-3 justify-center items-center bg-white w-[260px] h-[50px] shadow-2xl rounded-full">
              <Image
                src={'/image/Avatar1.png'}
                alt=""
                width={34}
                height={34}
                className="rounded-full"
              />
              <div className="flex flex-col justify-center gap-2 w-full h-full">
                <div className="bg-[#F3F4F6] rounded-full w-full h-3"></div>
                <div className="bg-[#F3F4F6] rounded-full w-[50%] h-2"></div>
              </div>
            </div>
            <div className="hidden md:flex absolute top-[30rem] z-99 right-48 px-3 py-2 gap-3 justify-center items-center bg-white w-[260px] h-[50px] shadow-2xl rounded-full">
              <Image
                src={'/image/Avatar2.png'}
                alt=""
                width={34}
                height={34}
                className="rounded-full"
              />
              <div className="flex flex-col justify-center gap-2 w-full h-full">
                <div className="bg-[#F3F4F6] rounded-full w-full h-3"></div>
                <div className="bg-[#F3F4F6] rounded-full w-[50%] h-2"></div>
              </div>
            </div>
            <div className="hidden md:flex absolute top-[9rem] right-[27rem] z-99  px-3 py-2 gap-3 justify-center items-center bg-white w-[260px] h-[50px] shadow-2xl rounded-full">
              <Image
                src={'/image/Avatar2.png'}
                alt=""
                width={34}
                height={34}
                className="rounded-full"
              />
              <div className="flex flex-col justify-center gap-2 w-full h-full">
                <div className="bg-[#F3F4F6] rounded-full w-full h-3"></div>
                <div className="bg-[#F3F4F6] rounded-full w-[50%] h-2"></div>
              </div>
            </div>
            <div className="hidden md:flex absolute top-[23rem] z-99 left-40 px-3 py-2 gap-3 justify-center items-center bg-white w-[260px] h-[50px] shadow-2xl rounded-full">
              <Image
                src={'/image/us.jpg'}
                alt=""
                width={34}
                height={34}
                className="rounded-full"
              />
              <div className="flex flex-col justify-center gap-2 w-full h-full">
                <div className="bg-[#F3F4F6] rounded-full w-full h-3"></div>
                <div className="bg-[#F3F4F6] rounded-full w-[50%] h-2"></div>
              </div>
            </div>
            <div className="hidden md:flex absolute top-[35rem] z-99 left-60 px-3 py-2 gap-3 justify-center items-center bg-white w-[260px] h-[50px] shadow-2xl rounded-full">
              <Image
                src={'/image/Avatar.png'}
                alt=""
                width={34}
                height={34}
                className="rounded-full"
              />
              <div className="flex flex-col justify-center gap-2 w-full h-full">
                <div className="bg-[#F3F4F6] rounded-full w-full h-3"></div>
                <div className="bg-[#F3F4F6] rounded-full w-[50%] h-2"></div>
              </div>
            </div>
            <Image
              src={'/image/line.png'}
              alt=""
              width={250}
              height={10}
              className="absolute top-24 rotate-12"
            />
            <div className="flex items-center gap-3 ">
              <div className="flex flex-col gap-5">
                {/* FIRST IMAGE STACK */}
                <div className="relative w-[208px] max-md:w-[130px] max-md:h-[200px]">
                  <Image
                    src={'/AboutImage/us.jpg'}
                    alt=""
                    width={208}
                    height={260}
                    className={`rounded-xl absolute inset-0 w-full h-full max-md:w-[130px] max-md:h-[200px] object-cover transition-opacity duration-[1200ms] ease-in-out ${
                      swap === 0
                        ? 'opacity-100 z-10'
                        : 'opacity-0 z-0 pointer-events-none'
                    }`}
                  />
                  <Image
                    src={'/AboutImage/user2.jpg'}
                    alt=""
                    width={200}
                    height={260}
                    className={`rounded-xl absolute inset-0 w-full h-full max-md:w-[130px] max-md:h-[200px] object-cover transition-opacity duration-[1200ms] ease-in-out ${
                      swap === 1
                        ? 'opacity-100 z-10'
                        : 'opacity-0 z-0 pointer-events-none'
                    }`}
                  />
                  <Image
                    src={'/AboutImage/user.jpg'}
                    alt=""
                    width={208}
                    height={260}
                    className={`rounded-xl absolute inset-0 w-full h-full max-md:w-[130px] max-md:h-[200px] object-cover transition-opacity duration-[1200ms] ease-in-out ${
                      swap === 2
                        ? 'opacity-100 z-10'
                        : 'opacity-0 z-0 pointer-events-none'
                    }`}
                  />

                  <div className="w-[208px] h-[260px] max-md:w-[130px] max-md:h-[200px]"></div>
                </div>

                {/* SECOND IMAGE STACK */}
                <div className="relative w-[200px] max-md:w-[130px] max-md:h-[190px]">
                  <Image
                    src={'/AboutImage/user2.jpg'}
                    alt=""
                    width={200}
                    height={260}
                    className={`rounded-xl absolute inset-0 w-full h-full max-md:w-[130px] max-md:h-[190px] object-cover transition-opacity duration-[1200ms] ease-in-out ${
                      swap === 0
                        ? 'opacity-100 z-10'
                        : 'opacity-0 z-0 pointer-events-none'
                    }`}
                  />
                  <Image
                    src={'/AboutImage/user.jpg'}
                    alt=""
                    width={200}
                    height={260}
                    className={`rounded-xl absolute inset-0 w-full h-full max-md:w-[130px] max-md:h-[190px] object-cover transition-opacity duration-[1200ms] ease-in-out ${
                      swap === 1
                        ? 'opacity-100 z-10'
                        : 'opacity-0 z-0 pointer-events-none'
                    }`}
                  />
                  <Image
                    src={'/AboutImage/us.jpg'}
                    alt=""
                    width={208}
                    height={260}
                    className={`rounded-xl absolute inset-0 w-full h-full max-md:w-[130px] max-md:h-[190px] object-cover transition-opacity duration-[1200ms] ease-in-out ${
                      swap === 2
                        ? 'opacity-100 z-10'
                        : 'opacity-0 z-0 pointer-events-none'
                    }`}
                  />

                  <div className="w-[200px] h-[260px] max-md:w-[130px] max-md:h-[190px]"></div>
                </div>
              </div>

              {/* MOBILE HERO IMAGE */}
              <div className="flex relative gap-3">
                <div
                  className="
        bg-[#CFE8AF] ml-10 rounded-2xl 
        w-[360px] h-[390px]
        max-md:w-[180px] max-md:h-[280px] max-md:ml-3
      "
                ></div>

                <Image
                  src={'/AboutImage/user.jpg'}
                  alt=""
                  width={200}
                  height={50}
                  className={`
        rounded-xl w-[360px] h-[390px] mt-5 object-cover absolute 
        max-md:w-[180px] max-md:h-[280px]
        transition-opacity duration-[1200ms] ease-in-out
        ${swap === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}
      `}
                />

                <Image
                  src={'/AboutImage/us.jpg'}
                  alt=""
                  width={200}
                  height={50}
                  className={`
        rounded-xl w-[360px] h-[390px] mt-5 object-cover absolute
        max-md:w-[180px] max-md:h-[280px]
        transition-opacity duration-[1200ms] ease-in-out
        ${swap === 1 ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}
      `}
                />

                <Image
                  src={'/AboutImage/user2.jpg'}
                  alt=""
                  width={200}
                  height={50}
                  className={`
        rounded-xl w-[360px] h-[390px] mt-5 object-cover absolute
        max-md:w-[180px] max-md:h-[280px]
        transition-opacity duration-[1200ms] ease-in-out
        ${swap === 2 ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}
      `}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
