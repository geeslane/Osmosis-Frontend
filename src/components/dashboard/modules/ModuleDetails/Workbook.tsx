import { DownloadWorkIcon } from '@/assets/icons';
import Image from 'next/image';
import React from 'react';

export default function Workbook() {
  return (
    <div className="font-montserrat max-w-[639px] montserrat space-y-10 ">
      <h3 className="text-green-200 font-bold text-xl md:text-[32px]">Peace</h3>
      <div className="flex w-full mx-auto flex-col gap-6 items-center">
        <Image
          src={'/image/Gradient.png'}
          alt="Workbook Image"
          width={300}
          height={300}
        />

        <button className="font-semibold flex items-center gap-2 text-green-100 text-xl">
          <DownloadWorkIcon />
          Download
        </button>
      </div>
    </div>
  );
}
