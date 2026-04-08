/* eslint-disable react/no-unstable-nested-components */
'use client';
import React from 'react';
import UpcomingCallTable from './UpComingCallTable';

export default function UpcomingCall() {
  return (
    <div>
      <UpcomingCallTable onView={() => {}} />
    </div>
  );
}
