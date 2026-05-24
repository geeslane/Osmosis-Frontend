'use client';
import { useRouter } from 'next/navigation';
import type { Module } from '@/components/types';
import useToastify from '@/hooks/useToastify';
import { useDeleteModuleMutation } from '@/store/dashboard/dashboard.api';
import { useState } from 'react';
import DeleteModal from '@/components/ui/modal/DeleteModal/DeleteModal';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import ModuleDateRange from '@/components/dashboard/modules/ModuleDateRange';
import type { TeenagerModuleAccess } from '@/utils/teenagerModuleProgress';

type ModuleListProps = {
  modules: Module[];
  /** When set (teenager modules page), gates View Module and row navigation. */
  teenModuleAccess?: Map<string, TeenagerModuleAccess>;
};

export default function ModuleList({
  modules,
  teenModuleAccess,
}: ModuleListProps) {
  const router = useRouter();
  const { showToast } = useToastify();
  const [deleteModule, { isLoading }] = useDeleteModuleMutation();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const user = useSelector((state: RootState) => state.profile.user);
  const isMentee = user?.role === 'TEENAGER';

  const openDeleteModal = (id: string) => {
    setSelectedModuleId(id);
    setIsDeleteOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteOpen(false);
    setSelectedModuleId(null);
  };

  const handleDelete = async () => {
    if (!selectedModuleId) return;
    try {
      await deleteModule(selectedModuleId).unwrap();
      showToast('Module deleted successfully', 'success');
      closeDeleteModal();
    } catch (err: any) {
      showToast(err?.data?.message || 'Failed to delete module', 'error');
    }
  };

  const navigateToModule = (moduleId: string, canView: boolean) => {
    if (isMentee && teenModuleAccess && !canView) return;
    router.push(`/dashboard/modules/${moduleId}`);
  };

  return (
    <div className="max-full font-montserrat mt-8 montserrat mx-auto space-y-6">
      {modules.map((module) => {
        const access = teenModuleAccess?.get(module.id);
        const canView = !isMentee || !teenModuleAccess || access?.canView !== false;
        const disabledReason =
          isMentee && teenModuleAccess && !canView
            ? access?.disabledReason ?? 'This module is not available yet.'
            : null;

        return (
          <div
            key={module.id}
            role={canView ? 'button' : undefined}
            tabIndex={canView ? 0 : undefined}
            onClick={() => navigateToModule(module.id, canView)}
            onKeyDown={(e) => {
              if (!canView) return;
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navigateToModule(module.id, true);
              }
            }}
            className={`flex flex-col gap-5 border-b px-5 border-green-100 pb-4 rounded-md transition-colors ${
              canView
                ? 'cursor-pointer hover:bg-green-50/50'
                : 'cursor-default opacity-95'
            }`}
          >
            <div className="flex flex-col gap-3 ">
              <div className="flex flex-col gap-3 md:flex-row justify-between md:items-center w-full">
                <div className="flex items-center gap-3 min-w-0">
                  {isMentee && (
                    <span
                      className="flex shrink-0 items-center"
                      onClick={(e) => e.stopPropagation()}
                      title={
                        module.markedCompleted
                          ? 'Marked as Completed'
                          : 'Not completed yet'
                      }
                      role="img"
                      aria-label={
                        module.markedCompleted
                          ? 'Module completed'
                          : 'Module not completed'
                      }
                    >
                      {module.markedCompleted ? (
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-green-200 text-white text-[11px] font-bold leading-none shadow-sm ring-2 ring-[#DCFFAD]/80">
                          ✓
                        </span>
                      ) : (
                        <span
                          className="inline-block h-5 w-5 rounded-md border-2 border-gray-300 bg-white shrink-0"
                          aria-hidden
                        />
                      )}
                    </span>
                  )}
                  <div>
                    <h2 className="font-bold  text-green-300">
                      Module {module.moduleNumber}:
                      <span className="font-medium"> {module.title}</span>
                    </h2>
                    <ModuleDateRange
                      startDate={module.startDate}
                      endDate={module.endDate}
                    />
                  </div>
                </div>
                <div className="flex gap-3" onClick={(e) => e.stopPropagation()}>
                  <span
                    className="inline-block"
                    title={disabledReason ?? undefined}
                  >
                    <button
                      type="button"
                      disabled={!canView}
                      onClick={() => navigateToModule(module.id, canView)}
                      className={`bg-green-200 text-white px-2 md:px-6 py-3 rounded-md text-xs font-medium ${
                        canView
                          ? 'hover:opacity-95'
                          : 'cursor-not-allowed opacity-50'
                      }`}
                      aria-disabled={!canView}
                    >
                      View Module
                    </button>
                  </span>
                  {user?.role !== 'TEENAGER' && (
                    <button
                      type="button"
                      onClick={() => openDeleteModal(module.id)}
                      className="bg-green-100 text-white px-2 md:px-6 py-3 rounded-md text-xs font-medium"
                    >
                      Remove Module
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
      <DeleteModal
        isOpen={isDeleteOpen}
        title="Delete Module "
        description="This module will be permanently deleted. This action cannot be undone."
        isLoading={isLoading}
        onCancel={closeDeleteModal}
        onConfirm={handleDelete}
      />
    </div>
  );
}
