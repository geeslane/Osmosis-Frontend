import EditModuleView from '@/components/dashboard/modules/EditModuleView';
import { generateMetadata } from '@/utils/metadata';
import { Metadata } from 'next';

export const metadata: Metadata = generateMetadata({
  title: 'Osmosis | Edit Module',
  description: 'Edit an existing Osmosis module.',
});

export default function EditModulePage() {
  return (
    <div className="mb-10 mt-5">
      <EditModuleView />
    </div>
  );
}
