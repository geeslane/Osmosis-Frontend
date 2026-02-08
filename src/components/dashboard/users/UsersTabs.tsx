'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import Tabs from '@/components/ui/Tabs';
import { AdminsIcon, MentorIcon, MentteeIcon } from '@/assets/icons';

export default function UsersTabs() {
  const user = useSelector((state: RootState) => state.profile.user);
  const userRole = user?.role;

  const allTabs = [
    { title: 'Admins', value: 'admins', icon: <AdminsIcon /> },
    { title: 'Mentor', value: 'mentor', icon: <MentorIcon /> },
    { title: 'Mentee', value: 'mentee', icon: <MentteeIcon /> },
  ];

  const roleTabsMap: Record<string, string[]> = {
    SUPERADMIN: ['admins', 'mentor', 'mentee'],
    ADMIN: ['mentor', 'mentee'],
    MENTOR: ['mentee'],
  };

  const allowedTabs = roleTabsMap[userRole || ''] || [];

  const tabs = allTabs.filter((tab) => allowedTabs.includes(tab.value));

  if (!tabs.length) return null;

  const defaultValue = tabs[0].value;

  return (
    <Tabs
      paramKey="role"
      defaultValue={defaultValue}
      tabs={tabs}
      basePath="/dashboard/users"
      preserveSearchParams={false}
    />
  );
}
