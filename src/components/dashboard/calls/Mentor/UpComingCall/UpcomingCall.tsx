'use client';
import React, { useState } from 'react';
import UpcomingCallTable from './UpComingCallTable';
import ViewUpcomingCall from './ViewUpcomingCall';
import type { UpcomingCall } from './UpComingCallTable';

export default function UpcomingCall() {
  const [view, setView] = useState(false);
  const [selectedCall, setSelectedCall] = useState<UpcomingCall | null>(null);

  return (
    <div>
      {view && selectedCall ? (
        <ViewUpcomingCall
          call={selectedCall}
          onBack={() => {
            setView(false);
            setSelectedCall(null);
          }}
        />
      ) : (
        <UpcomingCallTable
          onRowClick={(row) => {
            setSelectedCall(row);
            setView(true);
          }}
        />
      )}
    </div>
  );
}
