import { Edit } from '@/assets/icons';
import MentorDetail from '@/components/common/Details/MentorDetails';
import Button from '@/components/ui/button/Button';
import { data } from '@/utils/data';
import React from 'react';

export default function Profile() {
  const mentor = data[0];

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
