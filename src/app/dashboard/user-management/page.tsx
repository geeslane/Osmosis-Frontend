import { AdminsIcon, MentorIcon, MentteeIcon } from '@/assets/icons';
import PageTitle from '@/components/PageTitle';
import Tabs from '@/components/ui/Tabs';
import UserRoleContent from '@/components/dashboard/userManagemnet/UserRoleContent';
import { generateMetadata } from '@/utils/metadata';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = generateMetadata({
  title: 'Osmosis | User Management',
  description:
    'Manage user accounts, roles, and permissions within the Osmosis platform.',
});

export default function page() {
  return (
    <div>
      <PageTitle title="User Management" />

      <Tabs
        paramKey="role"
        defaultValue="admins"
        tabs={[
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
        ]}
      />

      <UserRoleContent />
    </div>
  );
}
