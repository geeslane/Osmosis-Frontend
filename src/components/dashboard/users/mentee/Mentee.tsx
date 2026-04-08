'use client';

import { GoBackIcon, LoadingIcon } from '@/assets/icons';
import Empty from '@/components/ui/NotFound/Empty';
import React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import MenteeTable from './MenteeTable';
import { useGetTeenagersQuery } from '@/store/users/users.api';
import { useUserList } from '@/hooks/useUserList';

type Mentee = {
  id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
  status: string;
  image?: string;
};

function mapMenteeFromApi(apiMentee: any): Mentee {
  const statusMap: Record<string, string> = {
    ACTIVE: 'Active',
    INACTIVE: 'Inactive',
    DEACTIVATED: 'Inactive',
    PENDING: 'Pending',
  };

  return {
    id: apiMentee.id,
    name: apiMentee.teenagerFullName || '',
    email: apiMentee.teenagerEmail || '',
    address: apiMentee.address || '',
    phone: apiMentee.teenagerPhoneNumber || '',
    status: statusMap[apiMentee.status] || 'Active',
    image: apiMentee.pictureUrl || undefined,
  };
}

export default function Mentee() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.profile.user);
  const view = searchParams.get('viewmentee') || 'listmentee';
  const canManageStatus = user?.role !== 'MENTOR';

  const userList = useUserList({ defaultLimit: 10 });
  const { queryParams, search, statusFilter } = userList;

  const { data: menteesResponse, isLoading: isLoadingMentees } =
    useGetTeenagersQuery(queryParams);

  const menteeData = menteesResponse?.data?.map(mapMenteeFromApi) || [];
  const total = menteesResponse?.pagination?.total ?? 0;
  const totalPages = menteesResponse?.pagination?.totalPages ?? 1;

  const setParam = (newView: string, id?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('viewmentee', newView);
    if (id) params.set('id', id);
    else params.delete('id');
    router.replace(`?${params.toString()}`);
  };

  const handleBack = () => setParam('listmentee');

  if (isLoadingMentees && view === 'listmentee') {
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
      {view === 'addmentee' && (
        <div className="max-w-[745px]">
          <div className="flex flex-col gap-8 py-4">
            <div
              onClick={handleBack}
              className="flex  w-20  cursor-pointer  items-center gap-1"
            >
              <GoBackIcon />
              <h3 className="text-sm text-green-200 font-medium">Back</h3>
            </div>
            <h3 className="text-green-200 text-2xl font-bold">Add Mentee</h3>
            <div className="rounded-md border px-4 md:px-[64px] border-green-400 py-5 w-full">
              Add Mentee Incoming Design
            </div>
          </div>
        </div>
      )}

      {view === 'listmentee' && (
        <div className="rounded-md border border-green-400 py-5">
          <div className="flex justify-between px-6 items-center">
            <div className="flex items-center gap-2 text-green-200 text-2xl font-semibold">
              Mentees List
              <span className="bg-[#DCFFAD91] w-[24px] h-[24px] flex justify-center items-center rounded-full text-green-100 text-xs">
                {total}
              </span>
            </div>
          </div>

          {!isLoadingMentees &&
          total === 0 &&
          search.trim() === '' &&
          statusFilter === 'All' ? (
            <div className="max-w-[400px] mx-auto my-[65px]">
              <Empty
                title="No Mentee for now."
                description="Check Back Later"
              />
            </div>
          ) : (
            <MenteeTable
              data={menteeData}
              totalPages={totalPages}
              page={userList.page}
              perPage={userList.limit}
              onPageChange={userList.setPage}
              search={userList.search}
              onSearchChange={userList.setSearch}
              statusFilter={userList.statusFilter}
              onStatusFilterChange={userList.setStatusFilter}
              canManageStatus={canManageStatus}
            />
          )}
        </div>
      )}
    </div>
  );
}
