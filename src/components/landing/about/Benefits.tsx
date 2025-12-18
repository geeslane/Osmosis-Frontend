import AccordionItem from '@/components/ui/accordion/AccordionItem';
import React from 'react';

export default function Benefits() {
  return (
    <div className="bg-green-200 montserrat flex px-6 flex-col items-center justify-center py-[120px]">
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
          <p className=" max-w-[600px] text-green-100">
            The overwhelming pressure to have it all figured out leads to
            anxiety and a fragile sense of self.{' '}
          </p>
        </AccordionItem>
        <AccordionItem
          title={`"They struggle with making choices / I'm terrified of making the wrong move."`}
          className="text-white "
        >
          <p className=" max-w-[600px] text-green-100">
            From big life decisions to daily habits, indecision creates stress
            and inaction.
          </p>
        </AccordionItem>
        <AccordionItem
          subcolor={'#6cbb01'}
          title={`"They lack motivation and direction for the future."`}
          className="text-white "
        >
          <p className=" max-w-[600px] text-green-100">
            The path after high school feels like a fog, leading to
            procrastination or a lack of ownership.
          </p>
        </AccordionItem>
        <AccordionItem
          subcolor={'#6cbb01'}
          title={`"They need positive role models outside the family."`}
          className="text-white  border-none"
        >
          <p className=" max-w-[600px] text-green-100">
            They feel alone in their struggles and are heavily influenced by
            their immediate peer circle.
          </p>
        </AccordionItem>
      </div>
    </div>
  );
}
