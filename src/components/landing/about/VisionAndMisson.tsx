import React from 'react';

export default function VisionAndMisson() {
  return (
    <div className="flex flex-col gap-14 w-full items-center mb-14">
      <div className="w-full  font-montserrat montserrat text-center items-center  flex flex-col justify-center gap-6 md:gap-8">
        <h3 className="text-green-200 text-[26px] leading-8 md:leading-14 md:text-5xl font-bold">
          Vision
        </h3>
        <h3 className=" mb-3 text-[#282F2E] text-lg md:text-2xl">
          Raising a generation of purpose-driven teens with confidence and
          clarity
        </h3>
      </div>
      <div className="w-full max-w-[983px]  font-montserrat montserrat text-center items-center  flex flex-col justify-center gap-6 md:gap-8">
        <h3 className="text-green-200  text-[26px] leading-8 md:leading-14 md:text-5xl font-bold">
          Mission Statement{' '}
        </h3>
        <h3 className=" mb-3 text-[#282F2E] px-4 text-lg md:text-2xl">
          To build a nurturing ecosystem where teenagers discover their
          authentic identity, develop emotional and self-leadership skills, and
          harness the power of conscious choice through expert mentorship and
          transformative learning experiences.
        </h3>
      </div>
    </div>
  );
}
