'use client';
import { ArrowUpIcon, CheckedIcon } from '@/assets/icons';
import { ProductIMAGES } from '@/utils/data';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

export default function Program() {
  const [positions, setPositions] = useState(ProductIMAGES);
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
    <div className="w-full max-w-[1300px] mx-auto  flex flex-col items-center gap-10 lg:flex-row py-12 md:py-20 px-8 md:px-8 lg:px-16">
      <div className="flex flex-1 justify-center  mx-auto items-center  gap-3  ">
        <div className="flex gap-2 flex-col rounded-xl ">
          <Image
            src={positions[0]}
            alt="produc"
            width={165}
            height={167}
            className="rounded-xl transition-all duration-700"
          />
          <Image
            src={positions[1]}
            alt="program"
            width={165}
            height={167}
            className="rounded-xl transition-all duration-700"
          />
        </div>

        <div className="relative flex justify-center h-full">
          <div className="absolute inset-0 m-auto ml-8 md:w-[268px] h-[200px]  md:h-[270px] bg-[#CFE8AF] rounded-xl z-0"></div>
          <div className="relative z-10 flex flex-col mt-10 md:mt-24 mr-3 md:mr-0 gap-3">
            <Image
              src={positions[2]}
              alt="program"
              width={265}
              height={267}
              className="rounded-xl transition-all duration-700"
            />
          </div>
        </div>
      </div>
      <div className="w-full flex-1  font-montserrat montserrat lg:ml-10  flex flex-col  gap-6 md:gap-8">
        <h3 className="text-green-200  text-[26px] leading-8 md:leading-14 md:text-5xl font-bold">
          Program Structure{' '}
        </h3>
        <h3 className="text-green-200 md:text-xl">
          100% virtual, live sessions to foster real connection.
        </h3>
        <div className="flex flex-col gap-3">
          <div className="flex gap-3 ">
            <div className="w-[30px]">
              <CheckedIcon />
            </div>
            <h3 className="text-green-200  md:text-xl ">
              1 x 60-minute Expert-Led Masterclass (Full Cohort){' '}
            </h3>
          </div>
          <div className="flex gap-3 ">
            <div className="w-[30px]">
              <CheckedIcon />
            </div>
            <h3 className="text-green-200  md:text-xl ">
              1 x 30-minute 1-on-1 Mentorship session (weekly){' '}
            </h3>
          </div>
          <div className="flex gap-3 ">
            <div className="w-[30px]">
              <CheckedIcon />
            </div>
            <h3 className="text-green-200  md:text-xl ">
              1 x 45-minute Peer Mastermind Group session{' '}
            </h3>
          </div>
        </div>
        <h3 className="text-green-200 md:text-xl">
          Approximately 2.5 hours of scheduled sessions per week, plus personal
          reflection and weekly deliverables.{' '}
        </h3>
        <div className="">
          <Link
            href="/"
            className="md:px-6 justify-center  max-w-[380px]  px-2 flex items-center gap-1 py-2 border rounded-xl text-white font-semibold transition-colors bg-green-100"
          >
            See the 3-Month Program Outline <ArrowUpIcon />
          </Link>
        </div>
      </div>
    </div>
  );
}
