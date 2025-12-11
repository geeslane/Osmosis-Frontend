import AccordionItem from '@/components/ui/accordion/AccordionItem';
import React from 'react';

export default function HowMentorWorks() {
  return (
    <div className="max-w-[880px]  flex flex-col gap-14 mx-auto w-full py-[120px]">
      <h3 className="font-montserrat text-green-100 montserrat text-[24px] md:leading-14   md:text-[48px]   font-bold  lg:text-start text-center  ">
        What Our Mentoring Looks Like{' '}
      </h3>
      <div className="px-6">
        <AccordionItem className="" title="Application">
          This is the content for The Foundation section.
        </AccordionItem>
        <AccordionItem title="Screening & Interview">
          This is the content for The Foundation section.
        </AccordionItem>
        <AccordionItem title="Mentor Agreement">
          This is the content for The Foundation section.
        </AccordionItem>
        <AccordionItem title="Onboarding">
          This is the content for The Foundation section.
        </AccordionItem>
        <AccordionItem title="Set Your Topics & Availability">
          This is the content for The Foundation section.
        </AccordionItem>
        <AccordionItem title="Teenagers Schedule You Directly">
          This is the content for The Foundation section.
        </AccordionItem>
        <AccordionItem title="Mentoring Cycle (3 Months)">
          This is the content for The Foundation section.
        </AccordionItem>
        <AccordionItem
          className="border-none"
          title="Completion & Impact Report"
        >
          This is the content for The Foundation section.
        </AccordionItem>
      </div>
    </div>
  );
}
