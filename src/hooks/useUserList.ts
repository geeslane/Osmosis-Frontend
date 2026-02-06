import { useMemo, useState } from 'react';

export type StatusFilter = 'All' | 'Active' | 'Inactive';

export interface UseUserListOptions {
  defaultLimit?: number;
}

export interface UseUserListReturn {
  page: number;
  limit: number;
  search: string;
  statusFilter: StatusFilter;
  setPage: (page: number) => void;
  setSearch: (value: string) => void;
  setStatusFilter: (value: StatusFilter) => void;
  queryParams: {
    page: number;
    limit: number;
    status?: 'ACTIVE' | 'INACTIVE';
    name?: string;
  };
  resetPage: () => void;
}

export function useUserList(options: UseUserListOptions = {}): UseUserListReturn {
  const { defaultLimit = 10 } = options;
  const [page, setPage] = useState(1);
  const [limit] = useState(defaultLimit);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');

  const queryParams = useMemo(() => {
    const params: {
      page: number;
      limit: number;
      status?: 'ACTIVE' | 'INACTIVE';
      name?: string;
    } = {
      page,
      limit,
    };
    if (statusFilter !== 'All') {
      params.status = statusFilter === 'Active' ? 'ACTIVE' : 'INACTIVE';
    }
    if (search.trim().length >= 2) {
      params.name = search.trim();
    }
    return params;
  }, [page, limit, statusFilter, search]);

  const resetPage = () => setPage(1);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusFilterChange = (value: StatusFilter) => {
    setStatusFilter(value);
    setPage(1);
  };

  return {
    page,
    limit,
    search,
    statusFilter,
    setPage,
    setSearch: handleSearchChange,
    setStatusFilter: handleStatusFilterChange,
    queryParams,
    resetPage,
  };
}
