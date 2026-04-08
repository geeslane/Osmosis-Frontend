'use client';

import {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkNotificationUnreadMutation,
  useMarkAllNotificationsReadMutation,
  type NotificationItem,
} from '@/store/notifications/notifications.api';
import PageTitle from '@/components/PageTitle';
import { useState } from 'react';
import Link from 'next/link';

function formatNotificationTime(createdAt: string): string {
  try {
    const date = new Date(createdAt);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  } catch {
    return createdAt;
  }
}

export default function NotificationsList() {
  const [activeTab, setActiveTab] = useState<'all' | 'read' | 'unread'>('all');
  const { data, isLoading } = useGetNotificationsQuery({ page: 1, limit: 50 });
  const [markRead] = useMarkNotificationReadMutation();
  const [markUnread] = useMarkNotificationUnreadMutation();
  const [markAllRead] = useMarkAllNotificationsReadMutation();

  const handleMarkRead = (id: string) => {
    void markRead(id);
  };

  const handleMarkUnread = (id: string) => {
    void markUnread(id);
  };

  const notifications = data?.data ?? [];
  const unreadCount = notifications.filter((n) => !n.read).length;
  const filtered =
    activeTab === 'all'
      ? notifications
      : activeTab === 'read'
        ? notifications.filter((n) => n.read)
        : notifications.filter((n) => !n.read);

  return (
    <div>
      <PageTitle title="Notifications" />
      <div className="mt-6 rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 bg-gray-50/50 px-4">
          <div className="flex">
          {(['all', 'read', 'unread'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-sm font-semibold capitalize ${
                activeTab === tab
                  ? 'text-green-700 border-b-2 border-green-200'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
          </div>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={() => markAllRead()}
              className="text-sm font-medium text-green-600 hover:text-green-700"
            >
              Mark all as read
            </button>
          )}
        </div>
        <div className="divide-y divide-gray-100">
          {isLoading ? (
            <div className="py-12 text-center text-gray-500 text-sm">
              Loading notifications…
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-gray-500 text-sm">
              No notifications
            </div>
          ) : (
            filtered.map((notification) => (
              <NotificationRow
                key={notification.id}
                notification={notification}
                onMarkRead={handleMarkRead}
                onMarkUnread={handleMarkUnread}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function NotificationRow({
  notification,
  onMarkRead,
  onMarkUnread,
}: {
  notification: NotificationItem;
  onMarkRead: (id: string) => void;
  onMarkUnread: (id: string) => void;
}) {
  const content = (
    <div className="flex items-start gap-4 p-4 hover:bg-gray-50/50">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{notification.title}</p>
        <p className="text-xs text-gray-500 mt-1">{notification.description}</p>
        <p className="text-xs text-gray-400 mt-1">
          {formatNotificationTime(notification.createdAt)}
        </p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {!notification.read ? (
          <>
            <span className="h-2 w-2 rounded-full bg-green-500 mt-1.5" aria-hidden />
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onMarkRead(notification.id);
              }}
              className="text-xs font-medium text-green-600 hover:text-green-700"
            >
              Mark read
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onMarkUnread(notification.id);
            }}
            className="text-xs font-medium text-gray-500 hover:text-gray-700"
          >
            Mark unread
          </button>
        )}
      </div>
    </div>
  );

  if (notification.link) {
    return (
      <Link href={notification.link} className="block">
        {content}
      </Link>
    );
  }

  return <div>{content}</div>;
}
