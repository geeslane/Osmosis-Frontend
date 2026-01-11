import { CancelIcon, Edit } from '@/assets/icons';
import Button from '@/components/ui/button/Button';
import { Column, DataTable } from '@/components/ui/table';
import React from 'react';

type LiveTable = {
  id: string;
  topic: string;
  time: string;
};

export default function LiveTable() {
  const data: LiveTable[] = [
    {
      id: '1',
      topic: 'Create a User Persona',
      time: '11/01/25 - 2:00PM',
    },
  ];

  const columns: Column<LiveTable>[] = [
    {
      key: 'topic',
      label: 'TOPIC',
      className: 'text-[#282F2E] font-medium',
    },
    {
      key: 'time',
      label: 'DATE & TIME',
      render: (row) => (
        <div className="space-y-2 min-w-[160px]">
          <h3 className="text-black-[#808080] font-medium text-sm">
            {row.time}
          </h3>
        </div>
      ),
    },

    {
      key: 'actions',
      label: 'ACTIONS',

      render: () => (
        <div className="relative flex items-center space-x-2">
          <Button className="bg-green-200 text-white font-medium text-xs px-3 py-2 flex items-center gap-1 rounded-md">
            <Edit />
            Edit
          </Button>
          <Button className="bg-red-100 text-white font-medium text-xs px-3 py-2 flex items-center gap-1 rounded-md">
            <CancelIcon />
            Cancel
          </Button>
        </div>
      ),
      className: '',
    },
  ];

  return (
    <div className=" border-b-2 border-green-100">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
