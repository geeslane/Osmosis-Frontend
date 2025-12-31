'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import Admin from './Admin/Admin';
import Mentor from './mentor/Mentor';

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
  <div className="mt-6 rounded-md border border-gray-200 p-6">
    <h3 className="text-lg font-medium">Mentees</h3>
    <p className="mt-2 text-sm text-gray-600">
      List of mentees will appear here.
    </p>
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
