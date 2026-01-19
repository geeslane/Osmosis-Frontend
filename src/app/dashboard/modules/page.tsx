import { Module } from '@/assets/icons';
import Modules from '@/components/dashboard/modules/Modules';
import PageTitle from '@/components/PageTitle';
import { generateMetadata } from '@/utils/metadata';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = generateMetadata({
  title: 'Osmosis | Modules',
  description:
    'Instructor-led Osmosis modules designed for deep learning through structured live sessions, real-time explanations, interactive problem-solving, and guided Q&A.',
});

export default function page() {
  return (
    <div>
      <PageTitle title="Modules" />
      <div className="border-b-2 w-[141px] flex gap-2 items-center pb-3 border-green-100">
        <Module />
        <h3 className="text-green-300 font-medium">Module</h3>
      </div>
      <Modules />
    </div>
  );
}
