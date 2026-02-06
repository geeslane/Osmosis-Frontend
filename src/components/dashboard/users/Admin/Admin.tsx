'use client';

import { AddsIcon, GoBackIcon, LoadingIcon } from '@/assets/icons';
import Button from '@/components/ui/button/Button';
import Empty from '@/components/ui/NotFound/Empty';
import React from 'react';
import AddAdmin from './AddAdmin';
import AdminListPage from './AdminTable';
import { useSearchParams, useRouter } from 'next/navigation';
import { useGetAdminsQuery } from '@/store/users/users.api';

type Admin = {
  id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
  status: string;
  image?: string;
  role?: string;
};

function mapAdminFromApi(apiAdmin: any): Admin {
  const statusMap: Record<string, string> = {
    ACTIVE: 'Active',
    INACTIVE: 'Inactive',
    DEACTIVATED: 'Inactive',
    PENDING: 'Pending',
  };

  return {
    id: apiAdmin.id,
    name: apiAdmin.fullName || '-',
    email: apiAdmin.email || '-',
    address: apiAdmin.address || '-',
    phone: apiAdmin.phoneNumber || '-',
    status: statusMap[apiAdmin.status] || 'Active',
    image: apiAdmin.pictureUrl || undefined,
    role: apiAdmin.role || undefined,
  };
}

export default function Admin() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const view = searchParams.get('viewadmin') || 'listadmin';

  const { data: adminsResponse, isLoading: isLoadingAdmins } =
    useGetAdminsQuery({ page: 1, limit: 100 });

  const adminData = adminsResponse?.data?.map(mapAdminFromApi) || [];

  const setParam = (newView: string, id?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('viewadmin', newView);
    if (id) params.set('id', id);
    else params.delete('id');
    router.replace(`?${params.toString()}`);
  };

  const handleBack = () => setParam('listadmin');

  if (isLoadingAdmins && view === 'listadmin') {
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

  if (view === 'viewadmin') {
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
    <div className=" w-full max-w-full">
      {view === 'addadmin' && (
        <div className="max-w-[745px]">
          <div className="flex flex-col gap-8 py-4">
            <div
              onClick={handleBack}
              className="flex cursor-pointer items-center gap-1"
            >
              <GoBackIcon />
              <h3 className="text-sm text-green-200 font-medium">Back</h3>
            </div>
            <h3 className="text-green-200 text-2xl font-bold">Invite Admin</h3>
            <div className="rounded-md border px-4 md:px-[64px] border-green-400 py-5 w-full">
              <AddAdmin />
            </div>
          </div>
        </div>
      )}
      {view === 'listadmin' && (
        <div className="rounded-md border border-green-400 py-5">
          <div className="flex justify-between px-6 items-center">
            <div className="flex items-center gap-2 text-green-200 text-2xl font-semibold">
              Admins List
              <span className="bg-[#DCFFAD91] w-[24px] h-[24px] flex justify-center items-center rounded-full text-green-100 text-xs">
                {adminData.length}
              </span>
            </div>
            {adminData.length == 0 && (
              <Button
                onClick={() => setParam('addadmin')}
                variant="primary"
                className="font-medium flex gap-1"
              >
                <AddsIcon />
                <span className="hidden md:flex">Invite Admin</span>
              </Button>
            )}
          </div>

          {adminData.length === 0 ? (
            <div className="max-w-[400px] mx-auto my-[65px]">
              <Empty
                title="No Admins for now."
                description="Click Invite Admin to have a list."
              />
            </div>
          ) : (
            <AdminListPage
              data={adminData}
              onAddAdmin={() => setParam('addadmin')}
            />
          )}
        </div>
      )}
    </div>
  );
}
