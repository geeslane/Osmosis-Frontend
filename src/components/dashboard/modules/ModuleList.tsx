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

export default function ModuleList({ modules }: { modules: Module[] }) {
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

  return (
    <div className="max-full font-montserrat mt-8 montserrat mx-auto space-y-6">
      {modules.map((module) => (
        <div
          key={module.id}
          role="button"
          tabIndex={0}
          onClick={() => router.push(`/dashboard/modules/${module.id}`)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              router.push(`/dashboard/modules/${module.id}`);
            }
          }}
          className="flex flex-col gap-5 border-b px-5 border-green-100 pb-4 cursor-pointer hover:bg-green-50/50 transition-colors rounded-md"
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
                <button
                  onClick={() => router.push(`/dashboard/modules/${module.id}`)}
                  className="bg-green-200 text-white px-2 md:px-6 py-3 rounded-md text-xs font-medium"
                >
                  View Module
                </button>
                {user?.role !== 'TEENAGER' && (
                  <button
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
      ))}
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
