'use client';
import { SearchIcon } from '@/assets/icons';
import Button from '@/components/ui/button/Button';
import { Pagination } from '@/components/ui/Pagination/Pagination';
import { Column, DataTable } from '@/components/ui/table';
import { useEffect, useState } from 'react';
import useToastify from '@/hooks/useToastify';
import DeclineModal from '@/components/ui/modal/DeclineModal/DeclineModal';

export type UpcomingCall = {
  id: string;
  name: string;
  date: string;
  time: string;
  topic: string;
  phone: string;
  notes?: string;
  status: 'Active' | 'Inactive' | 'Pending';
  image?: string;
  /** Meeting/call URL – Join call opens this in a new tab */
  callUrl?: string;
};

export default function UpcomingCallTable({ onView, onRowClick }: { onView?: () => void; onRowClick?: (row: UpcomingCall) => void }) {
  const { showToast } = useToastify();
  const [data, setData] = useState<UpcomingCall[]>([
    {
      id: '1',
      name: 'John Doe',
      date: '12 Dec., 2025',
      time: '10am',
      topic: 'Hope',
      phone: '08012345678',
      notes: 'Wants to focus on study habits and time management.',
      status: 'Pending',
    },
    {
      id: '2',
      name: 'Mary Johnson',
      date: '12 Dec., 2025',
      time: '10am',
      topic: 'Hope',
      phone: '08087654321',
      notes: 'Interested in career guidance and goal-setting.',
      status: 'Active',
    },
    {
      id: '3',
      name: 'David Smith',
      date: '12 Dec., 2025',
      topic: 'Hope',
      time: '10am',
      phone: '08123456789',
      notes: '',
      status: 'Inactive',
    },
    {
      id: '4',
      name: 'Sarah Wilson',
      date: '12 Dec., 2025',
      topic: 'Hope',
      time: '10am',
      phone: '08099887766',
      notes: 'Follow-up on previous session about confidence.',
      status: 'Pending',
    },
    {
      id: '5',
      name: 'Daniel Adams',
      date: '12 Dec., 2025',
      topic: 'Hope',
      time: '10am',
      phone: '08111112222',
      notes: 'First call – introduction and expectations.',
      status: 'Pending',
    },
  ]);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter] = useState<'All' | UpcomingCall['status']>('All');

  const [perPage] = useState(5);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [declineModalOpen, setDeclineModalOpen] = useState(false);
  const [declineId, setDeclineId] = useState<string | null>(null);

  const handleDeclineConfirm = async (reason: string) => {
    if (!declineId) return;

    setProcessingId(declineId);
    setDeclineModalOpen(false);

    setTimeout(() => {
      setData((prev) =>
        prev.map((item) =>
          item.id === declineId ? { ...item, status: 'Inactive' } : item
        )
      );

      showToast(`Declined: ${reason}`, 'success');

      setProcessingId(null);
      setDeclineId(null);
    }, 500);
  };

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
              const url = row.callUrl;
              if (url) window.open(url, '_blank', 'noopener,noreferrer');
            }}
          >
            Join call
          </Button>
        </div>
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

      <DeclineModal
        isOpen={declineModalOpen}
        onConfirm={handleDeclineConfirm}
        onCancel={() => {
          setDeclineModalOpen(false);
          setDeclineId(null);
        }}
        isLoading={processingId === declineId}
      />
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
