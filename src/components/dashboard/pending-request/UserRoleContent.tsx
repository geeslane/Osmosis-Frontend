'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import Mentor from './mentor/Mentor';
import Mentee from './mentee/Mentee';

const MentorView: React.FC = () => (
  <div className="mt-6 ">
    <Mentor />
  </div>
);

const MenteeView: React.FC = () => (
  <div className="mt-6">
    <Mentee />
  </div>
);

export default function UserRoleContent() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role') || 'mentor';

  switch (role) {
    case 'mentor':
      return <MentorView />;
    case 'mentee':
      return <MenteeView />;
    case 'mentor':
    default:
      return <MentorView />;
  }
}
