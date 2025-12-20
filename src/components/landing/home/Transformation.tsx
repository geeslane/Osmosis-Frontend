import AccordionItem from '@/components/ui/accordion/AccordionItem';
import React from 'react';

export default function Transformation() {
  return (
    <div className="max-w-[806px] mx-auto px-8 md:px-6 py-12 md:py-20">
      <div className="w-full  font-montserrat montserrat  flex flex-col justify-center gap-6 md:gap-8">
        <h3 className="text-green-200 text-[26px] leading-8 max-w-[555px]  md:leading-14 md:text-5xl font-bold">
          Your Teen&#39;s 3-Month Transformation Journey{' '}
        </h3>
        <h3 className="text-green-200 md:text-xl">
          This isn&#39;t just another online course. It&#39;s a high-touch,
          interactive experience designed for deep, lasting change.
        </h3>
        <div>
          <AccordionItem className="" title="The Foundation">
            Discovering Their Core Identity. They start by looking inward to
            build an unshakeable foundation of self-awareness. They&#39;ll
            define their values, identify their unique strengths, and craft a
            personal mission statement that will act as their North Star.{' '}
          </AccordionItem>
          <AccordionItem title="The Framework">
            Building Tools for Life. With a clear identity, they&#39;ll build
            the practical skills to navigate the world. This includes expert-led
            masterclasses on habit formation, effective communication, emotional
            resilience, and even the basics of financial literacy.{' '}
          </AccordionItem>
          <AccordionItem className="border-none" title="The Launchpad">
            Leading Their Own Future Finally, they turn their vision into a
            plan. They&#39;ll learn the principles of self-leadership, time
            management, and goal setting, culminating in a 5-year personal
            growth plan they can start executing on day one.{' '}
          </AccordionItem>
        </div>
      </div>
    </div>
  );
}
