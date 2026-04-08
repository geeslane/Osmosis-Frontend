'use client';

import { CancelIcon, EyeIcon } from '@/assets/icons';
import Button from '@/components/ui/button/Button';
import ActionModal from '@/components/ui/modal/ActionModal';
import { Pagination } from '@/components/ui/Pagination/Pagination';
import { Column, DataTable } from '@/components/ui/table';
import {
  formatSessionDateTime,
  isSessionPast,
  type LiveSessionRecord,
} from '@/lib/liveSessions';
import { liveSessionsApi } from '@/lib/liveSessionsApi';
import useToastify from '@/hooks/useToastify';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import type { DateSortDirection } from './Live';

type LiveTableProps = {
  data: LiveSessionRecord[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onCancelSuccess: () => void;
  dateSort: DateSortDirection | null;
  onDateSortChange: (direction: DateSortDirection) => void;
  /** When false (e.g. mentees), only View is shown; no Cancel */
  canManage?: boolean;
};

export default function LiveTable({
  data,
  page,
  totalPages,
  onPageChange,
  onCancelSuccess,
  dateSort,
  onDateSortChange,
  canManage = true,
}: LiveTableProps) {
  const router = useRouter();
  const { showToast } = useToastify();
  const [sessionToCancel, setSessionToCancel] = useState<LiveSessionRecord | null>(null);
  const [cancellationReason, setCancellationReason] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);

  const statusStyles: Record<LiveSessionRecord['status'], string> = {
    scheduled:
      'bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold',
    completed: 'bg-sky-50 text-sky-700 border border-sky-200 font-semibold',
    cancelled: 'bg-red-50 text-red-600 border border-red-200 font-semibold',
  };

  const canCancel = (row: LiveSessionRecord) =>
    row.status !== 'cancelled' && !isSessionPast(row.date, row.time);

  const handleConfirmCancel = async () => {
    if (!sessionToCancel) return;
    const reason = cancellationReason.trim();
    if (reason.length < 5) {
      showToast('Please provide a reason (at least 5 characters).', 'error');
      return;
    }
    setCancelLoading(true);
    try {
      await liveSessionsApi.cancel(sessionToCancel.id, { cancellationReason: reason });
      showToast('Live session cancelled. Users have been notified by email.', 'success');
      setSessionToCancel(null);
      setCancellationReason('');
      onCancelSuccess();
    } catch (err: unknown) {
      const message =
        err &&
        typeof err === 'object' &&
        'response' in err &&
        (err as { response?: { data?: { message?: string } } }).response?.data?.message
          ? (err as { response: { data: { message: string } } }).response.data.message
          : 'Failed to cancel session';
      showToast(String(message), 'error');
    } finally {
      setCancelLoading(false);
    }
  };

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
      label: (
        <div className="flex items-center gap-1.5">
          <span>DATE & TIME</span>
          <span className="inline-flex flex-col">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDateSortChange(dateSort === 'asc' ? null : 'asc');
              }}
              className={`p-0.5 leading-none rounded hover:bg-green-200/40 ${dateSort === 'asc' ? 'text-green-200 bg-green-200/30' : 'text-gray-400'}`}
              title={dateSort === 'asc' ? 'Clear sort (default order)' : 'Sort ascending (oldest first)'}
              aria-label={dateSort === 'asc' ? 'Clear sort' : 'Sort by date ascending'}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6" /></svg>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDateSortChange(dateSort === 'desc' ? null : 'desc');
              }}
              className={`p-0.5 leading-none rounded hover:bg-green-200/40 -mt-0.5 ${dateSort === 'desc' ? 'text-green-200 bg-green-200/30' : 'text-gray-400'}`}
              title={dateSort === 'desc' ? 'Clear sort (default order)' : 'Sort descending (newest first)'}
              aria-label={dateSort === 'desc' ? 'Clear sort' : 'Sort by date descending'}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
            </button>
          </span>
        </div>
      ),
      render: (row) => (
        <div className="min-w-[160px]">
          <span className="text-[#282F2E] font-medium text-sm">
            {formatSessionDateTime(row.date, row.time)}
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'STATUS',
      render: (row) => {
        const displayStatus = isSessionPast(row.date, row.time)
          ? 'completed'
          : row.status;
        return (
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs capitalize ${statusStyles[displayStatus]}`}
          >
            {displayStatus}
          </span>
        );
      },
    },
    {
      key: 'actions',
      label: 'ACTIONS',
      render: (row) => (
        <div
          className="relative flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            type="button"
            className="h-8 font-medium text-xs px-3 flex items-center justify-center gap-1.5 rounded-md !bg-[#1a0838] !text-white hover:!bg-green-300"
            onClick={() => router.push(`/dashboard/live-sessions/${row.id}`)}
          >
            <span className="inline-flex items-center justify-center shrink-0 [&_svg]:block -mt-1">
              <EyeIcon />
            </span>
            <span className="leading-none">View</span>
          </Button>
          {canManage && (
            <Button
              type="button"
              disabled={!canCancel(row)}
              className="h-8 bg-red-100 text-white font-medium text-xs px-3 flex items-center gap-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-200"
              onClick={() => {
                if (canCancel(row)) {
                  setSessionToCancel(row);
                  setCancellationReason('');
                }
              }}
            >
              <CancelIcon />
              Cancel
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-lg">
        <DataTable
          columns={columns}
          data={data}
          onRowClick={(row) => router.push(`/dashboard/live-sessions/${row.id}`)}
        />
      </div>
      <div className="mt-4 flex items-center justify-between pt-4">
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>

      <ActionModal
        isOpen={!!sessionToCancel}
        title="Cancel live session?"
        description="Emails will be sent to all users across the app. Please provide a reason."
        confirmText="Proceed"
        cancelText="Go back"
        isLoading={cancelLoading}
        onConfirm={handleConfirmCancel}
        onCancel={() => {
          setSessionToCancel(null);
          setCancellationReason('');
        }}
      >
        <div>
          <label className="block text-green-300 text-xs font-bold uppercase tracking-wide mb-1">
            Cancellation reason (required)
          </label>
          <textarea
            value={cancellationReason}
            onChange={(e) => setCancellationReason(e.target.value)}
            placeholder="e.g. Speaker unavailable"
            rows={3}
            className="w-full text-sm border border-green-200 rounded-lg px-3 py-2 focus:outline-none focus:border-green-300 resize-none"
          />
        </div>
      </ActionModal>
    </div>
  );
}
