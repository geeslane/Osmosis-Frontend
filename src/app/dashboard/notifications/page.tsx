import NotificationsList from '@/components/dashboard/notifications/NotificationsList';
import { generateMetadata } from '@/utils/metadata';
import { Metadata } from 'next';

export const metadata: Metadata = generateMetadata({
  title: 'Osmosis | Notifications',
  description: 'View all your notifications.',
});

export default function NotificationsPage() {
  return <NotificationsList />;
}
