'use client';

import {
  AdditionalResources,
  DeliverableIcon,
  GoBackIcon,
  LoadingIcon,
  NoteIcon,
  WorkBookIcon,
} from '@/assets/icons';
import Tabs from '@/components/ui/Tabs';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import PageTitle from '@/components/PageTitle';
import {
  useGetModuleByIdQuery,
  useGetTeenagerModulesProgressQuery,
} from '@/store/dashboard/dashboard.api';
import type { Module } from '@/components/types';
import { progressByModuleId } from '@/utils/teenagerModuleProgress';
import Note from '@/components/dashboard/modules/ModuleDetails/Note';
import Workbook from '@/components/dashboard/modules/ModuleDetails/Workbook';
import AdditionalResourcesView from '@/components/dashboard/modules/ModuleDetails/AdditionalResources';
import MenteeDeliverableTab from './MenteeDeliverableTab';
import Animated from '@/components/common/Animation';

const MENTEE_MODULES_PATH = (menteeId: string) =>
  `/dashboard/users/mentee/${menteeId}/modules`;

export default function MenteeModuleDetail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams<{ id: string; moduleId: string }>();
  const menteeId = typeof params.id === 'string' ? params.id : params.id?.[0] ?? '';
  const moduleId = typeof params.moduleId === 'string' ? params.moduleId : params.moduleId?.[0] ?? '';
  const { data, isLoading } = useGetModuleByIdQuery(moduleId, {
    skip: !moduleId,
  });
  const { data: progressRows = [] } = useGetTeenagerModulesProgressQuery(
    menteeId,
    { skip: !menteeId }
  );
  const user = useSelector((state: RootState) => state.profile.user);
  const isTeenViewer = user?.role === 'TEENAGER';
  const progressMap = progressByModuleId(progressRows);
  const submissionForModule = moduleId
    ? progressMap.get(moduleId)?.submissionAnswer ?? null
    : null;

  const moduleData = data?.data?.data;
  const currentTab = searchParams.get('content') || 'Note';

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoadingIcon
          width="40"
          height="40"
          className="animate-spin text-green-100"
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[900px]">
      <div className="flex justify-between max-w-[639px]">
        <button
          type="button"
          onClick={() => router.push(MENTEE_MODULES_PATH(menteeId))}
          className="flex cursor-pointer items-center gap-1"
        >
          <GoBackIcon />
          <h3 className="text-sm text-green-200 font-medium">Back</h3>
        </button>
      </div>

      <Tabs
        containerClassName="w-full max-w-[639px] mt-10"
        paramKey="content"
        defaultValue="Note"
        tabs={[
          { title: 'Note', value: 'Note', icon: <NoteIcon /> },
          { title: 'Workbook', value: 'Workbook', icon: <WorkBookIcon /> },
          {
            title: 'Deliverable',
            value: 'Deliverable',
            icon: <DeliverableIcon />,
          },
          {
            title: 'Additional Resources',
            value: 'Additional',
            icon: <AdditionalResources />,
          },
        ]}
      />

      <div className="mt-2 max-w-[639px]">
        <div className="space-y-[37px] mt-6">
          <PageTitle
            title={
              moduleData
                ? `Module ${moduleData.moduleNumber}: ${moduleData.title}`
                : 'Module'
            }
          />

          <Animated
            activeKey={currentTab}
            className="rounded-lg flex min-h-[400px] w-full max-w-[639px] flex-col md:flex-row gap-10 border border-[#6CBB0180] px-10 md:px-[64px] py-8 overflow-x-hidden"
          >
            <MenteeModuleContent
              module={moduleData}
              menteeId={menteeId}
              moduleId={moduleId}
              deliverableReadOnly={!isTeenViewer}
              deliverableInitialSubmission={submissionForModule}
            />
          </Animated>
        </div>
      </div>
    </div>
  );
}

function MenteeModuleContent({
  module,
  menteeId,
  moduleId,
  deliverableReadOnly,
  deliverableInitialSubmission,
}: {
  module: Module | undefined;
  menteeId: string;
  moduleId: string;
  deliverableReadOnly: boolean;
  deliverableInitialSubmission: string | null | undefined;
}) {
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
          <MenteeDeliverableTab
            title={module?.title}
            deliverables={module?.deliverables}
            menteeId={menteeId}
            moduleId={moduleId}
            readOnly={deliverableReadOnly}
            initialSubmission={deliverableInitialSubmission}
          />
        </div>
      );
    case 'Additional':
      return (
        <div className="w-full max-w-full min-w-0">
          <AdditionalResourcesView
            title={module?.title}
            additionalResources={module?.additionalResources}
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
