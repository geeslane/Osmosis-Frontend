'use client';

import React from 'react';

type StatCardProps = {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  className?: string;
};

export default function StatCard({ label, value, icon, className = '' }: StatCardProps) {
  return (
    <div
      className={`rounded-xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow min-w-0 ${className}`}
    >
      {icon && <div className="mb-2 sm:mb-3 text-green-200">{icon}</div>}
      <p className="text-xl sm:text-2xl md:text-3xl font-bold text-[#101828]">{value}</p>
      <p className="mt-1 text-sm font-medium text-gray-500">{label}</p>
    </div>
  );
}
