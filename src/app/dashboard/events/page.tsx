import { generateMetadata } from '@/utils/metadata';
import { Metadata } from 'next';

export const metadata: Metadata = generateMetadata({
  title: 'Osmosis | Dashboard - Events',
  url: '/dashboard/events',
  description: 'Events - Osmosis Dashboard',
});

export default function EventsPage() {
  return <div className="flex flex-col gap-6">Hello</div>;
}
