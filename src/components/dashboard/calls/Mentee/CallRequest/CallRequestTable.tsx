'use client';
import { MoreIcon, SearchIcon } from '@/assets/icons';
import Button from '@/components/ui/button/Button';
import { Pagination } from '@/components/ui/Pagination/Pagination';
import { Column, DataTable } from '@/components/ui/table';
import { useEffect, useMemo, useState } from 'react';
import useToastify from '@/hooks/useToastify';
import DeclineModal from '@/components/ui/modal/DeclineModal/DeclineModal';
import ActionModal from '@/components/ui/modal/ActionModal';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import {
  useAcceptCallRequestMutation,
  useMentorCallRequestsQuery,
  useRejectCallRequestMutation,
} from '@/store/dashboard/dashboard.api';

function pickArray(payload: any): any[] {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  if (Array.isArray(payload?.data?.data?.data)) return payload.data.data.data;
  return [];
}

function formatDateTime(dateLike: any) {
  const d = dateLike ? new Date(dateLike) : null;
  if (!d || Number.isNaN(d.getTime())) return { date: '', time: '' };
  return {
    date: d.toLocaleDateString(undefined, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }),
    time: d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }),
  };
}

type RequestCall = {
  id: string;
  name: string;
  date: string;
  time: string;
  topic: string;
  phone: string;
  status: 'Active' | 'Inactive' | 'Pending';
  image?: string;
};

export default function CallRequestTable({ onView }: any) {
  const { showToast } = useToastify();
  const user = useSelector((state: RootState) => state.profile.user);
  const isMentor = user?.role === 'MENTOR';
  const { data: apiData, isLoading, isError } = useMentorCallRequestsQuery(
    undefined,
    { skip: !isMentor }
  );
  const [acceptRequest, { isLoading: isAccepting }] =
    useAcceptCallRequestMutation();
  const [rejectRequest, { isLoading: isRejecting }] =
    useRejectCallRequestMutation();

  const data = useMemo<RequestCall[]>(() => {
    if (!isMentor) return [];
    const rows = pickArray(apiData);
    return rows.map((r: any) => {
      const { date, time } = formatDateTime(r?.scheduledAt ?? r?.startTime ?? r?.date);
      return {
        id: String(r?.id ?? r?._id ?? r?.requestId ?? ''),
        name:
          r?.teenager?.fullName ??
          r?.teenagerName ??
          r?.menteeName ??
          r?.name ??
          '—',
        date: date || String(r?.date ?? ''),
        time: time || String(r?.time ?? ''),
        topic: r?.topic ?? r?.sessionTopic ?? '—',
        phone: r?.teenager?.phoneNumber ?? r?.phoneNumber ?? r?.phone ?? '—',
        status: 'Pending',
        image: r?.teenager?.pictureUrl ?? r?.image,
      };
    });
  }, [apiData, isMentor]);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [statusFilter] = useState<'All' | RequestCall['status']>('All');
  const [rejectReason, setRejectReason] = useState('');
  const [rejectingId, setRejectingId] = useState<string | null>(null);

  const [perPage] = useState(5);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [declineModalOpen, setDeclineModalOpen] = useState(false);
  const [declineId, setDeclineId] = useState<string | null>(null);

  const handleUpdateStatus = async () => {
    if (!rejectingId) return;
    try {
      await rejectRequest({ id: rejectingId, reason: rejectReason }).unwrap();
      showToast('Request rejected', 'success');
      setOpenModal(false);
      setRejectReason('');
      setRejectingId(null);
    } catch (err: any) {
      showToast(err?.data?.message || 'Failed to reject request', 'error');
    }
  };

  const handleDeclineConfirm = async (reason: string) => {
    if (!declineId) return;

    setProcessingId(declineId);
    setDeclineModalOpen(false);
    showToast(`Declined: ${reason}`, 'success');
    setProcessingId(null);
    setDeclineId(null);
  };

  const columns: Column<RequestCall>[] = [
    {
      key: 'name',
      label: 'Mentors Name',
      render: (row) => {
        return (
          <div
            onClick={onView}
            className="flex cursor-pointer items-center gap-2 w-[100px]"
          >
            <p className="font-medium text-sm text-[#667085]">{row.name}</p>
          </div>
        );
      },
    },
    {
      key: 'date',
      label: 'Date',
      render: (row) => {
        return (
          <div className="flex items-center gap-2 w-[150px]">
            <p className="font-medium text-sm text-[#667085]">{row.date}</p>
          </div>
        );
      },
    },
    {
      key: 'time',
      label: 'Time',
      render: (row) => {
        return (
          <div className="flex items-center gap-2 w-[100px]">
            <p className="font-medium text-sm text-[#667085]">{row.time}</p>
          </div>
        );
      },
    },
    {
      key: 'topic',
      label: 'Topic',
      render: (row) => {
        return (
          <div className="flex items-center gap-2 w-[100px] ">
            <p className="font-medium text-sm text-[#667085]">{row.topic}</p>
          </div>
        );
      },
    },
    {
      key: 'status',
      label: '',
      render: (row) => {
        const isProcessing =
          processingId === row.id || isAccepting || isRejecting;
        return (
          <div className="flex items-center gap-2">
            <Button
              onClick={async () => {
                setProcessingId(row.id);
                try {
                  await acceptRequest(row.id).unwrap();
                  showToast('Request accepted', 'success');
                } catch (err: any) {
                  showToast(err?.data?.message || 'Failed to accept request', 'error');
                } finally {
                  setProcessingId(null);
                }
              }}
              disabled={isProcessing}
              className="bg-green-200 text-white px-8 py-2 rounded-xl"
            >
              Accept
            </Button>
            <Button
              onClick={() => {
                setRejectingId(row.id);
                setOpenModal(true);
              }}
              disabled={isProcessing}
              className="bg-red-100 text-white px-8 py-2 rounded-xl"
            >
              Reject
            </Button>
          </div>
        );
      },
    },
    {
      key: 'actions',
      label: 'Action',
      render: () => {
        return (
          <div className="flex items-center">
            <button
              onClick={onView}
              className="px-3 py-3 text-green-300  text-xs underline"
            >
              <MoreIcon />
            </button>
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
            Call Requests
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
        title="Reason for rejection"
        description="Give reason for rejection"
        confirmText="Continue"
        color="text-green-200"
        isLoading={isRejecting}
        onCancel={() => {
          if (isRejecting) return;
          setOpenModal(false);
          setRejectReason('');
          setRejectingId(null);
        }}
        onConfirm={handleUpdateStatus}
      >
        <div className="mt-10">
          <div>
            <input
              placeholder="Type your comment here."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
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
      {!isMentor && (
        <p className="mx-6 text-sm text-green-200/70">
          Call requests are only available for mentors.
        </p>
      )}
      {isMentor && isError && (
        <p className="mx-6 text-sm text-red-600">
          Failed to load call requests. Please try again.
        </p>
      )}
      {isMentor && isLoading ? (
        <p className="mx-6 text-sm text-green-200/70">Loading…</p>
      ) : (
        <DataTable columns={columns} data={paginated} />
      )}
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
