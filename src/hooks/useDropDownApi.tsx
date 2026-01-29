import { DropdownItem } from '@/components/types';
import { useGetDropdownByTypeQuery } from '@/store/auth/auth.api';

type DropdownMap = Record<string, DropdownItem[]>;

export const useDropdowns = (types: string[]) => {
  const results: DropdownMap = {};
  let loading = false;

  types.forEach((type) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { data, isLoading } = useGetDropdownByTypeQuery({ type });
    results[type] = data?.data || [];
    if (isLoading) loading = true;
  });

  return { dropdowns: results, isLoading: loading };
};
