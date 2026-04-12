'use client';

import React from 'react';

type WelcomeSectionProps = {
  title: string;
  subtitle?: string;
  /** Optional badge or brand name e.g. "Teenagers Lab" */
  badge?: string;
  className?: string;
};

export default function WelcomeSection({ title, subtitle, badge, className = '' }: WelcomeSectionProps) {
  return (
    <section className={`rounded-2xl bg-gradient-to-br from-[#0a2e1a] to-[#0d3d21] text-white p-6 sm:p-8 md:p-10 shadow-lg min-w-0 ${className}`}>
      {badge && (
        <span className="inline-block text-xs font-semibold uppercase tracking-wider text-green-300/90 mb-3">
          {badge}
        </span>
      )}
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">{title}</h1>
      {subtitle && <p className="mt-2 text-white/85 text-sm md:text-base max-w-xl">{subtitle}</p>}
    </section>
  );
}
