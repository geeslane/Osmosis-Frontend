import { useMemo, useState } from 'react';

export interface UseModuleListOptions {
  defaultLimit?: number;
}

export interface UseModuleListReturn {
  page: number;
  limit: number;
  search: string;
  setPage: (page: number) => void;
  setSearch: (value: string) => void;
  queryParams: {
    page: number;
    limit: number;
    title?: string;
  };
  resetPage: () => void;
}

export function useModuleList(
  options: UseModuleListOptions = {}
): UseModuleListReturn {
  const { defaultLimit = 10 } = options;
  const [page, setPage] = useState(1);
  const [limit] = useState(defaultLimit);
  const [search, setSearch] = useState('');

  const queryParams = useMemo(() => {
    const params: { page: number; limit: number; title?: string } = {
      page,
      limit,
    };
    if (search.trim().length >= 2) {
      params.title = search.trim();
    }
    return params;
  }, [page, limit, search]);

  const resetPage = () => setPage(1);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return {
    page,
    limit,
    search,
    setPage,
    setSearch: handleSearchChange,
    queryParams,
    resetPage,
  };
}

