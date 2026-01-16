import Image from 'next/image';
import React from 'react';

type EmptyProps = {
  title?: string;
  description?: string;
  imageSrc?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
};

export default function Empty({
  title,
  description,
  imageSrc = '/image/NotFound.png',
  imageAlt = 'Not Found',
  imageWidth = 400,
  imageHeight = 400,
}: EmptyProps) {
  return (
    <div className="flex flex-col items-center max-w-[500px] mx-auto my-[64px] justify-center rounded-2xl border border-green-400 px-[40px] py-[58px] md:px-[50px]">
      <Image
        src={imageSrc}
        alt={imageAlt}
        width={imageWidth}
        height={imageHeight}
        className="mx-auto"
      />

      <div className="mt-10 flex flex-col items-center gap-2 text-center">
        {title && (
          <h3 className="text-xl font-medium text-[#939090]">{title}</h3>
        )}
        {description && <p className="text-lg text-[#A0A0A0]">{description}</p>}
      </div>
    </div>
  );
}
