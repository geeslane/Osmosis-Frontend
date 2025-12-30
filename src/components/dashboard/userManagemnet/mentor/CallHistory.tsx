'use client';

import { MoreIcon, SearchIcon, StarIcon } from '@/assets/icons';
import { Column, DataTable } from '@/components/ui/table';
import { Pagination } from '@/components/ui/Pagination/Pagination';
import { useEffect, useState } from 'react';
import DeleteModal from '@/components/ui/modal/DeleteModal/DeleteModal';
import CallDetail from './CallDetail';

type CallHistoryRow = {
  id: string;
  menteeName: string;
  date: string;
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
    topic: 'Hope',
    callLength: '55mins 34s',
    comment: 'Good',
    rating: 3,
  },
  {
    id: '2',
    menteeName: 'Phoenix Baker',
    date: '12 Dec, 2025',
    topic: 'Joy in Chaos',
    callLength: '1hr 23mins 5s',
    comment: 'Rescheduled',
    rating: 2,
  },
  {
    id: '3',
    menteeName: 'Lana Steiner',
    date: '12 Dec, 2025',
    topic: 'Shame',
    callLength: '1hr 23mins 5s',
    comment: 'Completed',
    rating: 4,
  },
  {
    id: '4',
    menteeName: 'Demi Wilkinson',
    date: '12 Dec, 2025',
    topic: 'Overcoming fear',
    callLength: '1hr 23mins 5s',
    comment: 'Good',
    rating: 4,
  },
];

export default function CallHistoryTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);
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
      label: 'Mentees Name',
      render: (row) => (
        <span className="font-medium text-sm text-[#667085]">
          {row.menteeName}
        </span>
      ),
    },
    {
      key: 'date',
      label: 'Date',
      render: (row) => (
        <span className="text-sm font-medium text-[#667085]">{row.date}</span>
      ),
    },
    {
      key: 'topic',
      label: 'Topic',
      render: (row) => (
        <span className=" font-medium text-sm text-[#667085]">{row.topic}</span>
      ),
    },
    {
      key: 'callLength',
      label: 'Call Length',
      render: (row) => (
        <span className="text-sm font-medium text-[#667085]">
          {row.callLength}
        </span>
      ),
    },
    {
      key: 'comment',
      label: 'Comment',
      render: (row) => (
        <span className="text-sm font-medium text-[#667085]">
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
    {
      key: 'actions',
      label: 'Action',
      render: (row) => (
        <div className="relative flex items-center space-x-2">
          <div
            onClick={() =>
              setOpenId((prev) => (prev === row.id ? null : row.id))
            }
            className="p-2 rounded-md hover:bg-[#F9FAFB] cursor-pointer"
          >
            <MoreIcon />
          </div>

          {openId === row.id && (
            <div className="absolute top-8 right-0 z-50 flex flex-col gap-2 w-[180px] bg-white rounded-lg shadow-lg text-sm text-green-300 py-2">
              <button
                type="button"
                className="px-3 py-2 w-full text-left hover:bg-[#DCFFAD91] rounded-md"
                onClick={() => {
                  // show details for this row
                  setSelectedCall(row);
                  setViewCallDetails(true);
                  setOpenId(null);
                }}
              >
                View
              </button>

              <button
                type="button"
                className="px-3 py-2 w-full text-left hover:bg-[#DCFFAD91] rounded-md"
                onClick={() => {
                  setOpen(true);
                  setOpenId(null);
                }}
              >
                Delete
              </button>
            </div>
          )}
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
          <DataTable columns={columns} data={paginated} />

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
