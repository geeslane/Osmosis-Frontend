'use client';
import { FaqArrow } from '@/assets/icons';
import { ReactNode, useState } from 'react';

interface AccordionItemProps {
  title: string;
  children: ReactNode;
  className?: string;
  subcolor?: string;
}

export default function AccordionItem({
  title,
  children,
  className = '',
  subcolor = '#0A2A20',
}: AccordionItemProps) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div
      className={`group ${className} border-b border-green-100 py-4 cursor-pointer`}
    >
      {/* Header */}
      <div
        onClick={() => setOpen(!open)}
        className="flex justify-between items-center select-none"
      >
        <h3 className="text-bases  font-medium text-green-200">{title}</h3>

        <FaqArrow
          className={`
            transition-all duration-300 w-20
            ${open ? '-rotate-180 ' : 'rotate-0 translate-x-0'}
          `}
        />
      </div>

      {/* Content */}
      <div
        className={`
          max-h-0 opacity-0 overflow-hidden
          transition-all duration-300
          ${open ? 'max-h-40 mt-3 opacity-100' : ''}
        `}
      >
        <div className={`text-[${subcolor}]`}>{children}</div>
      </div>
    </div>
  );
}
