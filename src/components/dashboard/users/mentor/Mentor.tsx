'use client';
import { GoBackIcon, LoadingIcon } from '@/assets/icons';
import Empty from '@/components/ui/NotFound/Empty';
import React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import MentorTable from './MentorTable';
import MentorDetail from '@/components/common/Details/MentorDetails';

import { useGetMentorsQuery } from '@/store/users/users.api';

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

  return {
    id: apiMentor.id,
    name: apiMentor.fullName || '',
    email: apiMentor.email || '',
    address: apiMentor.address || '',
    phone: apiMentor.phoneNumber || '',
    status: statusMap[apiMentor.status] || 'Active',
    image: apiMentor.pictureUrl || undefined,
    dateOfBirth: apiMentor.dateOfBirth || '',
    gender: apiMentor.gender,
    occupation: apiMentor.occupation || 'N/A',
    inspiration: apiMentor.inspiration || 'N/A',
    bio: apiMentor.bio || 'N/A',
    topics: apiMentor.mentorshipTopics || 'N/A',
    linkedinUrl: apiMentor.linkedinUrl || 'N/A',
  };
}

export default function Mentor() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const view = searchParams.get('viewmentor') || 'listmentor';
  const selectedId = searchParams.get('id');

  const { data: mentorsResponse, isLoading: isLoadingMentors } =
    useGetMentorsQuery({ page: 1, limit: 100 });

  const mentorData = mentorsResponse?.data?.map(mapMentorFromApi) || [];

  const setParam = (newView: string, id?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('viewmentor', newView);
    if (id) params.set('id', id);
    else params.delete('id');
    router.replace(`?${params.toString()}`);
  };

  const handleBack = () => setParam('listmentor');

  if (isLoadingMentors && view === 'listmentor') {
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

  /*   if (view === 'viewmentor') {
    return (
      <div className="flex justify-center items-center py-20">
        <LoadingIcon
          width="40"
          height="40"
          className="animate-spin text-green-100"
        />
      </div>
    );
  } */

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

      {view === 'viewmentor' && mentorData && (
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
              selectedDetails={mentorData.find((m: any) => m.id === selectedId)}
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
              onViewMentor={(admin) => setParam('viewmentor', admin.id)}
            />
          )}
        </div>
      )}
    </div>
  );
}
