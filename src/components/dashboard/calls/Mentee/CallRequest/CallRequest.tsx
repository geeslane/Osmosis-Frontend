'use client';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import ViewRequestCall from './ViewRequestCall';
import CallRequestTable from './CallRequestTable';
import MentorCallRequestTable from '@/components/dashboard/calls/Mentor/CallRequest/MentorCallRequestTable';
import type { RequestCall } from './CallRequestTable';

export default function CallRequest() {
  const [view, setView] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<RequestCall | null>(null);
  const user = useSelector((state: RootState) => state.profile.user);

  // Mentors see call requests from mentees and can accept/reject
  if (user?.role === 'MENTOR') {
    return (
      <div className="mt-6">
        <MentorCallRequestTable />
      </div>
    );
  }

  // Mentees see their sent requests; row click shows detail
  return (
    <div>
      {view && selectedRequest ? (
        <ViewRequestCall
          request={selectedRequest}
          onBack={() => {
            setView(false);
            setSelectedRequest(null);
          }}
        />
      ) : (
        <CallRequestTable
          onRowClick={(row) => {
            setSelectedRequest(row);
            setView(true);
          }}
        />
      )}
    </div>
  );
}
