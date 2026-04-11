import ProgramScheduleContent from '@/components/dashboard/program-schedule/ProgramScheduleContent';
import { generateMetadata } from '@/utils/metadata';
import { Metadata } from 'next';

export const metadata: Metadata = generateMetadata({
  title: 'Osmosis | Program Schedule',
  description: 'Set program start and end dates and number of modules.',
});

export default function ProgramSchedulePage() {
  return <ProgramScheduleContent />;
}
