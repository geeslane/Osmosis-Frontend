import ModuleDetails from '@/components/dashboard/modules/ModuleDetails/ModuleDetails';
import PageTitle from '@/components/PageTitle';

export default function ModulePage() {
  return (
    <div>
      <PageTitle title="Modules" />
      <ModuleDetails />
    </div>
  );
}
