'use client';

import React from 'react';
import Tabs from '@/components/ui/Tabs';
import { CallRequestIcon, PhoneIcon, UpComingCalls } from '@/assets/icons';

export default function CallTabs() {
  const tabs = [
    {
      title: 'Previous calls',
      value: 'previous',
      icon: <PhoneIcon color="#6CBB01" />,
    },
    { title: 'Upcoming calls', value: 'upcoming', icon: <UpComingCalls /> },
    { title: 'Call requests', value: 'requests', icon: <CallRequestIcon /> },
  ];

  return (
    <Tabs
      paramKey="role"
      defaultValue={tabs[0].value}
      tabs={tabs}
      basePath="/dashboard/calls/mentee"
      preserveSearchParams={false}
      containerClassName="max-w-[450px]"
    />
  );
}
