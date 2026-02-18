import React from 'react';
import AdminCard from './AdminCard';

export default function Admins() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3  gap-8 z-50 my-[56px]">
      <AdminCard count={100} title="Total Admins" color={'bg-green-200'} />
      <AdminCard count={100} title="Total Mentors" color={'bg-green-100'} />
      <AdminCard count={100} title="Total Mentees" color={'bg-green-200'} />
      <AdminCard count={100} title="Total Calls" color={'bg-green-100'} />
      <AdminCard
        count={100}
        title="Total Live Sessions"
        color={'bg-green-200'}
      />
    </div>
  );
}
