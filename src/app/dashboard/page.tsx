import Dashboard from '@/components/dashboard/Dashboard/Dashboard';
import PageTitle from '@/components/PageTitle';
import { generateMetadata } from '@/utils/metadata';
import { Metadata } from 'next';

export const metadata: Metadata = generateMetadata({
  title: 'Osmosis | Dashboard',
  description:
    'Access and manage your activities, insights, and platform operations from the Osmosis dashboard.',
});

export default function page() {
  return (
    <div>
      <PageTitle title="Dashboard" />
      <Dashboard />
    </div>
  );
}
