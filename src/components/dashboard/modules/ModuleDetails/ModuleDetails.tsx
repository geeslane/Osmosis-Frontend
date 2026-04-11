'use client';

import {
  AdditionalResources,
  DeliverableIcon,
  EditIcon,
  GoBackIcon,
  LoadingIcon,
  NoteIcon,
  WorkBookIcon,
} from '@/assets/icons';
import Tabs from '@/components/ui/Tabs';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import ModuleContent from './ModuleContent';
import Link from 'next/link';
import PageTitle from '@/components/PageTitle';
import {
  useGetModuleByIdQuery,
  useGetTeenagerModulesProgressQuery,
  useSetTeenagerModuleCompletionMutation,
} from '@/store/dashboard/dashboard.api';
import Button from '@/components/ui/button/Button';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import Animated from '@/components/common/Animation';
import useToastify from '@/hooks/useToastify';

export default function ModuleDetails() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams<{ id: string }>();
  const user = useSelector((state: RootState) => state.profile.user);
  const { showToast } = useToastify();
  const [deliverableSubmitted, setDeliverableSubmitted] = useState(false);
  const [markedCompleted, setMarkedCompleted] = useState(false);
  const id = typeof params.id === 'string' ? params.id : (params.id?.[0] ?? '');
  const teenId = user?.id != null ? String(user.id) : '';
  const { data, isLoading } = useGetModuleByIdQuery(id, { skip: !id });
  const { data: progressRows = [], isLoading: loadingProgress } =
    useGetTeenagerModulesProgressQuery(teenId, {
      skip: !teenId || user?.role !== 'TEENAGER',
    });
  const [setCompletion, { isLoading: completing }] =
    useSetTeenagerModuleCompletionMutation();
  const backPath =
    user?.role === 'TEENAGER'
      ? '/dashboard/modules/mentee'
      : '/dashboard/modules';
  const moduleData = data?.data?.data;
  const currentTab = searchParams.get('content') || 'Note';
  const isMentee = user?.role === 'TEENAGER';

  const completedFromProgress = useMemo(() => {
    const row = progressRows.find((p) => p.moduleId === id);
    return row?.completed === true;
  }, [progressRows, id]);

  useEffect(() => {
    setMarkedCompleted(
      Boolean(moduleData?.markedCompleted) || completedFromProgress
    );
  }, [moduleData?.markedCompleted, moduleData?.id, completedFromProgress, id]);

  const handleMarkCompleted = async () => {
    if (!id) return;
    try {
      await setCompletion({ moduleId: id, completed: true }).unwrap();
      setMarkedCompleted(true);
      showToast('Module marked as completed', 'success');
    } catch {
      showToast('Could not mark this module complete. Please try again.', 'error');
    }
  };

  const handleMarkIncomplete = async () => {
    if (!id) return;
    try {
      await setCompletion({ moduleId: id, completed: false }).unwrap();
      setMarkedCompleted(false);
      showToast('Module marked as incomplete.', 'success');
    } catch {
      showToast('Could not update completion status. Please try again.', 'error');
    }
  };

  if (isLoading || (isMentee && loadingProgress)) {
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
    <div>
      <div className="flex justify-between items-center gap-4 max-w-[639px] flex-wrap">
        <Link
          href={backPath}
          className="flex cursor-pointer items-center gap-1 shrink-0"
        >
          <GoBackIcon />
          <h3 className="text-sm text-green-200 font-medium">Back</h3>
        </Link>
        {isMentee ? (
          <div className="flex items-center gap-3 shrink-0">
            <p className="text-sm text-gray-700 hidden sm:inline">
              When you&apos;re done, mark as completed.
            </p>
            {markedCompleted ? (
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-xs font-bold">
                    ✓
                  </span>
                  Completed
                </span>
                <button
                  type="button"
                  onClick={() => void handleMarkIncomplete()}
                  disabled={completing}
                  className="text-sm font-medium text-gray-600 underline underline-offset-2 hover:text-gray-800 disabled:opacity-50"
                >
                  {completing ? 'Saving…' : 'Mark as incomplete'}
                </button>
              </div>
            ) : (
              <Button
                onClick={() => void handleMarkCompleted()}
                disabled={completing}
                className="bg-green-200 text-white px-4 py-2 rounded-xl text-sm font-medium"
              >
                {completing ? 'Saving…' : 'Mark as completed'}
              </Button>
            )}
          </div>
        ) : user?.role !== 'TEENAGER' ? (
          <Button
            variant="primary"
            className="font-medium flex gap-1 shrink-0"
            onClick={() =>
              router.push(
                moduleData
                  ? `/dashboard/modules/${moduleData.id}/edit?content=${currentTab}`
                  : '/dashboard/modules'
              )
            }
          >
            <EditIcon />
            <h3 className="hidden md:flex mr-2">Edit Module</h3>
          </Button>
        ) : null}
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
            title={moduleData ? `Module ${moduleData.moduleNumber}` : 'Module'}
          />

          <Animated
            activeKey={'params'}
            className="rounded-lg flex min-h-[400px] w-full max-w-[639px] flex-col md:flex-row gap-10 border border-[#6CBB0180] px-10 md:px-[64px] py-8 overflow-x-hidden"
          >
            <ModuleContent
              module={moduleData}
              onDeliverableSubmitted={isMentee ? () => setDeliverableSubmitted(true) : undefined}
            />
          </Animated>
        </div>
      </div>
    </div>
  );
}
