'use client';

import { useState } from 'react';
import ProfileTab from './ProfileTab';
import Account from './Account';
import Security from './Security';
import Notification from './Notification';

export default function ProfileTabContent() {
  const [activeTab, setActiveTab] = useState<'account' | 'notification' | 'security'>('account');

  return (
    <>
      <ProfileTab activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="mt-6">
        {activeTab === 'account' && <Account />}
        {activeTab === 'notification' && <Notification />}
        {activeTab === 'security' && <Security />}
      </div>
    </>
  );
}
