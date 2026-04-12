'use client';

import { DownloadIcon, SearchIcon, StarIcon } from '@/assets/icons';
import { Column, DataTable } from '@/components/ui/table';
import { Pagination } from '@/components/ui/Pagination/Pagination';
import Button from '@/components/ui/button/Button';
import { useEffect, useMemo, useState } from 'react';
import DeleteModal from '@/components/ui/modal/DeleteModal/DeleteModal';
import CallDetail from './CallDetail';
import { downloadCallReport } from '@/utils/downloadCallReport';
import { useGetCallsQuery } from '@/store/calls/calls.api';
import type { CallRecord } from '@/store/calls/calls.api';
import { callRecordToPreviousRow } from '@/utils/mapCallApi';

type CallHistoryRow = {
  id: string;
  menteeName: string;
  date: string;
  time?: string;
  topic: string;
  callLength: string;
  comment: string;
  rating: number;
};

function commentCell(c: CallRecord) {
  const p = callRecordToPreviousRow(c, 'mentor');
  const parts = [p.menteeComment, p.mentorComment].filter(
    (x) => x != null && String(x).trim() !== ''
  ) as string[];
  return parts.length ? parts.join(' · ') : '—';
}

interface CallHistoryTableProps {
  mentorId?: string;
  mentorName?: string;
}

export default function CallHistoryTable({ mentorId, mentorName }: CallHistoryTableProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [viewCallDetails, setViewCallDetails] = useState(false);
  const [selectedCall, setSelectedCall] = useState<CallHistoryRow | null>(null);

  const { data, isLoading, isError } = useGetCallsQuery(
    { page: 1, limit: 500 },
    { skip: !mentorId }
  );

  const rows = useMemo((): CallHistoryRow[] => {
    const raw = data?.data ?? [];
    if (!mentorId) return [];
    return raw
      .filter((c) => c.mentorId === mentorId)
      .map((c) => {
        const p = callRecordToPreviousRow(c, 'mentor');
        return {
          id: p.id,
          menteeName: p.name,
          date: p.date,
          time: p.time,
          topic: p.topic,
          callLength: c.callLength ?? '—',
          comment: commentCell(c),
          rating: p.rating != null && p.rating >= 0 ? p.rating : 0,
        };
      });
  }, [data?.data, mentorId]);

  const handleDelete = async () => {
    try {
      // await deleteApiCall()
    } finally {
      setOpen(false);
    }
  };

  const handleDownloadReport = (scope?: 'all' | string) => {
    const toExport = scope
      ? filtered.filter((r) => r.menteeName === scope)
      : filtered;
    const reportData = toExport.map((r) => ({
      'Mentee Name': r.menteeName,
      'Date & Time': r.time ? `${r.date}, ${r.time}` : r.date,
      Topic: r.topic,
      Comment: r.comment,
      Rating: r.rating,
    }));
    const filename = scope
      ? `call-history-${scope.replace(/\s+/g, '-')}.csv`
      : mentorName
        ? `call-history-${mentorName.replace(/\s+/g, '-')}.csv`
        : 'mentor-call-history.csv';
    downloadCallReport(reportData, filename);
  };

  const perPage = 5;

  const columns: Column<CallHistoryRow>[] = [
    {
      key: 'menteeName',
      label: 'Mentee Name',
      render: (row) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedCall(row);
            setViewCallDetails(true);
          }}
          className="font-medium text-sm text-[#101828] hover:text-green-600 cursor-pointer text-left"
        >
          {row.menteeName}
        </button>
      ),
    },
    {
      key: 'date',
      label: 'Date & Time',
      render: (row) => {
        const dateTime = row.time ? `${row.date}, ${row.time}` : row.date;
        return (
          <span className="text-sm font-medium text-gray-600">{dateTime}</span>
        );
      },
    },
    {
      key: 'topic',
      label: 'Topic',
      render: (row) => (
        <span className="font-medium text-sm text-green-200">{row.topic}</span>
      ),
    },
    {
      key: 'comment',
      label: 'Comment',
      render: (row) => (
        <span className="text-sm font-medium text-gray-600">{row.comment}</span>
      ),
    },
    {
      key: 'rating',
      label: 'Rating',
      render: (row) => (
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon key={i} fill={i < row.rating ? '#F59E0B' : '#E5E7EB'} />
          ))}
        </div>
      ),
    },
  ];

  const filtered = rows.filter((row) => {
    const q = search.toLowerCase();
    if (!q) return true;
    return (
      row.menteeName.toLowerCase().includes(q) ||
      row.topic.toLowerCase().includes(q) ||
      row.comment.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [page, totalPages]);

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <>
      {viewCallDetails ? (
        <CallDetail
          call={selectedCall}
          counterpartyLabel="Mentee name"
          onBack={() => {
            setViewCallDetails(false);
            setSelectedCall(null);
          }}
        />
      ) : (
        <div className="mt-6 max-w-5xl">
          <div className="rounded-xl border border-green-200/60 bg-white shadow-sm overflow-hidden">
            <div className="flex flex-col gap-4 p-6 border-b border-gray-100 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-xl font-bold text-green-200">
                Call History
              </h3>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex items-center gap-2 rounded-lg border border-green-200/60 bg-gray-50/50 px-3 py-2 min-w-[200px] sm:min-w-[260px]">
                  <SearchIcon className="text-gray-400 shrink-0" />
                  <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by mentee or topic"
                    className="w-full text-sm bg-transparent focus:outline-none text-green-200 placeholder:text-gray-400"
                  />
                </div>
                <Button
                  variant="primary"
                  onClick={() => handleDownloadReport()}
                  leftIcon={<DownloadIcon width="18" height="18" className="text-white" />}
                  className="shrink-0"
                >
                  Download Report
                </Button>
              </div>
            </div>

            <DeleteModal
              isOpen={open}
              onCancel={() => setOpen(false)}
              onConfirm={handleDelete}
              title="Delete Call Record"
              description="This call record will be permanently removed. This action cannot be undone."
            />

            {isLoading && (
              <p className="px-6 py-4 text-sm text-gray-500">Loading call history…</p>
            )}
            {isError && !isLoading && (
              <p className="px-6 py-4 text-sm text-red-600">Could not load call history.</p>
            )}
            {!isLoading && !isError && mentorId && filtered.length === 0 && (
              <p className="px-6 py-4 text-sm text-gray-500">No calls found for this mentor.</p>
            )}
            {!isLoading && !isError && !mentorId && (
              <p className="px-6 py-4 text-sm text-gray-500">Missing mentor id.</p>
            )}

            {!isLoading && !isError && filtered.length > 0 && (
              <DataTable columns={columns} data={paginated} compact />
            )}

            {filtered.length > 0 ? (
              <div className="px-6 py-4 border-t border-gray-100">
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}
