'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import type { Module } from '@/components/types';
import Note from './Note';
import Workbook from './Workbook';
import Deliverable from './Deliverable';
import AdditionalResources from './AdditionalResources';

type ModuleContentProps = {
  module: Module | undefined;
};

export default function ModuleContent({ module }: ModuleContentProps) {
  const searchParams = useSearchParams();
  const content = searchParams.get('content') || 'Note';

  switch (content) {
    case 'Note':
      return (
        <div className="w-full max-w-full min-w-0">
          <Note notes={module?.notes} title={module?.title} />
        </div>
      );
    case 'Workbook':
      return (
        <div className="w-full max-w-full min-w-0">
          <Workbook title={module?.title} workbookFile={module?.workbookFile} />
        </div>
      );
    case 'Deliverable':
      return (
        <div className="w-full max-w-full min-w-0">
          <Deliverable
            deliverables={module?.deliverables}
            title={module?.title}
          />
        </div>
      );
    case 'Additional':
      return (
        <div className="w-full max-w-full min-w-0">
          <AdditionalResources
            additionalResources={module?.additionalResources}
            title={module?.title}
          />
        </div>
      );
    default:
      return (
        <div className="w-full max-w-full min-w-0">
          <Note notes={module?.notes} title={module?.title} />
        </div>
      );
  }
}
