import AccordionItem from '@/components/ui/accordion/AccordionItem';
import React from 'react';

export default function Benefits() {
  return (
    <div className="bg-green-200 montserrat flex px-4 flex-col items-center justify-center py-[120px]">
      <p className="text-green-100 text-[26px] leading-8 md:leading-14 md:text-5xl font-bold">
         Pain Points & Benefits
      </p>
      <p className=" mb-3 mt-6 text-[#fff] text-base md:text-xl">
        Raising a generation of purpose-driven teens with confidence and clarity
      </p>
      <div className="w-full max-w-[750px]">
        <AccordionItem
          title={`"My child seems lost / I feel lost."`}
          className="text-white"
        >
          <p className="fontbold text-green-100 md:text-2xl">
            This is the content for The Foundation section.
          </p>
        </AccordionItem>
        <AccordionItem
          title={`"They struggle with making choices / I'm terrified of making the wrong move."`}
          className="text-white "
        >
          <p className="fontbold text-green-100 md:text-2xl">
            This is the content for The Foundation section.
          </p>
        </AccordionItem>
        <AccordionItem
          subcolor={'#6cbb01'}
          title={`"They lack motivation and direction for the future."`}
          className="text-white "
        >
          <p className="fontbold text-green-100 md:text-2xl">
            This is the content for The Foundation section.
          </p>
        </AccordionItem>
        <AccordionItem
          subcolor={'#6cbb01'}
          title={`"They lack motivation and direction for the future."`}
          className="text-white  border-none"
        >
          <h3 className="fontbold text-green-100 text-2xl">
            This is the content for The Foundation section.
          </h3>
        </AccordionItem>
      </div>
    </div>
  );
}
