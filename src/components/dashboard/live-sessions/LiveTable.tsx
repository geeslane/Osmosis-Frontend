'use client';

import { CancelIcon, EyeIcon } from '@/assets/icons';
import Button from '@/components/ui/button/Button';
import ActionModal from '@/components/ui/modal/ActionModal';
import { Pagination } from '@/components/ui/Pagination/Pagination';
import { Column, DataTable } from '@/components/ui/table';
import {
  formatSessionDateTime,
  getLiveSessions,
  isSessionPast,
  updateLiveSessionStatus,
  type LiveSessionRecord,
} from '@/lib/liveSessions';
import useToastify from '@/hooks/useToastify';
import { useRouter } from 'next/navigation';
import React, { useMemo, useState, useEffect } from 'react';

const PER_PAGE = 10;

type LiveTableProps = {
  search?: string;
};

export default function LiveTable({ search = '' }: LiveTableProps) {
  const router = useRouter();
  const { showToast } = useToastify();
  const [page, setPage] = useState(1);
  const [sessionToCancel, setSessionToCancel] = useState<LiveSessionRecord | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const filteredData = useMemo(() => {
    const list = getLiveSessions();
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (row) =>
        row.topic.toLowerCase().includes(q) ||
        row.speakerName.toLowerCase().includes(q) ||
        formatSessionDateTime(row.date, row.time).toLowerCase().includes(q)
    );
  }, [search, refreshKey]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / PER_PAGE));
  const paginatedData = useMemo(
    () =>
      filteredData.slice((page - 1) * PER_PAGE, page * PER_PAGE),
    [filteredData, page]
  );

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [page, totalPages]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const data = paginatedData;

  const statusStyles: Record<LiveSessionRecord['status'], string> = {
    scheduled: 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold',
    completed: 'bg-sky-50 text-sky-700 border border-sky-200 font-semibold',
    cancelled: 'bg-red-50 text-red-600 border border-red-200 font-semibold',
  };

  const canCancel = (row: LiveSessionRecord) =>
    row.status !== 'cancelled' && !isSessionPast(row.date, row.time);

  const columns: Column<LiveSessionRecord>[] = [
    {
      key: 'topic',
      label: 'TOPIC',
      className: 'text-[#282F2E] font-medium',
    },
    {
      key: 'speakerName',
      label: 'SPEAKER NAME',
      className: 'text-[#282F2E] font-medium',
    },
    {
      key: 'time',
      label: 'DATE & TIME',
      render: (row) => (
        <div className="space-y-2 min-w-[160px]">
          <h3 className="text-black-[#808080] font-medium text-sm">
            {formatSessionDateTime(row.date, row.time)}
          </h3>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'STATUS',
      render: (row) => (
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs capitalize ${statusStyles[row.status]}`}
        >
          {row.status}
        </span>
      ),
      className: '',
    },
    {
      key: 'actions',
      label: 'ACTIONS',
      render: (row) => (
        <div
          className="relative flex items-center space-x-2"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            type="button"
            className="h-8 bg-green-200 text-white font-medium text-xs px-3 py-2 flex items-center justify-center gap-1 rounded-md"
            onClick={() =>
              router.push(`/dashboard/live-sessions/${row.id}`)
            }
          >
            <EyeIcon />
            View
          </Button>
          <Button
            type="button"
            disabled={!canCancel(row)}
            className="h-8 bg-red-100 text-white font-medium text-xs px-3 py-2 flex items-center gap-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => canCancel(row) && setSessionToCancel(row)}
          >
            <CancelIcon />
            Cancel
          </Button>
        </div>
      ),
      className: '',
    },
  ];

  const handleConfirmCancel = () => {
    if (sessionToCancel) {
      updateLiveSessionStatus(sessionToCancel.id, 'cancelled');
      setRefreshKey((k) => k + 1);
      showToast('Live session cancelled. Users have been notified by email.', 'success');
      setSessionToCancel(null);
    }
  };

  return (
    <div className="w-full space-y-0">
      <DataTable
        columns={columns}
        data={data}
        onRowClick={(row) =>
          router.push(`/dashboard/live-sessions/${row.id}`)
        }
      />
      <div className="flex items-center justify-between">
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

      <ActionModal
        isOpen={!!sessionToCancel}
        title="Cancel live session?"
        description="Emails will be sent to all users across the app. Proceed?"
        confirmText="Proceed"
        cancelText="Go back"
        onConfirm={handleConfirmCancel}
        onCancel={() => setSessionToCancel(null)}
      />
    </div>
  );
}
