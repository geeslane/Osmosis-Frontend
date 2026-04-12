'use client';

import { GoBackIcon, LoadingIcon } from '@/assets/icons';
import { useParams, useRouter } from 'next/navigation';
import { useGetTeenagerByIdQuery } from '@/store/users/users.api';
import {
  DEFAULT_MODULE_LIST_SORT,
  useGetTeenagerModulesProgressQuery,
  useModulesQuery,
} from '@/store/dashboard/dashboard.api';
import type { Module } from '@/components/types';
import ProgressGauge from '@/components/ui/Progress/ProgressGauge';
import { progressByModuleId } from '@/utils/teenagerModuleProgress';

const MENTEE_DETAIL_PATH = (id: string) =>
  `/dashboard/users/mentee/${id}`;

export default function MenteeModulesList() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: menteeData, isLoading: isLoadingMentee } =
    useGetTeenagerByIdQuery(id as string);
  const { data: modulesData, isLoading: isLoadingModules } =
    useModulesQuery(DEFAULT_MODULE_LIST_SORT);
  const { data: progressRows = [], isLoading: loadingProgress } =
    useGetTeenagerModulesProgressQuery(id as string, { skip: !id });

  const mentee = menteeData?.data;
  const modules: Module[] = modulesData?.data?.data ?? [];
  const progressMap = progressByModuleId(progressRows);

  const moduleProgress = modules.map((m) => {
    const p = progressMap.get(m.id);
    const progress =
      typeof p?.progress === 'number' ? Math.min(100, Math.max(0, p.progress)) : 0;
    const completed = Boolean(p?.completed);
    const deliverableSubmitted = Boolean(p?.deliverableSubmitted);
    const deliverableStatus: 'Complete' | 'Incomplete' =
      completed || deliverableSubmitted ? 'Complete' : 'Incomplete';
    return {
      ...m,
      progress,
      deliverableStatus,
    };
  });

  const overallProgress =
    moduleProgress.length > 0
      ? Math.round(
          moduleProgress.reduce((a, b) => a + b.progress, 0) /
            moduleProgress.length
        )
      : 0;

  if (isLoadingMentee || isLoadingModules || loadingProgress) {
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

  if (!mentee) return <div>No mentee found</div>;

  const displayName = mentee.teenagerFullName?.trim() || 'Mentee';

  return (
    <div className="w-full max-w-[900px]">
      <div className="flex flex-col gap-6 md:gap-8">
        {/* Back + Header */}
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={() => router.push(MENTEE_DETAIL_PATH(id as string))}
            className="flex items-center gap-2 text-green-200 font-medium hover:opacity-80 transition-opacity shrink-0"
            type="button"
          >
            <GoBackIcon />
            <span className="text-sm">Back</span>
          </button>
          <div className="flex-1">
            <h2 className="text-green-200 text-[22px] md:text-2xl font-bold">
              Module Progress for {displayName}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Click a module to view notes, workbook, deliverables, and resources.
            </p>
          </div>
        </div>

        {/* Progress overview */}
        <div className="rounded-xl border border-[#6CBB0180] bg-[#F7FDF2] p-6 flex flex-col sm:flex-row gap-6 items-center">
          <div className="shrink-0">
            <ProgressGauge percentage={overallProgress} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-green-200">
              Overall Progress
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {overallProgress}% completed across {modules.length} module
              {modules.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Module list */}
        <div className="rounded-xl border border-[#6CBB0180] overflow-hidden">
          <div className="bg-[#DCFFAD91] px-2 md:px-6 py-3">
            <h3 className="text-base font-semibold text-green-200">
              Modules
            </h3>
          </div>
          <div className="divide-y divide-gray-100">
            {modules.length === 0 ? (
              <div className="px-6 py-12 text-center text-gray-500">
                No modules assigned yet.
              </div>
            ) : (
              moduleProgress.map((row) => (
                <div
                  key={row.id}
                  role="button"
                  tabIndex={0}
                  onClick={() =>
                    router.push(
                      `/dashboard/users/mentee/${id}/modules/${row.id}`
                    )
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      router.push(
                        `/dashboard/users/mentee/${id}/modules/${row.id}`
                      );
                    }
                  }}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 px-4 md:px-6 py-4 hover:bg-green-50/50 transition-colors cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-green-200">
                      Module {row.moduleNumber}: {row.title}
                    </p>
                    <div className="mt-2 max-w-[280px]">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>{row.progress}% completed</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-lime-100">
                        <div
                          className="h-2 rounded-full bg-lime-600 transition-all"
                          style={{ width: `${row.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                        row.deliverableStatus === 'Complete'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-amber-100 text-amber-600'
                      }`}
                    >
                      {row.deliverableStatus}
                    </span>
                    <span className="text-sm text-gray-500">View →</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
