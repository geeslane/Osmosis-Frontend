'use client';

import React, { useState } from 'react';
import { Dropdown } from '../ui/dropdown/Dropdown';
import { RefreshIcon, NotificationsIcon } from '../../assets/icons';

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifying, setNotifying] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  const handleClick = () => {
    setIsOpen(!isOpen);
    setNotifying(false);
  };

  return (
    <div className="relative">
      <div
        className="relative bg-black-100-100 dropdown-toggle flex items-center justify-center text-gray-500 transition-colors   rounded-full  h-11 w-11  dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100"
        onClick={handleClick}
      >
        <span
          className={`absolute right-3 top-3 z-10 h-2 w-2 rounded-full bg-[linear-gradient(90deg,#3CF239_0%,#DDF239_100%)] ${
            !notifying ? 'hidden' : 'flex'
          }`}
        >
          <span className="absolute inline-flex w-full h-full gradient rounded-full opacity-75 animate-ping"></span>
        </span>
        <NotificationsIcon />
      </div>
      <Dropdown
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        className="absolute mt-4 w-[380px] bg-black-100 max-h-[396px] no-scrollbar overflow-y-auto rounded-3xl border border-gray-200  p-4 shadow-lg
        sm:left-1/2 -translate-x-1/2
        lg:left-auto lg:right-0 lg:translate-x-0"
      >
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-md font-open-sans font-semibold text-black uppercase">
            Notifications
          </h2>
          <button className="flex items-center text-sm text-gray-500 hover:text-black">
            <RefreshIcon width={24} height={24} />
            Refresh
          </button>
        </div>

        <div className="flex items-center gap-6 justify-between border-b border-gray-200 px-6 mt-4 mb-3 relative">
          {['all', 'read', 'unread'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative text-sm font-semibold capitalize font-open-sans pb-2 ${
                activeTab === tab
                  ? "text-black after:content-[''] after:absolute after:bottom-[-1px] after:left-0 after:h-[3px] after:w-full after:bg-black"
                  : 'text-gray-500 hover:text-black'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <ul className="flex flex-col gap-3">
          <li className="text-center text-gray-500 text-sm">
            No notifications
          </li>
        </ul>
        <button className="mt-4 w-full text-center text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg py-2 hover:bg-gray-100">
          View All Notifications
        </button>
      </Dropdown>
    </div>
  );
}
