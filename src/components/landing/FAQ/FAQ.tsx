'use client';
import FaqAccordion from '@/components/ui/accordion/FaqAccordion';
import Image from 'next/image';

export default function FAQ() {
  return (
    <div className="flex h-full flex-col overflow-x-hidden">
      <div className="relative flex font-montserrat montserrat items-start pt-[48px] justify-between overflow-x-hidden">
        <Image
          src={'/image/Oval.png'}
          alt="Oval"
          width={250}
          height={238}
          className="absolute -left-10 md:left-0 top-[48px] lg:relative lg:top-0"
        />
        <div className="w-full px-8 max-w-[1100px] my-10 md:mt-24  mx-auto flex flex-col gap-4 md:gap-8 relative z-10">
          <h3 className="font-montserrat text-green-200 montserrat text-[24px]  md:text-[40px] leading-9  font-bold md:leading-18 text-start">
            Questions we get the most{' '}
          </h3>
          <div className="mb-10 ">
            <FaqAccordion title={`1. What is Osmosis?`} className="text-white">
              <p className="fontbold text-green-100 md:text-2xl">
                This is the content for The Foundation section.
              </p>
            </FaqAccordion>
            <FaqAccordion
              title={`2. Who are the mentors?`}
              className="text-white"
            >
              <p className="fontbold text-green-100 text-sm">
                This is the content for The Foundation section.
              </p>
            </FaqAccordion>
            <FaqAccordion
              title={`3. How does the 16-week program work?`}
              className="text-white"
            >
              <p className="fontbold text-green-100 text-sm">
                This is the content for The Foundation section.
              </p>
            </FaqAccordion>
            <FaqAccordion
              title={`4. Is the program safe?`}
              className="text-white"
            >
              <p className="fontbold text-green-100 text-sm">
                This is the content for The Foundation section.
              </p>
            </FaqAccordion>
            <FaqAccordion
              title={`5. Who can join the program?`}
              className="text-white"
            >
              <p className="fontbold text-green-100 text-sm">
                This is the content for The Foundation section.
              </p>
            </FaqAccordion>
            <FaqAccordion
              title={`6. How are teens matched with mentors?`}
              className="text-white"
            >
              <p className="fontbold text-green-100 text-sm">
                This is the content for The Foundation section.
              </p>
            </FaqAccordion>
            <FaqAccordion
              title={`7. Do parents get updates?`}
              className="text-white"
            >
              <p className="fontbold text-green-100 text-sm">
                This is the content for The Foundation section.
              </p>
            </FaqAccordion>
            <FaqAccordion
              title={`8. What happens after the 16 weeks?`}
              className="text-white"
            >
              <p className="fontbold text-green-100 text-sm">
                This is the content for The Foundation section.
              </p>
            </FaqAccordion>
          </div>
        </div>
        <Image
          src={'/image/Oval2.png'}
          alt="Oval"
          width={250}
          height={238}
          className="absolute -right-10 md:right-0 top-[48px] lg:relative lg:top-0"
        />
      </div>
    </div>
  );
}
