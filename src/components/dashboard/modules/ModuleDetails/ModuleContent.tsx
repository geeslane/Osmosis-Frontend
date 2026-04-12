'use client';

import React from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import type { Module } from '@/components/types';
import Note from './Note';
import Workbook from './Workbook';
import Deliverable from './Deliverable';
import AdditionalResources from './AdditionalResources';
import MenteeDeliverableTab from '@/components/dashboard/users/mentee/MenteeDeliverableTab';

type ModuleContentProps = {
  module: Module | undefined;
  /** Called when mentee submits deliverable answers (parent shows "Mark as completed" bar) */
  onDeliverableSubmitted?: () => void;
};

export default function ModuleContent({ module, onDeliverableSubmitted }: ModuleContentProps) {
  const searchParams = useSearchParams();
  const params = useParams<{ id: string }>();
  const user = useSelector((state: RootState) => state.profile.user);
  const content = searchParams.get('content') || 'Note';
  const moduleId = typeof params?.id === 'string' ? params.id : params?.id?.[0];
  const isMentee = user?.role === 'TEENAGER';

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
          {isMentee ? (
            <MenteeDeliverableTab
              title={module?.title}
              deliverables={module?.deliverables}
              moduleId={moduleId}
              onAnswersSubmitted={onDeliverableSubmitted}
            />
          ) : (
            <Deliverable
              deliverables={module?.deliverables}
              title={module?.title}
            />
          )}
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
