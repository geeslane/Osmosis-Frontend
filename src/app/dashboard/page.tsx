import { generateMetadata } from '@/utils/metadata';
import { Metadata } from 'next';

export const metadata: Metadata = generateMetadata({
  title: 'Osmosis | Dashboard - Home',
  description: 'Dashboard - Osmosis',
  url: '/dashboard',
});

export default function DashboardHome() {
  return <h3>Hello</h3>;
}
