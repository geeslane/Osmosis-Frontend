import UsersTabs from '@/components/dashboard/users/UsersTabs';
import React from 'react';

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col ">
      <UsersTabs />
      {children}
    </div>
  );
}
