import ModuleDetails from '@/components/dashboard/modules/ModuleDetails/ModuleDetails';
import { generateMetadata } from '@/utils/metadata';
import { Metadata } from 'next';

export const metadata: Metadata = generateMetadata({
  title: 'Osmosis | Modules Details',
  description:
    'Instructor-led Osmosis modules designed for deep learning through structured live sessions, real-time explanations, interactive problem-solving, and guided Q&A.',
});
export default function ModulePage() {
  return (
    <div>
      <ModuleDetails />
    </div>
  );
}
