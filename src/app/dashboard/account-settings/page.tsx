import { PasswordIcon, ProfileIcon } from '@/assets/icons';
import SettingContent from '@/components/dashboard/settings/SettingContent';
import PageTitle from '@/components/PageTitle';
import Tabs from '@/components/ui/Tabs';
import { generateMetadata } from '@/utils/metadata';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = generateMetadata({
  title: 'Osmosis | Account Settings',
  description:
    'Live-Sessions, instructor-led Osmosis session focused on deep understanding through real-time explanations, interactive problem solving, and guided Q&A.',
});
export default function page() {
  return (
    <div>
      <PageTitle title="Manage Account" />
      <Tabs
        paramKey="settings"
        defaultValue="profile"
        tabs={[
          {
            title: 'Profile',
            value: 'profile',
            icon: <ProfileIcon />,
          },
          {
            title: 'Change Password',
            value: 'change-password',
            icon: <PasswordIcon />,
          },
        ]}
      />
      <SettingContent />
    </div>
  );
}
