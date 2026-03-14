'use client';
import { SearchIcon } from '@/assets/icons';
import Button from '@/components/ui/button/Button';
import { Pagination } from '@/components/ui/Pagination/Pagination';
import { Column, DataTable } from '@/components/ui/table';
import { useEffect, useState } from 'react';
import useToastify from '@/hooks/useToastify';
import DeclineModal from '@/components/ui/modal/DeclineModal/DeclineModal';
import ActionModal from '@/components/ui/modal/ActionModal';

type PreviousCall = {
  id: string;
  name: string;
  date: string;
  time?: string;
  topic: string;
  phone: string;
  status: 'Active' | 'Inactive' | 'Pending';
  image?: string;
};

export default function PreviousCallTable({ onView }: any) {
  const { showToast } = useToastify();
  const [data, setData] = useState<PreviousCall[]>([
    {
      id: '1',
      name: 'John Doe',
      date: '12 Dec., 2025',
      time: '10:00 AM',
      topic: 'Hope',
      phone: '08012345678',
      status: 'Pending',
    },
    {
      id: '2',
      name: 'Mary Johnson',
      date: '12 Dec., 2025',
      time: '2:30 PM',
      topic: 'Hope',
      phone: '08087654321',
      status: 'Active',
    },
    {
      id: '3',
      name: 'David Smith',
      date: '12 Dec., 2025',
      time: '4:15 PM',
      topic: 'Hope',
      phone: '08123456789',
      status: 'Inactive',
    },
    {
      id: '4',
      name: 'Sarah Wilson',
      date: '12 Dec., 2025',
      time: '11:00 AM',
      topic: 'Hope',
      phone: '08099887766',
      status: 'Pending',
    },
    {
      id: '5',
      name: 'Daniel Adams',
      date: '12 Dec., 2025',
      time: '3:45 PM',
      topic: 'Hope',
      phone: '08111112222',
      status: 'Pending',
    },
  ]);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<PreviousCall | null>(null);
  const [statusFilter] = useState<'All' | PreviousCall['status']>('All');

  const [perPage] = useState(5);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [declineModalOpen, setDeclineModalOpen] = useState(false);
  const [declineId, setDeclineId] = useState<string | null>(null);

  const handleUpdateStatus = async () => {
    console.log('hellow world');
  };

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

  const columns: Column<PreviousCall>[] = [
    {
      key: 'name',
      label: 'Mentor Name',
      render: (row) => {
        return (
          <button
            type="button"
            onClick={onView}
            className="flex cursor-pointer items-center gap-2 w-[200px] text-left font-medium text-sm text-[#101828] underline underline-offset-2 hover:text-green-600"
          >
            {row.name}
          </button>
        );
      },
    },
    {
      key: 'date',
      label: 'Date & Time',
      render: (row) => {
        const dateTime = row.time ? `${row.date}, ${row.time}` : row.date;
        return (
          <div className="w-[200px]">
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
          <div className="flex items-center gap-2 w-[200px] ">
            <p className="font-medium text-sm text-[#101828]">{row.topic}</p>
          </div>
        );
      },
    },
    {
      key: 'status',
      label: '',
      render: (row) => {
        const isProcessing = processingId === row.id;
        return (
          <div className="flex items-center gap-2">
            <Button
              onClick={() => {
                setSelectedRow(row);
                setOpenModal(true);
              }}
              disabled={isProcessing}
              className="bg-green-200 text-white px-8 py-2 rounded-xl"
            >
              Give feedback
            </Button>
          </div>
        );
      },
    },
  ];

  const filtered = data.filter((row) => {
    const q = search.toLowerCase();
    if (statusFilter !== 'All' && row.status !== statusFilter) return false;
    if (!q) return true;
    return (
      row.name.toLowerCase().includes(q) ||
      row.date.toLowerCase().includes(q) ||
      (row.time?.toLowerCase().includes(q) ?? false) ||
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
            Call History
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

      <ActionModal
        isOpen={openModal}
        title="How was the call?"
        description={
          selectedRow
            ? `Share your feedback about ${selectedRow.name.split(' ')[0]}. What should the Osmosis team and their parents know?`
            : 'Share your feedback. What should the Osmosis team and their parents know?'
        }
        confirmText="Continue"
        color="text-green-200"
        onCancel={() => {
          setOpenModal(false);
          setSelectedRow(null);
        }}
        onConfirm={handleUpdateStatus}
      >
        <div className="mt-10">
          <div>
            <input
              placeholder="Type your comment here."
              className="rounded-lg border text-[#ACACAC] focus:outline-none h-[38px] px-2 border-green-200 w-full"
            />
          </div>
        </div>
      </ActionModal>

      <DeclineModal
        isOpen={declineModalOpen}
        onConfirm={handleDeclineConfirm}
        onCancel={() => {
          setDeclineModalOpen(false);
          setDeclineId(null);
        }}
        isLoading={processingId === declineId}
      />
      <DataTable columns={columns} data={paginated} compact />
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
