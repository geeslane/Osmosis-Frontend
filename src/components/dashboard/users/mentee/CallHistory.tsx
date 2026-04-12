'use client';

import { SearchIcon, StarIcon } from '@/assets/icons';
import { Column, DataTable } from '@/components/ui/table';
import { Pagination } from '@/components/ui/Pagination/Pagination';
import { useEffect, useMemo, useState } from 'react';
import DeleteModal from '@/components/ui/modal/DeleteModal/DeleteModal';
import CallDetail from '../mentor/CallDetail';
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
  const p = callRecordToPreviousRow(c, 'mentee');
  const parts = [p.menteeComment, c.comment].filter(
    (x) => x != null && String(x).trim() !== ''
  ) as string[];
  return parts.length ? parts.join(' · ') : '—';
}

interface CallHistoryTableProps {
  teenagerId?: string;
}

export default function CallHistoryTable({ teenagerId }: CallHistoryTableProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [viewCallDetails, setViewCallDetails] = useState(false);
  const [selectedCall, setSelectedCall] = useState<CallHistoryRow | null>(null);

  const { data, isLoading, isError } = useGetCallsQuery(
    { page: 1, limit: 500 },
    { skip: !teenagerId }
  );

  const rows = useMemo((): CallHistoryRow[] => {
    const raw = data?.data ?? [];
    if (!teenagerId) return [];
    return raw
      .filter((c) => c.menteeId === teenagerId)
      .map((c) => {
        const p = callRecordToPreviousRow(c, 'mentee');
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
  }, [data?.data, teenagerId]);

  const handleDelete = async () => {
    try {
      // await deleteApiCall()
    } finally {
      setOpen(false);
    }
  };
  const perPage = 5;

  const columns: Column<CallHistoryRow>[] = [
    {
      key: 'menteeName',
      label: 'Mentor Name',
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
          <span className="text-sm font-medium text-[#101828]">{dateTime}</span>
        );
      },
    },
    {
      key: 'topic',
      label: 'Topic',
      render: (row) => (
        <span className=" font-medium text-sm text-[#101828]">{row.topic}</span>
      ),
    },
    {
      key: 'comment',
      label: 'Comment',
      render: (row) => (
        <span className="text-sm font-medium text-[#101828]">
          {row.comment}
        </span>
      ),
    },
    {
      key: 'rating',
      label: 'Rating',
      render: (row) => (
        <div className="flex gap-1">
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
          counterpartyLabel="Mentor name"
          onBack={() => {
            setViewCallDetails(false);
            setSelectedCall(null);
          }}
        />
      ) : (
        <div className="space-y-4 mt-4 rounded-md border  border-[#6CBB0180] py-5">
          <div className="flex flex-col mx-6 md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-center gap-4">
              <h3 className="text-green-200 text-3xl font-bold">
                Call History
              </h3>
            </div>

            <div className="flex items-center gap-2 bg-[#DCFFAD91] px-3 py-2 rounded-lg max-w-[360px] w-full">
              <SearchIcon />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search"
                className="w-full text-sm bg-transparent focus:outline-none"
              />
            </div>
          </div>
          <DeleteModal
            isOpen={open}
            onCancel={() => setOpen(false)}
            onConfirm={handleDelete}
            //isLoading={loading}
            title="Delete Call History"
            description="Deleting this Call History will permanently Delete."
          />
          {isLoading && (
            <p className="mx-6 text-sm text-gray-500">Loading call history…</p>
          )}
          {isError && !isLoading && (
            <p className="mx-6 text-sm text-red-600">Could not load call history.</p>
          )}
          {!isLoading && !isError && teenagerId && filtered.length === 0 && (
            <p className="mx-6 text-sm text-gray-500">No calls found for this mentee.</p>
          )}
          {!isLoading && !isError && !teenagerId && (
            <p className="mx-6 text-sm text-gray-500">Missing mentee id.</p>
          )}
          {!isLoading && !isError && filtered.length > 0 && (
            <DataTable columns={columns} data={paginated} compact />
          )}

          {filtered.length > 0 ? (
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          ) : null}
        </div>
      )}
    </>
  );
}
