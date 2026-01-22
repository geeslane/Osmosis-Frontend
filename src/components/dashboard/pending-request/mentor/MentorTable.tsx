'use client';
import { FilterIcon, SearchIcon } from '@/assets/icons';
import Button from '@/components/ui/button/Button';
import { Pagination } from '@/components/ui/Pagination/Pagination';
import { Column, DataTable } from '@/components/ui/table';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useUpdateMentorRequestStatusMutation } from '@/store/users/users.api';
import useToastify from '@/hooks/useToastify';
import { normalizeImageUrl } from '@/utils/helper';
import DeclineModal from '@/components/ui/modal/DeclineModal/DeclineModal';

type MwntorPending = {
  id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
  status: string;
  image?: string;
};
type AdminListPageProps = {
  onAddAdmin: () => void;
  data: MwntorPending[];
  onViewAdmin: (admin: MwntorPending) => void;
  onRefetch?: () => void;
};
export default function MentorTable({ data, onViewAdmin, onRefetch }: AdminListPageProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'All' | MwntorPending['status']
  >('All');
  const [perPage] = useState(5);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [declineModalOpen, setDeclineModalOpen] = useState(false);
  const [declineId, setDeclineId] = useState<string | null>(null);
  const { showToast } = useToastify();
  const [updateRequestStatus, { isLoading: isUpdating }] = useUpdateMentorRequestStatusMutation();

  const handleAccept = async (id: string) => {
    setProcessingId(id);
    try {
      await updateRequestStatus({
        id,
        data: { status: 'APPROVED' },
      }).unwrap();
      showToast('Mentor request approved. They have been added to Osmosis and can be found in the Users section.', 'success');
      onRefetch?.();
    } catch (error: any) {
      const message = error?.data?.message || 'Failed to approve request';
      showToast(message, 'error');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeclineClick = (id: string) => {
    setDeclineId(id);
    setDeclineModalOpen(true);
  };

  const handleDeclineConfirm = async (reason: string) => {
    if (!declineId) return;
    setProcessingId(declineId);
    setDeclineModalOpen(false);
    try {
      await updateRequestStatus({
        id: declineId,
        data: { status: 'REJECTED', reasonForRejection: reason },
      }).unwrap();
      showToast('Mentor request declined successfully', 'success');
      onRefetch?.();
    } catch (error: any) {
      const message = error?.data?.message || 'Failed to decline request';
      showToast(message, 'error');
    } finally {
      setProcessingId(null);
      setDeclineId(null);
    }
  };

  const columns: Column<MwntorPending>[] = [
    {
      key: 'id',
      label: 'S/N',
      render: (row, index) => (
        <div>
          <p className="font-medium text-sm text-[#101828]">
            {(page - 1) * perPage + (index ?? 0) + 1}
          </p>
        </div>
      ),
    },
    {
      key: 'name',
      label: 'Name',
      render: (row) => {
        const normalizedImage = row.image ? normalizeImageUrl(row.image) : null;
        const hasValidImage = normalizedImage && typeof normalizedImage === 'string';
        const initials = (row.name || row.email || 'U')
          .split(' ')
          .map((word) => word[0])
          .join('')
          .toUpperCase()
          .slice(0, 2);

        return (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex-shrink-0">
              {hasValidImage ? (
                <Image
                  src={normalizedImage}
                  alt={row.name}
                  width={32}
                  height={32}
                  className="rounded-full w-full h-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">
                    {initials}
                  </span>
                </div>
              )}
            </div>
            <div>
              <p className="font-medium text-sm text-[#101828]">{row.name}</p>
              <p className="text-sm text-[#667085]">{row.email}</p>
            </div>
          </div>
        );
      },
    },

    {
      key: 'actions',
      label: 'Action',
      render: (row) => {
        const isProcessing = processingId === row.id;
        return (
          <div className="relative flex items-center space-x-1.5">
            <Button
              onClick={() => handleAccept(row.id)}
              disabled={isProcessing || isUpdating}
              className="bg-green-200 text-white font-semibold text-xs px-4 py-1.5 flex items-center gap-1 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Accept
            </Button>
            <Button
              onClick={() => handleDeclineClick(row.id)}
              disabled={isProcessing || isUpdating}
              className="bg-red-100 text-white font-semibold text-xs px-4 py-1.5 flex items-center gap-1 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Decline
            </Button>
            <button
              type="button"
              className="px-2 py-1 text-xs underline"
              onClick={() => {
                onViewAdmin(row);
              }}
            >
              View
            </button>
          </div>
        );
      },
    },
  ];
  const filtered = data.filter((row) => {
    const q = search.trim().toLowerCase();
    if (statusFilter !== 'All' && row.status !== statusFilter) return false;
    if (!q) return true;
    return (
      row.name.toLowerCase().includes(q) ||
      row.email.toLowerCase().includes(q) ||
      row.address.toLowerCase().includes(q) ||
      row.phone.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [page, totalPages]);

  const paginated = filtered.slice(
    (page - 1) * perPage,
    page * perPage
  ) as MwntorPending[];

  return (
    <div className="space-y-3 mt-2">
      <div className="flex flex-col mx-4 md:flex-row md:items-center md:justify-between gap-2">
        <div className="flex items-center gap-2 w-full">
          <div className=" w-full flex flex-col md:flex-row gap-2 justify-between md:items-center ">
            <div className="relative inline-flex items-center">
              <FilterIcon className="absolute left-2 text-gray-400 pointer-events-none" />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                aria-label="Filter by status"
                className="
                  pl-8 pr-6 py-1.5
                  rounded-md border border-[#D0D5DD]
                  bg-white text-sm font-medium text-gray-700
                  hover:bg-gray-50
                  focus:outline-none
                  appearance-none cursor-pointer
                "
              >
                <option value="All">All statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="w-full flex gap-2 items-center justify-end">
              <div className="relative flex items-center py-2 rounded-lg gap-2 bg-[#DCFFAD91] px-2 max-w-[369px] w-full">
                <SearchIcon className=" left-2 top-2 text-gray-400 pointer-events-none" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name"
                  className="w-full text-sm h-full  focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <DeclineModal
        isOpen={declineModalOpen}
        onConfirm={handleDeclineConfirm}
        onCancel={() => {
          setDeclineModalOpen(false);
          setDeclineId(null);
        }}
        isLoading={isUpdating && processingId === declineId}
      />
      <DataTable columns={columns} data={paginated} />
      <div className="flex items-center justify-between">
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
