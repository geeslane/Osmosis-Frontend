'use client';
import React, { useState } from 'react';
import UpcomingCallTable from './UpComingCallTable';
import ViewUpcomingCall from './ViewUpcomingCall';

export default function UpcomingCall() {
  const [view, setView] = useState(false);

  return (
    <div>
      <div>
        {view ? (
          <ViewUpcomingCall />
        ) : (
          <UpcomingCallTable onView={() => setView(true)} />
        )}
      </div>
    </div>
  );
}
