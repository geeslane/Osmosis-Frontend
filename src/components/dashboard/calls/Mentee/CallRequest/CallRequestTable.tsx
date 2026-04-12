'use client';
import { SearchIcon } from '@/assets/icons';
import { Pagination } from '@/components/ui/Pagination/Pagination';
import { Column, DataTable } from '@/components/ui/table';
import { useTeenagerCallRequestsQuery } from '@/store/dashboard/dashboard.api';
import {
  pickCallsArray,
  rawToTeenagerCallRequestRow,
  type TeenagerCallRequestRow,
} from '@/utils/mapCallApi';
import { useEffect, useMemo, useState } from 'react';

export type RequestCall = TeenagerCallRequestRow;

export default function CallRequestTable({ onRowClick }: { onRowClick?: (row: RequestCall) => void }) {
  const { data: raw, isLoading, isError } = useTeenagerCallRequestsQuery();

  const data = useMemo(
    () => pickCallsArray(raw).map(rawToTeenagerCallRequestRow),
    [raw]
  );

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter] = useState<'All' | RequestCall['status']>('All');

  const [perPage] = useState(5);

  const statusLabel: Record<RequestCall['status'], string> = {
    Pending: 'Pending',
    Active: 'Accepted',
    Inactive: 'Declined',
  };

  const columns: Column<RequestCall>[] = [
    {
      key: 'name',
      label: 'Mentor Name',
      render: (row) => (
        <span className="font-medium text-sm text-[#101828]">{row.name}</span>
      ),
    },
    {
      key: 'date',
      label: 'Date & Time',
      render: (row) => {
        const dateTime = row.time ? `${row.date}, ${row.time}` : row.date;
        return (
          <div className="flex items-center gap-2 w-[200px]">
            <p className="font-medium text-sm text-[#101828]">{dateTime}</p>
          </div>
        );
      },
    },
    {
      key: 'topic',
      label: 'Topic',
      render: (row) => {
        return (
          <div className="flex items-center gap-2 w-[100px] ">
            <p className="font-medium text-sm text-[#101828]">{row.topic}</p>
          </div>
        );
      },
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            row.status === 'Active'
              ? 'bg-green-50 text-green-700'
              : row.status === 'Inactive'
                ? 'bg-red-50 text-red-600'
                : 'bg-amber-50 text-amber-700'
          }`}
        >
          {statusLabel[row.status]}
        </span>
      ),
    },
  ];

  const filtered = data.filter((row) => {
    const q = search.toLowerCase();
    if (statusFilter !== 'All' && row.status !== statusFilter) return false;
    if (!q) return true;
    return (
      row.name.toLowerCase().includes(q) ||
      row.date.toLowerCase().includes(q) ||
      row.topic.toLowerCase().includes(q) ||
      row.phone.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [page, totalPages]);

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="space-y-3  border-[#DCFFAD] border-1 mt-10 pb-10">
      <div className="flex flex-col mx-6 my-[18px] md:flex-row md:items-center md:justify-between gap-2">
        <div className="relative inline-flex items-center ">
          <h3 className="font-semibold text-2xl text-green-200">
            Call Requests
          </h3>
        </div>
        <div className="relative flex items-center h-[44px] gap-3 w-[363px] bg-[#DCFFAD91] px-2 rounded-lg">
          <SearchIcon className="text-gray-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name"
            className="w-full h-full text-sm bg-transparent focus:outline-none"
          />
        </div>
      </div>

      {isLoading && (
        <p className="mx-6 text-sm text-gray-500">Loading your requests…</p>
      )}
      {isError && !isLoading && (
        <p className="mx-6 text-sm text-red-600">Could not load call requests.</p>
      )}
      {!isLoading && !isError && filtered.length === 0 && (
        <p className="mx-6 text-sm text-gray-500">
          No call requests yet. Book a call from the dashboard to see them here.
        </p>
      )}

      <DataTable
        columns={columns}
        data={paginated}
        compact
        onRowClick={onRowClick}
      />
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
