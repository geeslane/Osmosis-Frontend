'use client';
import { SearchIcon } from '@/assets/icons';
import Button from '@/components/ui/button/Button';
import { Pagination } from '@/components/ui/Pagination/Pagination';
import { Column, DataTable } from '@/components/ui/table';
import { useGetMentorUpcomingCallsQuery } from '@/store/calls/calls.api';
import { useGetMentorAvailabilityQuery } from '@/store/schedule/schedule.api';
import { callRecordToUpcomingRow, type UpcomingCall } from '@/utils/mapCallApi';
import { useEffect, useMemo, useState } from 'react';
import useToastify from '@/hooks/useToastify';

export type { UpcomingCall };

export default function UpcomingCallTable({
  onRowClick,
}: {
  onRowClick?: (row: UpcomingCall) => void;
}) {
  const { showToast } = useToastify();
  const { data, isLoading, isError } = useGetMentorUpcomingCallsQuery();
  const { data: availability } = useGetMentorAvailabilityQuery();
  /** Same `meetingLink` as Availability schedule when the call payload omits it */
  const scheduleMeetingLink = availability?.meetingLink?.trim() ?? '';

  const rows = useMemo(() => {
    const base = (data?.data ?? []).map((c) => callRecordToUpcomingRow(c, 'mentor'));
    if (!scheduleMeetingLink) return base;
    return base.map((row) => ({
      ...row,
      callUrl: row.callUrl?.trim() || scheduleMeetingLink,
    }));
  }, [data?.data, scheduleMeetingLink]);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter] = useState<'All' | UpcomingCall['status']>('All');

  const [perPage] = useState(5);

  const columns: Column<UpcomingCall>[] = [
    {
      key: 'name',
      label: 'Mentee Name',
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
      render: (row) => (
        <p className="font-medium text-sm text-[#101828]">{row.topic}</p>
      ),
    },
    {
      key: 'notes',
      label: 'Notes',
      render: (row) => (
        <span
          className="text-sm text-[#101828] line-clamp-2 max-w-[200px] block cursor-default"
          title={row.notes || undefined}
        >
          {row.notes || '—'}
        </span>
      ),
    },
    {
      key: 'status',
      label: '',
      render: (row) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <Button
            className="bg-green-100 text-white px-8 py-2 rounded-xl"
            onClick={() => {
              const url = row.callUrl?.trim();
              if (!url) {
                showToast('Meeting link is not available yet.', 'error');
                return;
              }
              window.open(url, '_blank', 'noopener,noreferrer');
            }}
          >
            Join call
          </Button>
        </div>
      ),
    },
  ];

  const filtered = rows.filter((row) => {
    const q = search.toLowerCase();
    if (statusFilter !== 'All' && row.status !== statusFilter) return false;
    if (!q) return true;
    return (
      row.name.toLowerCase().includes(q) ||
      row.date.toLowerCase().includes(q) ||
      row.topic.toLowerCase().includes(q) ||
      row.phone.toLowerCase().includes(q) ||
      (row.notes ?? '').toLowerCase().includes(q)
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
            Upcoming Calls
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
        <p className="mx-6 text-sm text-gray-500">Loading upcoming calls…</p>
      )}
      {isError && !isLoading && (
        <p className="mx-6 text-sm text-red-600">Could not load upcoming calls.</p>
      )}
      {!isLoading && !isError && filtered.length === 0 && (
        <p className="mx-6 text-sm text-gray-500">No upcoming calls.</p>
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
