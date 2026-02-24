'use client';
import { GoBackIcon, LoadingIcon } from '@/assets/icons';
import Empty from '@/components/ui/NotFound/Empty';
import React, { useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import MentorTable from './MentorTable';

import { useGetMentorsQuery } from '@/store/users/users.api';
import Details from './Details';
import { useUserList } from '@/hooks/useUserList';

type Mentor = {
  id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
  status: string;
  image?: string;
  dateOfBirth?: string;
  gender: string;
  occupation: string;
  inspiration: string;
  topics: string;
  linkedinUrl: string;
  bio: string;
};

function mapMentorFromApi(apiMentor: any): Mentor {
  const statusMap: Record<string, string> = {
    ACTIVE: 'Active',
    INACTIVE: 'Inactive',
    DEACTIVATED: 'Inactive',
    PENDING: 'Pending',
  };

  const topics = apiMentor.mentorshipTopics;
  const topicsStr = Array.isArray(topics)
    ? topics.join(', ')
    : typeof topics === 'string'
      ? topics
      : '—';
  return {
    id: apiMentor.id,
    name: apiMentor.fullName || '',
    email: apiMentor.email || '',
    address: apiMentor.address || '',
    phone: apiMentor.phoneNumber || '',
    status: statusMap[apiMentor.status] || 'Active',
    image: apiMentor.pictureUrl || undefined,
    dateOfBirth: apiMentor.dateOfBirth || '',
    gender: apiMentor.gender || '—',
    occupation: apiMentor.occupation || '—',
    inspiration: apiMentor.inspiration || '—',
    bio: apiMentor.bio || '—',
    topics: topicsStr,
    linkedinUrl: apiMentor.linkedinUrl || '',
  };
}

export default function Mentor() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const view = searchParams.get('viewmentor') || 'listmentor';
  const selectedId = searchParams.get('id');

  const userList = useUserList({ defaultLimit: 10 });
  const { queryParams, search, statusFilter, limit } = userList;

  const { data: mentorsResponse, isLoading: isLoadingMentors, isError: isMentorsError } =
    useGetMentorsQuery(queryParams);

  const mentorData = useMemo(
    () => mentorsResponse?.data?.map(mapMentorFromApi) || [],
    [mentorsResponse]
  );

  const total = mentorsResponse?.pagination?.total ?? 0;
  const totalPages = mentorsResponse?.pagination?.totalPages ?? 1;

  const currentView = searchParams.get('viewmentor') || 'listmentor';
  const currentSelectedId = searchParams.get('id');

  useEffect(() => {
    if (
      mentorData.length > 0 &&
      currentView === 'viewmentor' &&
      currentSelectedId &&
      !mentorData.find((m: any) => m.id === currentSelectedId)
    ) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('viewmentor', 'listmentor');
      params.delete('id');
      router.replace(`?${params.toString()}`);
    } else if (
      currentView !== 'listmentor' &&
      mentorData.length === 0 &&
      !isLoadingMentors
    ) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('viewmentor', 'listmentor');
      params.delete('id');
      router.replace(`?${params.toString()}`);
    }
  }, [mentorData, currentView, currentSelectedId, isLoadingMentors, searchParams, router]);

  const setParam = (newView: string, id?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('viewmentor', newView);
    if (id) params.set('id', id);
    else params.delete('id');
    router.replace(`?${params.toString()}`);
  };

  const handleBack = () => setParam('listmentor');

  if (isLoadingMentors && view === 'listmentor' && !isMentorsError) {
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

      {view === 'viewmentor' &&
        mentorData &&
        mentorData.find((m: any) => m.id === selectedId) && (
          <div className="w-full ">
            <div className="flex flex-col gap-8 py-4">
              <Details
                handleBack={handleBack}
                selectedDetails={mentorData.find(
                  (m: any) => m.id === selectedId
                )}
              />
            </div>
          </div>
        )}

      {view === 'listmentor' && (
        <div className="rounded-md border border-green-400 py-5">
          <div className="flex justify-between px-6 items-center">
            <div className="flex items-center gap-2 text-green-200 text-2xl font-semibold">
              Mentors List
              <span className="bg-[#DCFFAD91] w-[24px] h-[24px] flex justify-center items-center rounded-full text-green-100 text-xs">
                {total}
              </span>
            </div>
          </div>

          {!isLoadingMentors &&
          total === 0 &&
          search.trim() === '' &&
          statusFilter === 'All' ? (
            <div className="max-w-[400px] mx-auto my-[65px]">
              <Empty
                title="No Mentor for now."
                description="Check Back Later"
              />
            </div>
          ) : (
            <MentorTable
              data={mentorData}
              totalPages={totalPages}
              page={userList.page}
              perPage={limit}
              onPageChange={userList.setPage}
              search={userList.search}
              onSearchChange={userList.setSearch}
              statusFilter={userList.statusFilter}
              onStatusFilterChange={userList.setStatusFilter}
              onViewMentor={(admin) => setParam('viewmentor', admin.id)}
            />
          )}
        </div>
      )}
    </div>
  );
}
