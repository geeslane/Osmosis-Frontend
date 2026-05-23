'use client';
import { AddsIcon, GoBackIcon, LoadingIcon, SearchIcon } from '@/assets/icons';
import Button from '@/components/ui/button/Button';
import Empty from '@/components/ui/NotFound/Empty';
import React, { useState } from 'react';
import AddModule from './AddModule';
import ModuleList from './ModuleList';
import { useModulesQuery } from '@/store/dashboard/dashboard.api';
import { Pagination } from '@/components/ui/Pagination/Pagination';
import { NoResult } from '@/components/ui/NotFound/NoResult';
import { useModuleList } from '@/hooks/useModuleList';
import { MODULE_FORM_WIDTH } from './moduleLayout';

export default function Modules() {
  const moduleList = useModuleList({ defaultLimit: 10 });
  const [addLiveSession, setAddLiveSession] = useState(false);
  const { data, isError, isLoading } = useModulesQuery(moduleList.queryParams);
  const modules = data?.data?.data ?? [];
  const total = data?.data?.total ?? 0;
  const totalPages = data?.data?.totalPages ?? 1;
  const q = moduleList.search.trim().toLowerCase();
  const filteredModules = q
    ? modules.filter((m) => (m.title ?? '').toLowerCase().includes(q))
    : modules;
  const hasModules = filteredModules.length > 0;

  if (isLoading) {
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
    <div className="mb-10 mt-5">
      {addLiveSession ? (
        <div className="space-y-9">
          <div
            onClick={() => setAddLiveSession(false)}
            className="flex cursor-pointer items-center gap-1"
          >
            <GoBackIcon />
            <h3 className="text-sm text-green-200 font-medium">Back</h3>{' '}
          </div>
          <h3 className="text-green-200 text-2xl font-bold">Add Module</h3>

          <div className={`rounded-md ${MODULE_FORM_WIDTH} px-4 md:px-10 lg:px-12 border-2 border-[#6CBB0180] py-8`}>
            <AddModule />
          </div>
        </div>
      ) : (
        <div className=" border border-[#DCFFAD] rounded-lg px-2 md:px-6 py-5">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2 text-green-200 text-2xl font-semibold">
              Modules
              <span className="bg-[#DCFFAD91] w-[59px] h-[24px] flex justify-center items-center rounded-full text-green-100 text-xs">
                {total} items
              </span>
            </div>

            <Button
              variant="primary"
              className="font-medium flex gap-1"
              onClick={() => setAddLiveSession(true)}
            >
              <AddsIcon />
              <h3 className="hidden md:flex">Add Module</h3>
            </Button>
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
                <div className="relative flex items-center py-3  rounded-lg gap-2 bg-[#DCFFAD91] px-2  md:max-w-[60%] w-full">
                  <SearchIcon className=" left-3 top-2.5 text-gray-400 pointer-events-none" />
                  <input
                    type="search"
                    value={moduleList.search}
                    onChange={(e) => moduleList.setSearch(e.target.value)}
                    placeholder="Search by Module"
                    className="w-full text-sm h-full  focus:outline-none"
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
                <NoResult
                  title="Data not found"
                  description="Try adjusting your search or filter criteria."
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
