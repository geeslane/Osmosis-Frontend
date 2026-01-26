'use client';

import { GoBackIcon, LoadingIcon } from '@/assets/icons';
import Empty from '@/components/ui/NotFound/Empty';
import React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import MentorTable from './MentorTable';
import MentorDetail from '@/components/common/Details/MentorDetails';
import { useGetMentorRequestsQuery } from '@/store/users/users.api';

type MentorPending = {
  id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
  status: string;
  image?: string;
};

function mapMentorRequestFromApi(apiRequest: any): MentorPending {
  const statusMap: Record<string, string> = {
    PENDING: 'Pending',
    APPROVED: 'Active',
    REJECTED: 'Inactive',
  };
  return {
    id: apiRequest.id,
    name: apiRequest.fullName || '',
    email: apiRequest.email || '',
    address: apiRequest.address || '',
    phone: apiRequest.phoneNumber || '',
    status: statusMap[apiRequest.status] || 'Pending',
    image: apiRequest.pictureUrl || undefined,
  };
}

export default function Mentor() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const view = searchParams.get('viewmentor') || 'listmentor';
  const selectedId = searchParams.get('id');

  // Fetch pending mentor requests
  const {
    data: requestsResponse,
    isLoading: isLoadingRequests,
    refetch: refetchRequests,
  } = useGetMentorRequestsQuery({ page: 1, limit: 100, status: 'PENDING' });

  const mentorData = requestsResponse?.data?.map(mapMentorRequestFromApi) || [];
  const selectedDetails = selectedId
    ? mentorData.find((a: MentorPending) => a.id === selectedId)
    : null;

  const setParam = (newView: string, id?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('viewmentor', newView);
    if (id) params.set('id', id);
    else params.delete('id');
    router.replace(`?${params.toString()}`);
  };

  const handleBack = () => setParam('listmentor');

  if (isLoadingRequests && view === 'listmentor') {
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
      {view === 'addmentor' && (
        <div className="max-w-[745px]">
          <div className="flex flex-col gap-8 py-4">
            <div
              onClick={handleBack}
              className="flex  w-20  cursor-pointer  items-center gap-1"
            >
              <GoBackIcon />
              <h3 className="text-sm text-green-200 font-medium">Back</h3>
            </div>
            <h3 className="text-green-200 text-2xl font-bold">Add Mentor</h3>
            <div className="rounded-md border px-4 md:px-[64px] border-green-400 py-5 w-full">
              Add Mentor Incoming Design
            </div>
          </div>
        </div>
      )}

      {view === 'viewmentor' && selectedDetails && (
        <div className="w-full ">
          <div className="flex flex-col gap-8 py-4">
            <div
              onClick={handleBack}
              className="flex cursor-pointer w-20  items-center gap-1"
            >
              <GoBackIcon />
              <h3 className="text-sm text-green-200 font-medium">Back</h3>
            </div>
            <MentorDetail
              selectedDetails={selectedDetails}
              onRefetch={refetchRequests}
            />
          </div>
        </div>
      )}

      {view === 'listmentor' && (
        <div className="rounded-md border border-green-400 py-3">
          <div className="flex justify-between px-4 items-center">
            <div className="flex items-center gap-2 text-green-200 text-2xl font-semibold">
              Pending Mentors List
              <span className="bg-[#DCFFAD91] w-[24px] h-[24px] flex justify-center items-center rounded-full text-green-100 text-xs">
                {mentorData.length}
              </span>
            </div>
          </div>

          {mentorData.length === 0 ? (
            <div className="max-w-[400px] mx-auto my-[65px]">
              <Empty
                title="No Mentor for now."
                description="Check Back Later"
              />
            </div>
          ) : (
            <MentorTable
              data={mentorData}
              onAddAdmin={() => setParam('addmentor')}
              onViewAdmin={(admin) => setParam('viewmentor', admin.id)}
              onRefetch={refetchRequests}
            />
          )}
        </div>
      )}
    </div>
  );
}
