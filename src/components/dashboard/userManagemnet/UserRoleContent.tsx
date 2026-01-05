'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import Admin from './Admin/Admin';
import Mentor from './mentor/Mentor';
import Mentee from './mentee/Mentee';

const AdminsView: React.FC = () => (
  <div className="mt-6 ">
    <Admin />
  </div>
);

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
  const role = searchParams.get('role') || 'admins';

  switch (role) {
    case 'mentor':
      return <MentorView />;
    case 'mentee':
      return <MenteeView />;
    case 'admins':
    default:
      return <AdminsView />;
  }
}
