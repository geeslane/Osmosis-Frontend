import CallTabs from '@/components/dashboard/calls/CallTabs';
import React from 'react';

export default function CallsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col ">
      <CallTabs />
      {children}
    </div>
  );
}
