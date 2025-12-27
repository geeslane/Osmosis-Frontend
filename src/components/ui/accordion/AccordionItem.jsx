'use client';
import { AccordionIcon } from '@/assets/icons';
import { useState } from 'react';

export default function AccordionItem({
  title,
  children,
  className = '',
  subcolor = '#0A2A20',
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`group ${className} border-b border-green-100 py-8 cursor-pointer `}
    >
      {/* Header */}
      <div
        onClick={() => setOpen(!open)}
        className="flex justify-between  select-none"
      >
        <h3
          className={`${className} max-w-[300px] md:max-w-[659px]  text-bases md:text-2xl font-semibold text-green-200`}
        >
          {title}
        </h3>
        <AccordionIcon
          className={`
            transition-all duration-300 w-20
            
            ${
              open
                ? '-rotate-90 md:-translate-x-[50px]'
                : ' rotate-0 translate-x-0 '
            } `}
        />
      </div>

      {/* Content */}
      <div
        className={`
          max-h-0 opacity-0 overflow-hidden
          transition-all duration-300
          ${open ? 'max-h-40 mt-3 opacity-100' : ''}`}
      >
        <div className={`text-[${subcolor}]`}>{children}</div>
      </div>
    </div>
  );
}
