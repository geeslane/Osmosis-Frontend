'use client';
import React, { useState } from 'react';
import ViewRequestCall from './ViewRequestCall';
import CallRequestTable from './CallRequestTable';

export default function CallRequest() {
  const [view, setView] = useState(false);

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
