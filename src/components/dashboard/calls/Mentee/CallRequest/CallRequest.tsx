'use client';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import ViewRequestCall from './ViewRequestCall';
import CallRequestTable from './CallRequestTable';
import MentorCallRequestTable from '@/components/dashboard/calls/Mentor/CallRequest/MentorCallRequestTable';

export default function CallRequest() {
  const [view, setView] = useState(false);
  const user = useSelector((state: RootState) => state.profile.user);

  // Mentors see call requests from mentees and can accept/reject
  if (user?.role === 'MENTOR') {
    return (
      <div className="mt-6">
        <MentorCallRequestTable />
      </div>
    );
  }

  // Mentees see their sent requests (read-only view)
  return (
    <div>
      {view ? (
        <ViewRequestCall />
      ) : (
        <CallRequestTable onView={() => setView(true)} />
      )}
    </div>
  );
}
