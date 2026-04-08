'use client';

import Link from 'next/link';
import React from 'react';

type ReminderCardProps = {
  title: string;
  description: string;
  href: string;
  linkLabel: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'highlight';
  className?: string;
};

export default function ReminderCard({
  title,
  description,
  href,
  linkLabel,
  icon,
  variant = 'default',
  className = '',
}: ReminderCardProps) {
  const isHighlight = variant === 'highlight';
  return (
    <div
      className={`rounded-xl border p-4 sm:p-5 transition-shadow hover:shadow-md min-w-0 ${
        isHighlight
          ? 'border-amber-200 bg-amber-50/60'
          : 'border-gray-200 bg-white'
      } ${className}`}
    >
      <div className="flex gap-3 sm:gap-4">
        {icon && (
          <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
            isHighlight ? 'bg-amber-100 text-amber-700' : 'bg-green-50 text-green-200'
          }`}>
            {icon}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className={`font-semibold ${isHighlight ? 'text-amber-900' : 'text-[#101828]'}`}>
            {title}
          </h3>
          <p className="mt-1 text-sm text-gray-600">{description}</p>
          <Link
            href={href}
            className={`inline-block mt-3 text-sm font-medium ${
              isHighlight ? 'text-amber-700 hover:text-amber-800' : 'text-green-200 hover:text-green-300'
            }`}
          >
            {linkLabel} →
          </Link>
        </div>
      </div>
    </div>
  );
}
