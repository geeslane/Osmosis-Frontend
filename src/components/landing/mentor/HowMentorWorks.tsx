import AccordionItem from '@/components/ui/accordion/AccordionItem';
import React from 'react';

export default function HowMentorWorks() {
  return (
    <div className="max-w-[880px] montserrat  flex flex-col gap-14 mx-auto w-full py-[120px]">
      <h3 className="font-montserrat text-green-100 montserrat text-[24px] md:leading-14   md:text-[48px]   font-bold  lg:text-start text-center  ">
        How The Mentorship Works{' '}
      </h3>
      <div className="px-6">
        <AccordionItem className="" title="Application">
          Submit your mentor application and share your areas of expertise.{' '}
        </AccordionItem>
        <AccordionItem title="Screening & Interview">
          We assess your experience, passion, and fit for supporting teenagers.{' '}
        </AccordionItem>
        <AccordionItem title="Mentor Agreement">
          mentors get to sign our mentor agreement to align with our code of
          conduct.{' '}
        </AccordionItem>
        <AccordionItem title="Onboarding">
          Receive training, mentoring guidelines, and access to the mentor
          platform.{' '}
        </AccordionItem>
        <AccordionItem title="Set Your Topics & Availability">
          Choose 2–3 topics you want to mentor teenagers on. Upload your
          calendar and set your preferred time slots for mentoring sessions.{' '}
        </AccordionItem>
        <AccordionItem title="Teenagers Schedule You Directly">
          Teenagers browse mentors by topic and availability. They schedule
          one-on-one sessions with you only during the time slots you have made
          available.{' '}
        </AccordionItem>
        <AccordionItem title="Mentoring Cycle (3 Months)">
          Provide guidance for 2–4 hours per month, depending on your selected
          topics, and support teens through conversations, clarity-building, and
          personal development.{' '}
        </AccordionItem>
        <AccordionItem
          className="border-none"
          title="Completion & Impact Report"
        >
          View your real-time impact and contribution report through your mentor
          dashboard.{' '}
        </AccordionItem>
      </div>
    </div>
  );
}
