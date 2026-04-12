'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Dropdown } from '../ui/dropdown/Dropdown';
import { RefreshIcon, NotificationsIcon } from '../../assets/icons';
import {
  useGetNotificationsQuery,
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
  useMarkNotificationUnreadMutation,
} from '@/store/notifications/notifications.api';
import { resolveNotificationHref } from '@/utils/notificationLinks';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

function formatTime(createdAt: string): string {
  try {
    const date = new Date(createdAt);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  } catch {
    return createdAt;
  }
}

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const user = useSelector((state: RootState) => state.profile.user);

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useGetNotificationsQuery({ limit: 50 });
  const [markAllRead, { isLoading: isMarkingAll }] =
    useMarkAllNotificationsReadMutation();
  const [markRead] = useMarkNotificationReadMutation();
  const [markUnread] = useMarkNotificationUnreadMutation();

  const notifications = data?.data ?? [];
  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) =>
    activeTab === 'all' ? true : activeTab === 'read' ? n.read : !n.read
  );

  const handleClick = () => setIsOpen(!isOpen);

  return (
    <div className="relative">
      <div
        className="relative bg-black-100-100 dropdown-toggle flex items-center justify-center text-gray-500 transition-colors   rounded-full  h-11 w-11  dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100"
        onClick={handleClick}
      >
        <span
          className={`absolute right-3 top-3 z-10 h-2 w-2 rounded-full bg-[linear-gradient(90deg,#3CF239_0%,#DDF239_100%)] ${
            unreadCount === 0 ? 'hidden' : 'flex'
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
          <button
            type="button"
            onClick={() => refetch()}
            className="flex items-center text-sm text-gray-500 hover:text-black"
          >
            <RefreshIcon width={24} height={24} />
            Refresh
          </button>
        </div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <p className="text-xs text-gray-500">
            {unreadCount} unread
          </p>
          <button
            type="button"
            disabled={isMarkingAll || unreadCount === 0}
            onClick={async () => {
              await markAllRead().unwrap();
            }}
            className="text-xs font-semibold text-gray-700 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Mark all as read
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
          {isError ? (
            <li className="text-center text-red-600 text-sm py-4">
              Failed to load notifications
            </li>
          ) : isLoading ? (
            <li className="text-center text-gray-500 text-sm py-4">
              Loading…
            </li>
          ) : filteredNotifications.length === 0 ? (
            <li className="text-center text-gray-500 text-sm py-4">
              No notifications
            </li>
          ) : (
            filteredNotifications.map((notification) => {
              const href = resolveNotificationHref(notification, user?.role);
              const rowInner = (
                <>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {notification.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {notification.description}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatTime(notification.createdAt)}
                    </p>
                  </div>
                  {!notification.read && (
                    <span className="h-2 w-2 rounded-full bg-green-100 mt-1 flex-shrink-0" />
                  )}
                </>
              );
              return (
              <li
                key={notification.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50"
              >
                {href == null ? (
                  <div
                    className="flex flex-1 items-start gap-3 min-w-0 cursor-default"
                    onClick={() => {
                      setIsOpen(false);
                      if (!notification.read) void markRead(notification.id);
                    }}
                  >
                    {rowInner}
                  </div>
                ) : (
                <Link
                  href={href}
                  className="flex flex-1 items-start gap-3 min-w-0 cursor-pointer"
                  onClick={() => {
                    setIsOpen(false);
                    if (!notification.read) void markRead(notification.id);
                  }}
                >
                  {rowInner}
                </Link>
                )}
                <button
                  type="button"
                  onClick={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (notification.read) {
                      await markUnread(notification.id).unwrap();
                    } else {
                      await markRead(notification.id).unwrap();
                    }
                  }}
                  className="text-[11px] font-semibold text-gray-600 hover:text-black shrink-0"
                >
                  {notification.read ? 'Unread' : 'Read'}
                </button>
              </li>
            );
            })
          )}
        </ul>
        <Link
          href="/dashboard/notifications"
          onClick={() => setIsOpen(false)}
          className="mt-4 w-full block text-center text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg py-2 hover:bg-gray-100"
        >
          View All Notifications
        </Link>
      </Dropdown>
    </div>
  );
}
