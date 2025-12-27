'use client';

import { AddsIcon, GoBackIcon } from '@/assets/icons';
import Button from '@/components/ui/button/Button';
import Empty from '@/components/ui/NotFound/Empty';
import React from 'react';
import AddAdmin from './AddAdmin';
import AdminListPage from './AdminTable';
import AdminDetail from './AdminDetail';
import { data } from '@/utils/data';
import { useSearchParams, useRouter } from 'next/navigation';

type Admin = {
  id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
  status: string;
  image?: string;
};

export default function Admin() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const view = searchParams.get('view') || 'list';
  const selectedId = searchParams.get('id');
  const selectedAdmin = selectedId
    ? data.find((a) => a.id === selectedId)
    : null;

  const setParam = (newView: string, id?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('view', newView);
    if (id) params.set('id', id);
    else params.delete('id');
    router.replace(`?${params.toString()}`);
  };

  const handleBack = () => setParam('list');

  return (
    <div>
      {view === 'add' && (
        <div className="max-w-[745px]">
          <div className="flex flex-col gap-8 py-4">
            <div
              onClick={handleBack}
              className="flex cursor-pointer items-center gap-1"
            >
              <GoBackIcon />
              <h3 className="text-sm text-green-200 font-medium">Back</h3>
            </div>
            <h3 className="text-green-200 text-2xl font-bold">Add Admin</h3>
            <div className="rounded-md border px-4 md:px-[64px] border-green-400 py-5 w-full">
              <AddAdmin />
            </div>
          </div>
        </div>
      )}

      {view === 'view' && selectedAdmin && (
        <div className="max-w-[745px]">
          <div className="flex flex-col gap-8 py-4">
            <div
              onClick={handleBack}
              className="flex cursor-pointer items-center gap-1"
            >
              <GoBackIcon />
              <h3 className="text-sm text-green-200 font-medium">Back</h3>
            </div>
            <AdminDetail selectedAdmin={selectedAdmin} />
          </div>
        </div>
      )}

      {view === 'list' && (
        <div className="rounded-md border border-green-400 py-5">
          <div className="flex justify-between px-6 items-center">
            <div className="flex items-center gap-2 text-green-200 text-2xl font-semibold">
              Admins List
              <span className="bg-[#DCFFAD91] w-[24px] h-[24px] flex justify-center items-center rounded-full text-green-100 text-xs">
                {data.length}
              </span>
            </div>
            {data.length == 0 && (
              <Button
                onClick={() => setParam('add')}
                variant="primary"
                className="font-medium flex gap-1"
              >
                <AddsIcon />
                <span className="hidden md:flex">Add Admin</span>
              </Button>
            )}
          </div>

          {data.length === 0 ? (
            <div className="max-w-[400px] mx-auto my-[65px]">
              <Empty
                title="No Admins for now."
                description="Click Add Admins to have a list."
              />
            </div>
          ) : (
            <AdminListPage
              data={data}
              onAddAdmin={() => setParam('add')}
              onViewAdmin={(admin) => setParam('view', admin.id)}
            />
          )}
        </div>
      )}
    </div>
  );
}
