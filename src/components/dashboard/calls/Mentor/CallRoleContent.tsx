'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import PreviousCall from './PreviousCall/PreviousCall';
import UpcomingCall from './UpComingCall/UpcomingCall';

const PreviousView: React.FC = () => (
  <div className="mt-6">
    <PreviousCall />
  </div>
);

const UpcomingView: React.FC = () => (
  <div className="mt-6">
    <UpcomingCall />
  </div>
);

export default function CallRoleContent() {
  const searchParams = useSearchParams();

  const role = searchParams.get('role') || 'admins';

  switch (role) {
    case 'previous':
      return <PreviousView />;
    case 'upcoming':
      return <UpcomingView />;
    default:
      return <PreviousView />;
  }
}
