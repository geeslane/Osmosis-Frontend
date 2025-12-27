import Image from 'next/image';
import React from 'react';

export default function Empty({
  title,
  description,
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="border border-green-400 flex flex-col justify-center items-center px-[40px] md:px-[50px] rounded-2xl py-[58px]">
      <Image
        src="/image/NotFound.png"
        alt="Not Found"
        width={400}
        height={400}
        className="mx-auto"
      />
      <div className="flex mt-10 flex-col items-center text-center gap-2 ">
        <h3 className="text-xl text-[#939090] font-medium">{title}</h3>
        <h3 className="text-lg text-[#A0A0A0]">{description}</h3>
      </div>
    </div>
  );
}
