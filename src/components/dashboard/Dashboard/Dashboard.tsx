'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import AdminDashboard from './AdminDashboard';
import MentorDashboard from './MentorDashboard';
import TeenagerDashboard from './TeenagerDashboard';

export default function Dashboard() {
  const user = useSelector((state: RootState) => state.profile.user);
  const role = user?.role;

  if (role === 'TEENAGER') {
    return <TeenagerDashboard />;
  }
  if (role === 'MENTOR') {
    return <MentorDashboard />;
  }
  if (role === 'ADMIN' || role === 'SUPERADMIN') {
    return <AdminDashboard />;
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-500">
      <p>Welcome. Select a role or sign in to see your dashboard.</p>
    </div>
  );
}
