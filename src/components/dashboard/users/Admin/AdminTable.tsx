'use client';
import { AddsIcon, FilterIcon, MoreIcon, SearchIcon } from '@/assets/icons';
import Button from '@/components/ui/button/Button';
import { Pagination } from '@/components/ui/Pagination/Pagination';
import { Column, DataTable } from '@/components/ui/table';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { normalizeImageUrl } from '@/utils/helper';
import { NoResult } from '@/components/ui/NotFound/NoResult';
import { useRouter } from 'next/navigation';
import ActionModal from '@/components/ui/modal/ActionModal';
import useToastify from '@/hooks/useToastify';
import { useUpdateAdminStatusMutation } from '@/store/users/users.api';

type Admin = {
  id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
  status: string;
  image?: string;
  role?: string;
};
type StatusFilter = 'All' | 'Active' | 'Inactive';

type AdminListPageProps = {
  onAddAdmin: () => void;
  data: Admin[];
  totalPages: number;
  page: number;
  perPage: number;
  onPageChange: (page: number) => void;
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (value: StatusFilter) => void;
};
export default function AdminListPage({
  onAddAdmin,
  data,
  totalPages,
  page,
  perPage,
  onPageChange,
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: AdminListPageProps) {
  const router = useRouter();
  const [updateAdmin, { isLoading: isUpdating }] =
    useUpdateAdminStatusMutation();
  const { showToast } = useToastify();

  const [state, setState] = useState({
    selectedAdmin: null as Admin | null,
    openDropdownId: null as string | null,
    dropdownRect: null as DOMRect | null,
    pendingStatus: 'Active' as 'Active' | 'Inactive',
    open: false,
  });

  useEffect(() => {
    if (!state.openDropdownId) return;
    const close = () => setState((prev) => ({ ...prev, openDropdownId: null }));
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [state.openDropdownId]);

  const handleUpdateStatus = async () => {
    if (!state.selectedAdmin) return;
    try {
      const response = await updateAdmin({
        id: state.selectedAdmin.id,
        status: state.pendingStatus.toUpperCase() as 'ACTIVE' | 'INACTIVE',
      }).unwrap();
      showToast(response?.data?.message ?? 'Admin updated successfully', 'success');
      setState((prev) => ({
        ...prev,
        open: false,
        selectedAdmin: null,
      }));
    } catch (error) {
      console.error('Failed to update admin status', error);
    }
  };

  const openActivateModal = (row: Admin) => {
    setState((prev) => ({ ...prev, selectedAdmin: row, pendingStatus: 'Active', open: true }));
  };

  const openDeactivateModal = (row: Admin) => {
    setState((prev) => ({ ...prev, selectedAdmin: row, pendingStatus: 'Inactive', open: true }));
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
          onClick={(e) => {
            e.stopPropagation();
            const next = state.openDropdownId === row.id ? null : row.id;
            setState((prev) => ({
              ...prev,
              openDropdownId: next,
              dropdownRect: next ? (e.currentTarget as HTMLElement).getBoundingClientRect() : null,
            }));
          }}
          className="relative flex items-center space-x-2"
        >
          <div className="p-2 rounded-md hover:bg-[#F9FAFB] cursor-pointer">
            <MoreIcon />
          </div>
        </div>
      ),
    },
  ];

  const openRow = state.openDropdownId ? data.find((r) => r.id === state.openDropdownId) : null;
  const dropdownMenu =
    typeof document !== 'undefined' &&
    openRow &&
    state.dropdownRect
      ? createPortal(
          <div
            className="fixed z-[9999] flex flex-col gap-2 w-[180px] bg-white rounded-lg shadow-lg border border-gray-100 text-sm text-green-300 py-2"
            style={{
              top: state.dropdownRect.bottom + 4,
              left: Math.min(state.dropdownRect.right - 180, window.innerWidth - 196),
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="px-3 py-2 w-full text-left hover:bg-[#DCFFAD91] rounded-md"
              onClick={() => {
                router.push(`/dashboard/users/admin/${openRow.id}?role=admins`);
                setState((prev) => ({ ...prev, openDropdownId: null, dropdownRect: null }));
              }}
            >
              View
            </button>
            {openRow.status === 'Active' ? (
              <button
                type="button"
                className="px-3 py-2 w-full text-left hover:bg-[#DCFFAD91] rounded-md text-[#B42318]"
                onClick={() => {
                  openDeactivateModal(openRow);
                  setState((prev) => ({ ...prev, openDropdownId: null, dropdownRect: null }));
                }}
              >
                Deactivate
              </button>
            ) : (
              <button
                type="button"
                className="px-3 py-2 w-full text-left hover:bg-[#DCFFAD91] rounded-md"
                onClick={() => {
                  openActivateModal(openRow);
                  setState((prev) => ({ ...prev, openDropdownId: null, dropdownRect: null }));
                }}
              >
                Activate
              </button>
            )}
          </div>,
          document.body
        )
      : null;

  return (
    <div
      className="space-y-3 mt-2"
      onClick={() => setState((prev) => ({ ...prev, openDropdownId: null }))}
    >
      {dropdownMenu}
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
              <Button
                onClick={onAddAdmin}
                variant="primary"
                className="font-medium flex gap-1"
              >
                <AddsIcon />
                <h3 className="hidden md:flex">Invite Admin</h3>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <ActionModal
        isOpen={state.open}
        title={state.pendingStatus === 'Active' ? 'Activate user' : 'Deactivate user'}
        description={
          state.pendingStatus === 'Active'
            ? 'Are you sure you want to Activate this user?'
            : 'Are you sure you want to Deactivate this user?'
        }
        cancelText="Cancel"
        confirmText="Proceed"
        isLoading={isUpdating}
        onCancel={() => setState((prev) => ({ ...prev, open: false }))}
        onConfirm={handleUpdateStatus}
      />
      {data.length === 0 ? (
        <NoResult
          title="Data not found"
          description="Try adjusting your search or filter criteria."
        />
      ) : (
        <>
          <DataTable
            onRowClick={(row) => {
              router.push(`/dashboard/users/admin/${row.id}?role=admins`);
            }}
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
