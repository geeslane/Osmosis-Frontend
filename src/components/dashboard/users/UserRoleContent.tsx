'use client';

import React, { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import Admin from './Admin/Admin';
import Mentor from './mentor/Mentor';
import Mentee from './mentee/Mentee';

const AdminsView: React.FC = () => (
  <div className="mt-6">
    <Admin />
  </div>
);

const MentorView: React.FC = () => (
  <div className="mt-6">
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
  const router = useRouter();
  const user = useSelector((state: RootState) => state.profile.user);
  const userRole = user?.role;
  const shouldShowAdminTab = userRole === 'SUPERADMIN';

  const role =
    searchParams.get('role') || (shouldShowAdminTab ? 'admins' : 'mentor');

  // Redirect non-SUPERADMIN users away from admins tab
  useEffect(() => {
    if (!shouldShowAdminTab && role === 'admins') {
      const params = new URLSearchParams(searchParams.toString());
      params.set('role', 'mentor');
      router.replace(`?${params.toString()}`);
    }
  }, [role, shouldShowAdminTab, router, searchParams]);

  switch (role) {
    case 'mentor':
      return <MentorView />;
    case 'mentee':
      return <MenteeView />;
    case 'admins':
      if (!shouldShowAdminTab) {
        return <MentorView />;
      }
      return <AdminsView />;
    default:
      return shouldShowAdminTab ? <AdminsView /> : <MentorView />;
  }
}
