'use client';
import { ArrowUpIcon } from '@/assets/icons';
import { imageSources } from '@/utils/data';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

export default function MentorHero() {
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
    <div>
      {' '}
      <div className="flex flex-col md:px-10 items-center lg:px-[80px] py-3 md:pt-[90px] lg:flex-row h-full ">
        <div className="flex-1 font-montserrat montserrat  md:items-start pt-[48px] justify-between">
          <div className="w-full max-w-[879px] mx-auto flex flex-col gap-4 md:gap-8">
            <h3 className="font-montserrat text-green-200 montserrat text-[32px]  md:text-[72px] leading-9  font-bold md:leading-18 lg:text-start text-center  ">
              Become a Mentor.{' '}
            </h3>
            <h3 className="font-montserrat text-green-200 montserrat text-[24px] md:leading-14   md:text-[48px]   font-bold  lg:text-start text-center  ">
              Transform a Teen’s Life and Shape The Next Generation.
            </h3>

            <p className="text-black-200 montserrat px-4 md:px-0  lg:text-start text-center  md:text-xl">
              We are looking for experienced teen coaches, mentors, and
              professionals passionate about teenagers to guide them through
              their journey of self-discovery. Your experience could be their
              clarity.{' '}
            </p>
            <div className="w-full flex justify-center lg:justify-start ">
              <Link
                href="/mentor/signup"
                className="w-[317px] mb:mb-0 montserrat flex items-center justify-center gap-2 py-2 border rounded-xl text-white font-semibold transition-colors bg-green-100"
              >
                Apply to Become a Mentor <ArrowUpIcon />
              </Link>
            </div>
          </div>
        </div>

        <div className="flex-1 h-full relative justify-center gap-2 ">
          <div className="relative w-full flex flex-col mt-12 gap-20">
            <div className="flex  justify-center items-center mb-20">
              <div className="flex  items-center gap-3 ">
                <div className="flex flex-col gap-5">
                  {/* FIRST IMAGE STACK */}
                  <div className="relative w-[208px] max-md:w-[130px] max-md:h-[160]">
                    <Image
                      src={'/image/us.jpg'}
                      alt=""
                      width={165}
                      height={260}
                      className={`rounded-xl absolute inset-0 w-full h-full max-md:w-[130px] max-md:h-[160] object-cover transition-opacity duration-[1200ms] ease-in-out ${
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
                      className={`rounded-xl absolute inset-0 w-full h-full max-md:w-[130px] max-md:h-[160] object-cover transition-opacity duration-[1200ms] ease-in-out ${
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
                      className={`rounded-xl absolute inset-0 w-full h-full max-md:w-[130px] max-md:h-[160] object-cover transition-opacity duration-[1200ms] ease-in-out ${
                        swap === 2
                          ? 'opacity-100 z-10'
                          : 'opacity-0 z-0 pointer-events-none'
                      }`}
                    />

                    <div className="w-[165px] h-[165px] max-md:w-[130px] max-md:h-[160]"></div>
                  </div>

                  {/* SECOND IMAGE STACK */}
                  <div className="relative w-[160] max-md:w-[130px] max-md:h-[130px]">
                    <Image
                      src={'/image/user2.jpg'}
                      alt=""
                      width={200}
                      height={260}
                      className={`rounded-xl absolute inset-0 w-full h-full max-md:w-[130px] max-md:h-[130px] object-cover transition-opacity duration-[1200ms] ease-in-out ${
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
                      className={`rounded-xl absolute inset-0 w-full h-full max-md:w-[130px] max-md:h-[130px] object-cover transition-opacity duration-[1200ms] ease-in-out ${
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
                      className={`rounded-xl absolute inset-0 w-full h-full max-md:w-[130px] max-md:h-[130px] object-cover transition-opacity duration-[1200ms] ease-in-out ${
                        swap === 2
                          ? 'opacity-100 z-10'
                          : 'opacity-0 z-0 pointer-events-none'
                      }`}
                    />

                    <div className="w-[160] h-[165px] max-md:w-[130px] max-md:h-[130px]"></div>
                  </div>
                </div>

                {/* MOBILE HERO IMAGE */}
                <div className="flex relative gap-3">
                  <div
                    className="
        bg-[#CFE8AF] ml-10 rounded-2xl 
        w-[354px] h-[329px]
        max-md:w-[180px] max-md:h-[280px] max-md:ml-3
      "
                  ></div>

                  <Image
                    src={'/image/user.png'}
                    alt=""
                    width={200}
                    height={50}
                    className={`
        rounded-xl w-[354px] h-[329px] mt-5 object-cover absolute 
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
        rounded-xl w-[354px] h-[329px] mt-5 object-cover absolute
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
        rounded-xl w-[354px] h-[329px] mt-5 object-cover absolute
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
