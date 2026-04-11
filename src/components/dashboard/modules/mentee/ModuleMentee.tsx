'use client';
import { LoadingIcon, SearchIcon } from '@/assets/icons';
import Empty from '@/components/ui/NotFound/Empty';
import React, { useMemo } from 'react';

import {
  useModulesQuery,
  useGetTeenagerModulesProgressQuery,
} from '@/store/dashboard/dashboard.api';
import { Pagination } from '@/components/ui/Pagination/Pagination';
import { NoResult } from '@/components/ui/NotFound/NoResult';
import { useModuleList } from '@/hooks/useModuleList';
import ModuleList from '../ModuleList';
import Animated from '@/components/common/Animation';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { mergeModulesWithTeenagerProgress } from '@/utils/teenagerModuleProgress';

export default function ModuleMentee() {
  const moduleList = useModuleList({ defaultLimit: 10 });
  const pathname = usePathname();
  const user = useSelector((state: RootState) => state.profile.user);
  const teenId = user?.id != null ? String(user.id) : '';

  const { data, isError, isLoading: loadingModules } = useModulesQuery(
    moduleList.queryParams
  );
  const { data: progressRows = [], isLoading: loadingProgress } =
    useGetTeenagerModulesProgressQuery(teenId, {
      skip: !teenId || user?.role !== 'TEENAGER',
    });

  const modules = data?.data?.data ?? [];
  const total = data?.data?.total ?? 0;
  const totalPages = data?.data?.totalPages ?? 1;

  const mergedModules = useMemo(
    () => mergeModulesWithTeenagerProgress(modules, progressRows),
    [modules, progressRows]
  );

  const q = moduleList.search.trim().toLowerCase();

  const filteredModules = useMemo(() => {
    if (!q) return mergedModules;
    return mergedModules.filter((m) =>
      (m.title ?? '').toLowerCase().includes(q)
    );
  }, [mergedModules, q]);

  const hasModules = filteredModules.length > 0;
  const statsLoading = loadingModules || loadingProgress;

  if (statsLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoadingIcon
          width="40"
          height="40"
          className="animate-spin text-green-100"
        />
      </div>
    );
  }

  return (
    <Animated activeKey={pathname} className="mb-10 mt-5">
      <div className="border border-[#DCFFAD] rounded-lg px-2 md:px-6 py-5">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 text-green-200 text-2xl font-semibold">
            Modules
            <span className="bg-[#DCFFAD91] w-[59px] h-[24px] flex justify-center items-center rounded-full text-green-100 text-xs">
              {total} items
            </span>
          </div>
        </div>

        {isError ? (
          <Empty
            title="Couldn’t load modules."
            description="Please refresh the page or try again later."
            imageSrc="/image/emp.png"
            imageAlt="Empty state"
            imageWidth={320}
            imageHeight={320}
          />
        ) : (
          <div className="mt-2">
            <div className="w-full flex items-center justify-center mt-6">
              <div className="relative flex items-center py-3 rounded-lg gap-2 bg-[#DCFFAD91] px-2 md:max-w-[60%] w-full">
                <SearchIcon className="text-gray-400 pointer-events-none" />
                <input
                  type="search"
                  value={moduleList.search}
                  onChange={(e) => moduleList.setSearch(e.target.value)}
                  placeholder="Search by Module"
                  className="w-full text-sm h-full focus:outline-none bg-transparent"
                />
              </div>
            </div>
            {hasModules ? (
              <>
                <ModuleList modules={filteredModules} />
                <div className="flex items-center justify-between mt-4">
                  <Pagination
                    page={moduleList.page}
                    totalPages={Math.max(1, totalPages)}
                    onPageChange={moduleList.setPage}
                  />
                </div>
              </>
            ) : (
              <NoResult title="No modules found" />
            )}
          </div>
        )}
      </div>
    </Animated>
  );
}
