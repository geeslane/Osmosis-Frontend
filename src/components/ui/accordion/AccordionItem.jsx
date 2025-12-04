'use client';
import { AccordionIcon } from '@/assets/icons';

export default function AccordionItem({
  title,
  children,
  className = '',
  subcolor = '#0A2A20',
}) {
  return (
    <div
      className={`group ${className} border-b border-green-100 py-4 cursor-pointer `}
    >
      {/* Header */}
      <div className="flex justify-between items-center select-none">
        <h3
          className={`${className} text-lg md:text-2xl font-semibold text-green-200`}
        >
          {title}
        </h3>
        <AccordionIcon
          className={`
            transition-all duration-300
            rotate-0 translate-x-0
            group-hover:-rotate-90 group-hover:-translate-x-[200px]
          `}
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
        <h3 className={`text-[${subcolor}]`}>{children}</h3>
      </div>
    </div>
  );
}
