import { MoreIcon } from '@/assets/icons';
import { Column, DataTable } from '@/components/ui/table';
import React from 'react';

type ModuleRow = {
  id: string;
  module: string;
  progress: number;
  deliverable: 'Complete' | 'Incomplete';
};

export default function ModulesTable() {
  const data: ModuleRow[] = [
    {
      id: '1',
      module: 'Introduction to UX Design',
      progress: 50,
      deliverable: 'Incomplete',
    },
  ];

  const columns: Column<ModuleRow>[] = [
    {
      key: 'module',
      label: 'MODULE',
      className: 'text-[#282F2E] font-medium',
    },
    {
      key: 'progress',
      label: 'PROGRESS',
      render: (row) => (
        <div className="space-y-2 min-w-[160px]">
          <p className="text-xs text-[#282F2E] font-medium">
            {row.progress}% completed
          </p>
          <div className="h-2 w-full rounded-full bg-lime-100">
            <div
              className="h-2 rounded-full bg-lime-600 transition-all"
              style={{ width: `${row.progress}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      key: 'deliverable',
      label: 'DELIVERABLE',
      render: (row) => (
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
            row.deliverable === 'Complete'
              ? 'bg-green-100 text-green-700'
              : 'bg-orange-100 text-orange-600'
          }`}
        >
          {row.deliverable}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'ACTIONS',

      render: () => (
        <div className="relative flex items-center space-x-2">
          <div className="p-2 rounded-md hover:bg-[#F9FAFB] cursor-pointer">
            <MoreIcon />
          </div>
        </div>
      ),
      className: 'text-center  flex justify-center',
    },
  ];

  return (
    <div className="">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
