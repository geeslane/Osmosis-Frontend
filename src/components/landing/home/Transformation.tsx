import AccordionItem from '@/components/ui/accordion/AccordionItem';
import React from 'react';

export default function Transformation() {
  return (
    <div className="max-w-[856px] mx-auto px-6 py-12 md:py-20">
      <div className="w-full  font-montserrat montserrat  flex flex-col justify-center gap-6 md:gap-8">
        <h3 className="text-green-200 text-[26px] leading-8 max-w-[555px]  md:leading-14 md:text-5xl font-bold">
          Your Teen&#39;s 3-Month Transformation Journey{' '}
        </h3>
        <h3 className="text-green-200 md:text-xl">
          This isn&#39;t just another online course. It&#39;s a high-touch,
          interactive experience designed for deep, lasting change.
        </h3>
        <div>
          <AccordionItem title="The Foundation">
            This is the content for The Foundation section.
          </AccordionItem>
          <AccordionItem title="The Framework">
            This is the content for The Foundation section.
          </AccordionItem>
          <AccordionItem title="The Launchpad">
            This is the content for The Foundation section.
          </AccordionItem>
        </div>
      </div>
    </div>
  );
}
