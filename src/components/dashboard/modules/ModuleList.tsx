'use client';
import { useRouter } from 'next/navigation';
import type { Module } from '@/components/types';
import useToastify from '@/hooks/useToastify';
import {
  useDeleteModuleMutation,
  useSetTeenagerModuleCompletionMutation,
} from '@/store/dashboard/dashboard.api';
import { useState, useEffect } from 'react';
import DeleteModal from '@/components/ui/modal/DeleteModal/DeleteModal';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

function daysToGo(endDateStr: string | undefined): number | null {
  if (!endDateStr || endDateStr.length < 10) return null;
  const end = new Date(endDateStr.slice(0, 10));
  if (Number.isNaN(end.getTime())) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  const diff = Math.ceil((end.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
  return diff < 0 ? 0 : diff;
}

function formatDate(s: string | undefined): string {
  if (!s || s.length < 10) return '';
  const d = new Date(s.slice(0, 10));
  if (Number.isNaN(d.getTime())) return s;
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function ModuleList({ modules }: { modules: Module[] }) {
  const router = useRouter();
  const { showToast } = useToastify();
  const [deleteModule, { isLoading }] = useDeleteModuleMutation();
  const [setCompletion] = useSetTeenagerModuleCompletionMutation();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [markedModuleIds, setMarkedModuleIds] = useState<Set<string>>(new Set());
  const [pendingModuleId, setPendingModuleId] = useState<string | null>(null);
  const user = useSelector((state: RootState) => state.profile.user);
  const isMentee = user?.role === 'TEENAGER';

  useEffect(() => {
    const completed = modules.filter((m) => m.markedCompleted).map((m) => m.id);
    setMarkedModuleIds(new Set(completed));
  }, [modules]);

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
                  <label
                    className="flex shrink-0 items-center cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                    title="Mark as completed when done with this module"
                  >
                    <input
                      type="checkbox"
                      checked={markedModuleIds.has(module.id)}
                      disabled={pendingModuleId === module.id}
                      onChange={(e) => {
                        e.stopPropagation();
                        const nextChecked = e.target.checked;
                        void (async () => {
                          setPendingModuleId(module.id);
                          try {
                            await setCompletion({
                              moduleId: module.id,
                              completed: nextChecked,
                            }).unwrap();
                            setMarkedModuleIds((prev) => {
                              const next = new Set(prev);
                              if (nextChecked) next.add(module.id);
                              else next.delete(module.id);
                              return next;
                            });
                            showToast(
                              nextChecked
                                ? 'Module marked as completed'
                                : 'Module marked as incomplete',
                              'success'
                            );
                          } catch {
                            showToast('Could not update completion. Please try again.', 'error');
                          } finally {
                            setPendingModuleId(null);
                          }
                        })();
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="h-4 w-4 rounded border-gray-300 text-green-200 focus:ring-green-200 disabled:opacity-50"
                    />
                  </label>
                )}
                <div>
                  <h2 className="font-bold  text-green-300">
                    Module {module.moduleNumber}:
                    <span className="font-medium"> {module.title}</span>
                  </h2>
                  {(module.startDate || module.endDate) && (
                    <p className="text-xs text-gray-500 mt-1">
                      {module.startDate && formatDate(module.startDate)}
                      {module.startDate && module.endDate && ' – '}
                      {module.endDate && formatDate(module.endDate)}
                      {typeof module.endDate === 'string' && (() => {
                        const d = daysToGo(module.endDate);
                        return d !== null ? ` · ${d} day${d !== 1 ? 's' : ''} to go` : null;
                      })()}
                    </p>
                  )}
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
