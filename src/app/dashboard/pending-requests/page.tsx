import { MentorIcon, MentteeIcon } from '@/assets/icons';
import UserRoleContent from '@/components/dashboard/pending-request/UserRoleContent';
import PageTitle from '@/components/PageTitle';
import Tabs from '@/components/ui/Tabs';
import { generateMetadata } from '@/utils/metadata';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = generateMetadata({
  title: 'Osmosis | Pending Requests',
  description:
    'Review and manage pending requests awaiting approval on the Osmosis platform.',
});

export default function page() {
  return (
    <div>
      <PageTitle title="Pending Requests" />

      <Tabs
        paramKey="role"
        defaultValue="mentor"
        tabs={[
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
