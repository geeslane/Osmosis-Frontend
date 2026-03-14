'use client';
import { DownloadIcon, SearchIcon } from '@/assets/icons';
import Button from '@/components/ui/button/Button';
import { Pagination } from '@/components/ui/Pagination/Pagination';
import { Column, DataTable } from '@/components/ui/table';
import { useEffect, useState } from 'react';
import useToastify from '@/hooks/useToastify';
import { downloadCallReport } from '@/utils/downloadCallReport';
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
  const [statusFilter] = useState<'All' | PreviousCall['status']>('All');

  const [perPage] = useState(5);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [declineModalOpen, setDeclineModalOpen] = useState(false);
  const [declineId, setDeclineId] = useState<string | null>(null);

  const handleUpdateStatus = async () => {
    setOpenModal(false);
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
      label: 'Mentee Name',
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
              onClick={() => setOpenModal(true)}
              disabled={isProcessing}
              className="bg-green-200 text-white px-8 py-2 rounded-xl"
            >
              Give Feedback
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
    <div className="space-y-3 border-[#DCFFAD] border-1 mt-10 pb-10">
      <div className="flex flex-col mx-6 my-[18px] md:flex-row md:items-center md:justify-between gap-2">
        <div className="relative inline-flex items-center">
          <h3 className="font-semibold text-2xl text-green-200">
            Call History
          </h3>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex items-center h-[44px] gap-3 w-[363px] bg-[#DCFFAD91] px-2 rounded-lg">
            <SearchIcon className="text-gray-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by mentee name"
              className="w-full h-full text-sm bg-transparent focus:outline-none"
            />
          </div>
          <Button
              variant="primary"
              onClick={() => {
                const reportData = filtered.map((r) => ({
                  'Mentee Name': r.name,
                  'Date & Time': r.time ? `${r.date}, ${r.time}` : r.date,
                  Topic: r.topic,
                  Status: r.status,
                }));
                downloadCallReport(reportData, 'mentor-call-history.csv');
              }}
              leftIcon={<DownloadIcon width="18" height="18" className="text-white" />}
              className="shrink-0"
            >
              Download Report
            </Button>
          </div>
        </div>

      <ActionModal
        isOpen={openModal}
        title="How was the call"
        description="Give Feedback about the mentee, what Osmosis team &  parents might need to be aware of about them."
        confirmText="Continue"
        color="text-green-200"
        //isLoading={isUpdating}
        onCancel={() => setOpenModal(false)}
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
