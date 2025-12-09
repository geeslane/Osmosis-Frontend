'use client';
import { ArrowUpIcon, Star } from '@/assets/icons';
import { imageSources, users } from '@/utils/data';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

export default function HomeHero() {
  const [swap, setSwap] = useState(0);

  useEffect(() => {
    imageSources.forEach((src) => {
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
        <div className="w-full max-w-[879px] mx-auto flex flex-col gap-4 md:gap-8">
          <h3 className="font-montserrat montserrat text-[32px]  md:text-[72px] leading-9  font-bold md:leading-18 text-center">
            Navigate Your Now. Design Your Future
          </h3>
          <p className="text-black-200 montserrat px-4  text-center  md:text-xl">
            Osmosis is an executive transformative 3-month mentorship program
            where teenagers are equipped with the clarity, confidence, and
            self-leadership skills to thrive in a complex world.
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
      <div className="flex justify-center md:mt-0 mt-8 items-center gap-3">
        <div className="flex -space-x-3">
          {users.map((src, i) => (
            <div
              key={i}
              className="w-10 h-10 rounded-xl overflow-hidden border-[1.5px] border-black-300 bg-[#5F684E] shadow"
            >
              <Image
                src={src}
                alt={`User avatar ${i + 1}`}
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
          ))}
        </div>
        <div className="flex flex-col   gap-1">
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i}>
                <Star />
              </div>
            ))}
          </div>
          <div>
            <span className="font-normal text-green-200">
              from 200+ reviews
            </span>
          </div>
        </div>
      </div>
      <div className="flex h-full relative justify-center gap-2 ">
        <Image
          src={'/image/group.png'}
          alt=""
          width={200}
          height={100}
          className="absolute w-full "
        />

        <div className="relative w-full flex flex-col mt-12 gap-20">
          <div className="w-full flex justify-center">
            <Link
              href="/"
              className="w-[213px] mb-20 mb:mb-0 montserrat flex items-center justify-center gap-2 py-2 border rounded-xl text-white font-semibold transition-colors bg-green-100"
            >
              Get Started <ArrowUpIcon />
            </Link>
          </div>
          <div className="md:flex hidden justify-center items-center mb-20">
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
            <div className="md:flex hidden items-center gap-3 ">
              <div className="flex flex-col gap-5">
                {/* FIRST IMAGE STACK */}
                <div className="relative w-[208px] max-md:w-[130px] max-md:h-[200px]">
                  <Image
                    src={'/image/us.jpg'}
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
                    src={'/image/user2.jpg'}
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
                    src={'/image/user.png'}
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
                    src={'/image/user2.jpg'}
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
                    src={'/image/user.png'}
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
                    src={'/image/us.jpg'}
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
                  src={'/image/user.png'}
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
                  src={'/image/us.jpg'}
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
                  src={'/image/user2.jpg'}
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
