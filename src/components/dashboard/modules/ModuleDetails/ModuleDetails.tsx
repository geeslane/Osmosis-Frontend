'use client';
import { GoBackIcon, NoteIcon } from '@/assets/icons';
import Tabs from '@/components/ui/Tabs';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import ModuleContent from './ModuleContent';

export default function ModuleDetails() {
  const searchParams = useSearchParams();
  const fileIdFromUrl = searchParams.get('fileId');
  console.log(fileIdFromUrl);
  return (
    <div>
      <Tabs
        containerClassName="max-w-[550px]"
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
            icon: '',
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
        <div className="flex cursor-pointer items-center gap-1">
          <GoBackIcon />
          <h3 className="text-sm text-green-200 font-medium">Back</h3>
        </div>
        <div className="space-y-[37px] mt-[37px]">
          <h3 className="text-green-200 font-bold text-xl md:text-[32px]">
            Module 1
          </h3>
          <div className="rounded-lg flex flex-col md:flex-row gap-10 border border-[#6CBB0180] px-10 md:px-[64px] py-8 space-y-2">
            <ModuleContent />
            
          </div>
          {fileIdFromUrl}
        </div>
      </div>
    </div>
  );
}
