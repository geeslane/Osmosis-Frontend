'use client';
import { FilterIcon, SearchIcon } from '@/assets/icons';
import Button from '@/components/ui/button/Button';
import DeleteModal from '@/components/ui/modal/DeleteModal/DeleteModal';
import { Pagination } from '@/components/ui/Pagination/Pagination';
import { Column, DataTable } from '@/components/ui/table';
import Image from 'next/image';
import { useEffect, useState } from 'react';

type MenteePending = {
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
  data: MenteePending[];
  onViewAdmin: (admin: MenteePending) => void;
};
export default function MenteeTable({ data, onViewAdmin }: AdminListPageProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'All' | MenteePending['status']
  >('All');
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

  const columns: Column<MenteePending>[] = [
    {
      key: 'id',
      label: 'S/N',
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
      key: 'actions',
      label: 'Action',
      render: (row) => (
        <div className="relative flex items-center space-x-2">
          <Button className="bg-green-200 text-white font-semibold  px-8 py-2 flex items-center gap-1 rounded-xl">
            Accept
          </Button>
          <Button className="bg-red-100 text-white font-semibold  px-8 py-2 flex items-center gap-1 rounded-xl">
            Decline
          </Button>
          <button
            type="button"
            className="px-3 py-2 w-full underline"
            onClick={() => {
              onViewAdmin(row);
            }}
          >
            View
          </button>
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
  ) as MenteePending[];

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
            </div>
          </div>
        </div>
      </div>
      <DeleteModal
        isOpen={open}
        onCancel={() => setOpen(false)}
        onConfirm={handleDelete}
        //isLoading={loading}
        title="Delete MenteePending"
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
