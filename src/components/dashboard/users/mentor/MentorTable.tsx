'use client';
import { FilterIcon, MoreIcon, SearchIcon } from '@/assets/icons';
import { Pagination } from '@/components/ui/Pagination/Pagination';
import { Column, DataTable } from '@/components/ui/table';
import Image from 'next/image';
import { useState } from 'react';
import { normalizeImageUrl } from '@/utils/helper';
import { useUpdateMentorStatusMutation } from '@/store/users/users.api';
import ActionModal from '@/components/ui/modal/ActionModal';
import { NoResult } from '@/components/ui/NotFound/NoResult';
import { StatusFilter } from '@/hooks/useUserList';

type Admin = {
  id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
  status: string;
  image?: string;
};

type MentorTableProps = {
  data: Admin[];
  totalPages: number;
  page: number;
  perPage: number;
  onPageChange: (page: number) => void;
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (value: StatusFilter) => void;
  onViewMentor: (admin: Admin) => void;
};

export default function MentorTable({
  data,
  totalPages,
  page,
  perPage,
  onPageChange,
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onViewMentor,
}: MentorTableProps) {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [newStatus, setNewStatus] = useState<Admin['status']>('Active');
  const [openStatusModal, setOpenStatusModal] = useState(false);

  const [updateMentorStatus, { isLoading: isUpdating }] =
    useUpdateMentorStatusMutation();

  const handleUpdateStatus = async () => {
    if (!selectedAdmin) return;

    try {
      await updateMentorStatus({
        id: selectedAdmin.id,
        status: newStatus.toUpperCase() as 'ACTIVE' | 'INACTIVE',
      }).unwrap();

      setOpenStatusModal(false);
      setSelectedAdmin(null);
      setNewStatus('Active');
    } catch (error) {
      console.error('Failed to update mentor status', error);
    }
  };

  const statusStyles: Record<Admin['status'], string> = {
    Active: 'bg-green-50 text-green-600',
    Inactive: 'bg-[#FEF3F2] text-[#B42318]',
    Pending: 'bg-[#F2F4F7] text-[#282F2E]',
  };

  const columns: Column<Admin>[] = [
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
        const hasValidImage =
          normalizedImage && typeof normalizedImage === 'string';
        const initials = (row.name || row.email || 'U')
          .split(' ')
          .map((word) => word[0])
          .join('')
          .toUpperCase()
          .slice(0, 2);

        return (
          <div className="flex relative items-center gap-2">
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
      key: 'address',
      label: 'Address',
      render: (row) => (
        <span className="text-sm text-[#667085]">{row.address}</span>
      ),
    },
    {
      key: 'phone',
      label: 'Phone No.',
      render: (row) => (
        <span className="text-sm text-[#667085]">{row.phone}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            statusStyles[row.status]
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Action',
      render: (row) => (
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex relative items-center space-x-2"
        >
          <div className="">
            <div
              onClick={() =>
                setOpenDropdownId((prev) => (prev === row.id ? null : row.id))
              }
              className="p-2 rounded-md hover:bg-[#F9FAFB] cursor-pointer"
            >
              <MoreIcon />
            </div>

            {openDropdownId === row.id && (
              <div className="absolute  top-8 right-0 z-50 flex flex-col gap-2 w-[180px] bg-white rounded-lg shadow-lg text-sm text-green-300 py-2 pointer-events-auto">
                <button
                  type="button"
                  className="px-3 py-2 w-full text-left hover:bg-[#DCFFAD91] rounded-md"
                  onClick={() => {
                    onViewMentor(row);
                    setOpenDropdownId(null);
                  }}
                >
                  View
                </button>

                <button
                  type="button"
                  className="px-3 py-2 w-full text-left hover:bg-[#DCFFAD91] rounded-md"
                  onClick={() => {
                    setSelectedAdmin(row);
                    setNewStatus(row.status);
                    setOpenStatusModal(true);
                    setOpenDropdownId(null);
                  }}
                >
                  Update Status
                </button>
              </div>
            )}
          </div>
        </div>
      ),
    },
  ];
  return (
    <div
      className="space-y-3 mt-2"
      onClick={() => setOpenDropdownId(null)}
    >
      <div className="flex flex-col mx-4 md:flex-row md:items-center md:justify-between gap-2">
        <div className="flex items-center gap-2 w-full">
          <div className=" w-full flex flex-col md:flex-row gap-2 justify-between md:items-center ">
            <div className="relative inline-flex items-center">
              <FilterIcon className="absolute left-2 text-gray-400 pointer-events-none" />

              <select
                value={statusFilter}
                onChange={(e) =>
                  onStatusFilterChange(e.target.value as StatusFilter)
                }
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
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search by name (min 2 characters)"
                  className="w-full text-sm h-full  focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <ActionModal
        isOpen={openStatusModal}
        title="Update Status"
        description="Change the user's status and provide a reason for this action."
        confirmText="Update"
        isLoading={isUpdating}
        onCancel={() => setOpenStatusModal(false)}
        onConfirm={handleUpdateStatus}
      >
        <div className="space-y-4">
          <div>
            <label
              htmlFor="mentor-status"
              className="block text-sm font-medium text-green-200 mb-1"
            >
              Status
            </label>
            <select
              id="mentor-status"
              value={newStatus}
              onChange={(e) =>
                setNewStatus(e.target.value as 'Active' | 'Inactive')
              }
              className="w-full rounded-md border border-[#D0D5DD] px-3 py-2 text-sm"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </ActionModal>
      {data.length === 0 ? (
        <NoResult
          title="Data not found"
          description="Try adjusting your search or filter criteria."
        />
      ) : (
        <>
          <DataTable
            onRowClick={(row) => onViewMentor(row)}
            columns={columns}
            data={data}
          />
          <div className="flex items-center justify-between">
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </div>
        </>
      )}
    </div>
  );
}
