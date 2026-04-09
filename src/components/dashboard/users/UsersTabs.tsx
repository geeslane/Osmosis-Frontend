'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import Tabs from '@/components/ui/Tabs';
import { AdminsIcon, MentorIcon, MentteeIcon } from '@/assets/icons';

export default function UsersTabs() {
  const pathname = usePathname();
  const user = useSelector((state: RootState) => state.profile.user);
  const userRole = user?.role;

  const allTabs = [
    { title: 'Admins', value: 'admins', icon: <AdminsIcon /> },
    { title: 'Mentors', value: 'mentor', icon: <MentorIcon /> },
    { title: 'Mentees', value: 'mentee', icon: <MentteeIcon /> },
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

  /** Nested routes omit `?role=`; infer from path so Mentees stays selected on module views. */
  const roleFromPath =
    pathname.startsWith('/dashboard/users/mentee') ? 'mentee' : pathname.startsWith('/dashboard/users/admin') ? 'admins' : undefined;

  const activeTabFromPath =
    roleFromPath && allowedTabs.includes(roleFromPath) ? roleFromPath : undefined;

  return (
    <Tabs
      paramKey="role"
      defaultValue={defaultValue}
      tabs={tabs}
      basePath="/dashboard/users"
      preserveSearchParams={false}
      activeTabFromPath={activeTabFromPath}
    />
  );
}
