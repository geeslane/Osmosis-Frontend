'use client';
import { FilterIcon, MoreIcon, SearchIcon } from '@/assets/icons';
import DeleteModal from '@/components/ui/modal/DeleteModal/DeleteModal';
import { Pagination } from '@/components/ui/Pagination/Pagination';
import { Column, DataTable } from '@/components/ui/table';
import Image from 'next/image';
import { useEffect, useState } from 'react';

type Admin = {
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
  data: Admin[];
  onViewAdmin: (admin: Admin) => void;
};
export default function MentorTable({
  data,
  onViewAdmin,
}: AdminListPageProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | Admin['status']>(
    'All'
  );
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [perPage] = useState(5);
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    // setLoading(true);
    try {
      // await deleteApiCall()
    } finally {
      //setLoading(false);
      //setOpen(false);
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
      label: 'ID',
      render: (row) => (
        <div>
          <p className="font-medium text-sm text-[#101828]">#{row.id}</p>
        </div>
      ),
    },
    {
      key: 'name',
      label: 'Name',
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full">
            <Image
              src={row.image ?? '/image/Avatar.png'}
              alt={row.name}
              width={40}
              height={40}
              className="rounded-full w-full h-full object-cover mr-3"
            />
          </div>
          <div>
            <p className="font-medium text-sm text-[#101828]">{row.name}</p>
            <p className="text-sm text-[#667085]">{row.email}</p>
          </div>
        </div>
      ),
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
        <div className="relative flex items-center space-x-2">
          <div
            onClick={() =>
              setOpenDropdownId((prev) => (prev === row.id ? null : row.id))
            }
            className="p-2 rounded-md hover:bg-[#F9FAFB] cursor-pointer"
          >
            <MoreIcon />
          </div>

          {openDropdownId === row.id && (
            <div className="absolute top-8 right-0 z-50 flex flex-col gap-2 w-[180px] bg-white rounded-lg shadow-lg text-sm text-green-300 py-2">
              <button
                type="button"
                className="px-3 py-2 w-full text-left hover:bg-[#DCFFAD91] rounded-md"
                onClick={() => {
                  onViewAdmin(row);
                  setOpenDropdownId(null);
                }}
              >
                View
              </button>

              <button
                type="button"
                className="px-3 py-2 w-full text-left hover:bg-[#DCFFAD91] rounded-md"
                onClick={() => {
                  setOpen(true);
                  setOpenDropdownId(null);
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
  ) as Admin[];

  return (
    <div className="space-y-4 mt-4">
      <div className="flex flex-col mx-6 md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-3 w-full">
          <div className=" w-full flex flex-col md:flex-row gap-3 justify-between md:items-center ">
            <div className="relative inline-flex items-center">
              <FilterIcon className="absolute left-3 text-gray-400 pointer-events-none" />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                aria-label="Filter by status"
                className="
                  pl-9 pr-8 py-2
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
                <option value="Pending">Pending</option>
              </select>
            </div>
            <div className="w-full flex gap-3 items-center justify-end">
              <div className="relative flex items-center py-3 rounded-lg gap-2 bg-[#DCFFAD91] px-2 max-w-[369px] w-full">
                <SearchIcon className=" left-3 top-2.5 text-gray-400 pointer-events-none" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name"
                  className="w-full text-sm h-full  focus:outline-none"
                />
              </div>
              {/*   <Button
                onClick={onAddAdmin}
                variant="primary"
                className="font-medium flex gap-1"
              >
                <AddsIcon />
                <h3 className="hidden md:flex">Add Mentor</h3>
              </Button> */}
            </div>
          </div>
        </div>
      </div>
      <DeleteModal
        isOpen={open}
        onCancel={() => setOpen(false)}
        onConfirm={handleDelete}
        //isLoading={loading}
        title="Delete Admin"
        description="Deleting this admin will permanently remove access."
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
