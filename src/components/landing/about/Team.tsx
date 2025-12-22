import Image from 'next/image';
import React from 'react';

export default function Team() {
  return (
    <div className=" flex flex-col mb-30 font-montserrat montserrat items-center justify-center py-4 px-8">
      <h3 className="text-green-200  text-[26px] leading-8 md:leading-14 md:text-5xl font-bold">
        Our Team
      </h3>
      <div className="grid mt-10 lg:mx-[85px]  grid-cols-2 gap-6 md:grid-cols-4 ">
        <div className="flex flex-col gap-2 items-center justify-center w-full">
          <Image
            src={'/image/prod.jpg'}
            alt=""
            width={300}
            height={300}
            className="rounded-xl transition-all duration-700"
          />
          <div className="flex flex-col items-center">
            <h3 className="text-green-100 font-bold md:text-xl">
              Alex Johnson
            </h3>
            <p className="text-green-200 text-sm font-medium">Mentor</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 items-center justify-center w-full">
          <Image
            src={'/image/prod.jpg'}
            alt=""
            width={300}
            height={300}
            className="rounded-xl transition-all duration-700"
          />
          <div className="flex flex-col items-center">
            <h3 className="text-green-100 font-bold md:text-xl">
              Alex Johnson
            </h3>
            <p className="text-green-200 text-sm font-medium">Mentor</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 items-center justify-center w-full">
          <Image
            src={'/image/prod.jpg'}
            alt=""
            width={300}
            height={300}
            className="rounded-xl transition-all duration-700"
          />
          <div className="flex flex-col items-center">
            <h3 className="text-green-100 font-bold md:text-xl">
              Alex Johnson
            </h3>
            <p className="text-green-200 text-sm font-medium">Mentor</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 items-center justify-center w-full">
          <Image
            src={'/image/prod.jpg'}
            alt=""
            width={300}
            height={300}
            className="rounded-xl transition-all duration-700"
          />
          <div className="flex flex-col items-center">
            <h3 className="text-green-100 font-bold md:text-xl">
              Alex Johnson
            </h3>
            <p className="text-green-200 text-sm font-medium">Mentor</p>
          </div>
        </div>
      </div>
    </div>
  );
}
