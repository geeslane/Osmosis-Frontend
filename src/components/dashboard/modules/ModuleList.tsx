'use client';
import { useRouter } from 'next/navigation';
import type { Module } from '@/components/types';
import useToastify from '@/hooks/useToastify';
import { useDeleteModuleMutation } from '@/store/dashboard/dashboard.api';
import { useState } from 'react';
import DeleteModal from '@/components/ui/modal/DeleteModal/DeleteModal';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export default function ModuleList({ modules }: { modules: Module[] }) {
  const router = useRouter();
  const { showToast } = useToastify();
  const [deleteModule, { isLoading }] = useDeleteModuleMutation();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const user = useSelector((state: RootState) => state.profile.user);

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
          className="flex flex-col gap-5  border-b px-5 border-green-100 pb-4"
        >
          <div className="flex flex-col gap-3 ">
            <div className="flex flex-col gap-3 md:flex-row justify-between md:items-center w-full">
              <div>
                <h2 className="font-bold  text-green-300">
                  Module {module.moduleNumber}:
                  <span className="font-medium"> {module.title}</span>
                </h2>
              </div>
              <div className="flex gap-3">
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
