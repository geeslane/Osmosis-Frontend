import Header from '@/layout/dashboard/Header';
import { generateMetadata } from '@/utils/metadata';
import { Metadata } from 'next';

export const metadata: Metadata = generateMetadata({
  title: 'Osmosis | Dashboard - Explore Courses',
  url: '/dashboard/explore-courses',
  description: 'Explore Courses - Osmosis Dashboard',
});

export default function page() {
  return (
    <div className="flex flex-col gap-6">
      <Header Heading={'Explore Courses'} link="/dashboard/explore-courses" />
    </div>
  );
}
