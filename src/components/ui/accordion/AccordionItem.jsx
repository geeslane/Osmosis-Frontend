'use client';
import { AccordionIcon } from '@/assets/icons';

export default function AccordionItem({ title, children }) {
  return (
    <div className="group border-b border-green-100 py-4 cursor-pointer">
      {/* Header */}
      <div className="flex justify-between items-center select-none">
        <h3 className="text-lg md:text-2xl font-semibold text-green-200">
          {title}
        </h3>

        {/* Arrow animation */}
        <AccordionIcon
          className="
            transition-all duration-300
            rotate-0 translate-x-0
            group-hover:-rotate-90 group-hover:-translate-x-[200px]
          "
        />
      </div>

      {/* Content */}
      <div
        className="
          max-h-0 opacity-0 overflow-hidden
          transition-all duration-300
          group-hover:max-h-40 group-hover:mt-3 group-hover:opacity-100
        "
      >
        <p className="text-[#0A2A20]">{children}</p>
      </div>
    </div>
  );
}
