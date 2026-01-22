'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import Profile from './Profile';
import Password from './Password';

const ProfileView = () => (
  <div className="mt-6">
    <Profile />
  </div>
);

const PasswordView = () => (
  <div className="mt-6">
    <Password />
  </div>
);

export default function SettingContent() {
  const searchParams = useSearchParams();
  const view = searchParams.get('settings') || 'profile';

  switch (view) {
    case 'profile':
      return <ProfileView />;
    case 'change-password':
      return <PasswordView />;
    default:
      return <ProfileView />;
  }
}
