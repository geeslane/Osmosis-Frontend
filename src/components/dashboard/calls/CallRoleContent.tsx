'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import PreviousCall from './Mentee/PreviousCall/PreviousCall';
import UpcomingCall from './Mentee/UpComingCall/UpcomingCall';
import CallRequest from './Mentee/CallRequest/CallRequest';

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

const RequestsView: React.FC = () => (
  <div className="mt-6">
    <CallRequest />
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
    case 'requests':
      return <RequestsView />;
    default:
      return <PreviousView />;
  }
}
