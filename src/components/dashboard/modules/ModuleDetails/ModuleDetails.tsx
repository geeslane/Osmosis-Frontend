'use client';
import { GoBackIcon, NoteIcon, WorkBookIcon } from '@/assets/icons';
import Tabs from '@/components/ui/Tabs';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import ModuleContent from './ModuleContent';
import Link from 'next/link';
import PageTitle from '@/components/PageTitle';

export default function ModuleDetails() {
  const searchParams = useSearchParams();
  const fileIdFromUrl = searchParams.get('fileId');
  console.log(fileIdFromUrl);
  return (
    <div>
      <Tabs
        containerClassName="w-full  md:max-w-[550px]"
        paramKey="content"
        defaultValue="Note"
        tabs={[
          {
            title: 'Note',
            value: 'Note',
            icon: <NoteIcon />,
          },
          {
            title: 'Workbook',
            value: 'Workbook',
            icon: <WorkBookIcon />,
          },
          {
            title: 'Deliverable',
            value: 'Deliverable',
            icon: '',
          },
          {
            title: ' Additional Resources',
            value: 'Additional',
            icon: '',
          },
        ]}
      />
      <div className="mt-10">
        <Link
          href={'/dashboard/modules'}
          className="flex cursor-pointer items-center gap-1"
        >
          <GoBackIcon />
          <h3 className="text-sm text-green-200 font-medium">Back</h3>
        </Link>
        <div className="space-y-[37px] mt-[37px]">
          <PageTitle title="Modules 1" />

          <div className="rounded-lg flex max-w-[639px] w-full flex-col md:flex-row gap-10 border border-[#6CBB0180] px-10 md:px-[64px] py-8 space-y-2">
            <ModuleContent />
          </div>
          {fileIdFromUrl}
        </div>
      </div>
    </div>
  );
}
