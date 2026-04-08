import PageTitle from '@/components/PageTitle';
import React from 'react';
import MentorAvailability from '@/components/dashboard/schedule/mentor/MentorAvailability';

export default function page() {
  return (
    <div>
      <PageTitle title="Create Schedule" />
      <div className="mt-6">
        <MentorAvailability />
      </div>
    </div>
  );
}
