'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import Tabs from '@/components/ui/Tabs';
import { AdminsIcon, MentorIcon, MentteeIcon } from '@/assets/icons';
import UserRoleContent from './UserRoleContent';

export default function UsersTabs() {
  const user = useSelector((state: RootState) => state.profile.user);
  const userRole = user?.role;
  
  const shouldShowAdminTab = userRole === 'SUPERADMIN';
  
  const allTabs = [
    {
      title: 'Admins',
      value: 'admins',
      icon: <AdminsIcon />,
    },
    {
      title: 'Mentor',
      value: 'mentor',
      icon: <MentorIcon />,
    },
    {
      title: 'Mentee',
      value: 'mentee',
      icon: <MentteeIcon />,
    },
  ];
  
  const tabs = shouldShowAdminTab
    ? allTabs
    : allTabs.filter((tab) => tab.value !== 'admins');
  
  const defaultValue = shouldShowAdminTab ? 'admins' : 'mentor';

  return (
    <>
      <Tabs
        paramKey="role"
        defaultValue={defaultValue}
        tabs={tabs}
      />
      <UserRoleContent />
    </>
  );
}
