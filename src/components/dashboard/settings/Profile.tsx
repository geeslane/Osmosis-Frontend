import { Edit } from '@/assets/icons';
import MentorDetail from '@/components/common/Details/MentorDetails';
import Button from '@/components/ui/button/Button';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export default function Profile() {
  const user = useSelector((state: RootState) => state.profile.user);

  const mentor = {
    name: user?.full_name ?? '—',
    email: user?.email ?? '—',
    status: 'Active',
    image: user?.avatar,
    phone: '—',
    address: '—',
    dateOfBirth: undefined,
    gender: undefined,
    occupation: undefined,
    topics: undefined,
    linkedinUrl: undefined,
    inspiration: undefined,
    bio: undefined,
  };

  return (
    <div>
      <div className="flex flex-col gap-4">
        <div className="flex justify-end w-full">
          <Button className="bg-green-200 text-white font-medium text-xs px-5 py-3 flex items-center gap-1 rounded-md">
            <Edit />
            Edit
          </Button>
        </div>
        <MentorDetail selectedDetails={mentor} className="hidden" />
      </div>
    </div>
  );
}
