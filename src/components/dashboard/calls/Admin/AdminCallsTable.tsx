'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { SearchIcon } from '@/assets/icons';
import { Column, DataTable } from '@/components/ui/table';
import { Pagination } from '@/components/ui/Pagination/Pagination';
import { useAdminCallsQuery } from '@/store/dashboard/dashboard.api';
import {
  adminCallStatusBadgeClass,
  getAdminCallDisplayStatusFromApiRow,
  type AdminCallStatusBadge,
} from '@/utils/adminCallDisplayStatus';

function pickArray(payload: any): any[] {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  if (Array.isArray(payload?.data?.data?.data)) return payload.data.data.data;
  return [];
}

function formatDateTime(dateLike: any) {
  const d = dateLike ? new Date(dateLike) : null;
  if (!d || Number.isNaN(d.getTime())) return { date: '—', time: '—' };
  return {
    date: d.toLocaleDateString(undefined, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }),
    time: d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }),
  };
}

type AdminCallRow = {
  id: string;
  mentor: string;
  mentee: string;
  topic: string;
  date: string;
  time: string;
  status: string;
  statusBadge: AdminCallStatusBadge;
};

export default function AdminCallsTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [perPage] = useState(10);

  const { data, isLoading, isError } = useAdminCallsQuery({
    page,
    limit: perPage,
    q: search || undefined,
  });

  const rows = useMemo<AdminCallRow[]>(() => {
    const items = pickArray(data);
    return items.map((c: any) => {
      const { date, time } = formatDateTime(c?.scheduledAt ?? c?.startTime ?? c?.date);
      const derived = getAdminCallDisplayStatusFromApiRow({
        status: c?.status,
        scheduledAt: c?.scheduledAt,
        startTime: c?.startTime,
        date: c?.date,
        dateFormatted: c?.dateFormatted,
      });
      return {
        id: String(c?.id ?? c?._id ?? c?.callId ?? ''),
        mentor: c?.mentor?.fullName ?? c?.mentorName ?? '—',
        mentee: c?.teenager?.teenagerFullName ?? c?.teenager?.fullName ?? c?.teenagerName ?? c?.menteeName ?? '—',
        topic: c?.topic ?? c?.sessionTopic ?? '—',
        date,
        time,
        status: derived.label,
        statusBadge: derived.badge,
      };
    });
  }, [data]);

  const totalPages = Math.max(
    1,
    Number(data?.data?.data?.totalPages ?? data?.data?.totalPages ?? 1)
  );

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [page, totalPages]);

  const columns: Column<AdminCallRow>[] = [
    { key: 'mentor', label: 'Mentor', render: (r) => <span className="text-sm text-[#667085]">{r.mentor}</span> },
    { key: 'mentee', label: 'Mentee', render: (r) => <span className="text-sm text-[#667085]">{r.mentee}</span> },
    { key: 'topic', label: 'Topic', render: (r) => <span className="text-sm text-[#667085]">{r.topic}</span> },
    { key: 'date', label: 'Date', render: (r) => <span className="text-sm text-[#667085]">{r.date}</span> },
    { key: 'time', label: 'Time', render: (r) => <span className="text-sm text-[#667085]">{r.time}</span> },
    {
      key: 'status',
      label: 'Status',
      render: (r) => (
        <span
          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${adminCallStatusBadgeClass(r.statusBadge)}`}
        >
          {r.status}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-3 border-[#DCFFAD] border-1 mt-4 pb-10">
      <div className="flex flex-col mx-6 my-[18px] md:flex-row md:items-center md:justify-between gap-2">
        <div className="relative inline-flex items-center ">
          <h3 className="font-semibold text-2xl text-green-200">All Calls</h3>
        </div>
        <div className="relative flex items-center h-[44px] gap-3 w-[363px] bg-[#DCFFAD91] px-2 rounded-lg">
          <SearchIcon className="text-gray-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search"
            className="w-full h-full text-sm bg-transparent focus:outline-none"
          />
        </div>
      </div>

      {isError && (
        <p className="mx-6 text-sm text-red-600">Failed to load calls.</p>
      )}
      {isLoading ? (
        <p className="mx-6 text-sm text-green-200/70">Loading…</p>
      ) : (
        <DataTable columns={columns} data={rows} />
      )}
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}

