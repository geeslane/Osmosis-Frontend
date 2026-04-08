'use client';

import { SearchIcon, StarIcon } from '@/assets/icons';
import { Column, DataTable } from '@/components/ui/table';
import { Pagination } from '@/components/ui/Pagination/Pagination';
import { useEffect, useState } from 'react';
import DeleteModal from '@/components/ui/modal/DeleteModal/DeleteModal';
import CallDetail from '../mentor/CallDetail';

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

const callHistoryData: CallHistoryRow[] = [
  {
    id: '1',
    menteeName: 'Olivia Rhye',
    date: '12 Dec, 2025',
    time: '10:00 AM',
    topic: 'Hope',
    callLength: '55mins 34s',
    comment: 'Good',
    rating: 3,
  },
  {
    id: '2',
    menteeName: 'Phoenix Baker',
    date: '12 Dec, 2025',
    time: '2:30 PM',
    topic: 'Joy in Chaos',
    callLength: '1hr 23mins 5s',
    comment: 'Rescheduled',
    rating: 2,
  },
  {
    id: '3',
    menteeName: 'Lana Steiner',
    date: '12 Dec, 2025',
    time: '4:15 PM',
    topic: 'Shame',
    callLength: '1hr 23mins 5s',
    comment: 'Completed',
    rating: 4,
  },
  {
    id: '4',
    menteeName: 'Demi Wilkinson',
    date: '12 Dec, 2025',
    time: '11:00 AM',
    topic: 'Overcoming fear',
    callLength: '1hr 23mins 5s',
    comment: 'Good',
    rating: 4,
  },
];

export default function CallHistoryTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [viewCallDetails, setViewCallDetails] = useState(false);
  const [selectedCall, setSelectedCall] = useState<CallHistoryRow | null>(null);

  const handleDelete = async () => {
    // setLoading(true);
    try {
      // await deleteApiCall()
    } finally {
      //setLoading(false);
      //setOpen(false);
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

  const filtered = callHistoryData.filter((row) => {
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
          <DataTable columns={columns} data={paginated} compact />

          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </>
  );
}
