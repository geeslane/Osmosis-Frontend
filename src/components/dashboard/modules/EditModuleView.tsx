'use client';
import { GoBackIcon, LoadingIcon } from '@/assets/icons';
import AddModule from './AddModule';
import { useGetModuleByIdQuery } from '@/store/dashboard/dashboard.api';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Animated from '@/components/common/Animation';

export default function EditModuleView() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const id = typeof params.id === 'string' ? params.id : (params.id?.[0] ?? '');
  const { data, isLoading } = useGetModuleByIdQuery(id, { skip: !id });
  const moduleData = data?.data?.data;
  const returnTab = searchParams.get('content') || 'Note';

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoadingIcon
          width="40"
          height="40"
          className="animate-spin text-green-100"
        />
      </div>
    );
  }

  if (!moduleData) {
    return (
      <div className="space-y-9">
        <Link
          href="/dashboard/modules"
          className="flex cursor-pointer items-center gap-1 text-green-200"
        >
          <GoBackIcon />
          <span className="text-sm font-medium">Back</span>
        </Link>
        <p className="text-green-200">Module not found.</p>
      </div>
    );
  }

  return (
    <Animated activeKey={'params'} className="space-y-9">
      <Link
        href={`/dashboard/modules/${moduleData.id}?content=${returnTab}`}
        className="flex cursor-pointer items-center gap-1"
      >
        <GoBackIcon />
        <h3 className="text-sm text-green-200 font-medium">Back</h3>
      </Link>
      <h3 className="text-green-200 text-2xl font-bold">Edit Module</h3>
      <div className="rounded-md max-w-[747px] px-4 md:px-[64px] border-2 border-[#6CBB0180] py-8 w-full">
        <AddModule module={moduleData} />
      </div>
    </Animated>
  );
}
