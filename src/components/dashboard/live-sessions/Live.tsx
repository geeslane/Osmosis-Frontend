'use client';

import { AddsIcon, GoBackIcon, LoadingIcon, SearchIcon } from '@/assets/icons';
import Button from '@/components/ui/button/Button';
import Empty from '@/components/ui/NotFound/Empty';
import { apiSessionToRecord, type LiveSessionRecord } from '@/lib/liveSessions';
import { liveSessionsApi } from '@/lib/liveSessionsApi';
import useToastify from '@/hooks/useToastify';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import AddLive from './AddLive';
import LiveTable from './LiveTable';

const PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 400;

export type DateSortDirection = 'asc' | 'desc' | null;

export default function Live() {
  const { showToast } = useToastify();
  const user = useSelector((state: RootState) => state.profile.user);
  const canManageSessions = user?.role !== 'TEENAGER'; // Mentees can only view
  const [addLiveSession, setAddLiveSession] = useState(false);
  const [search, setSearch] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [data, setData] = useState<LiveSessionRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [dateSort, setDateSort] = useState<DateSortDirection>(null);
  const [loading, setLoading] = useState(true);

  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const q = searchQuery.trim();
      const res = await liveSessionsApi.list({
        search: q || undefined,
        page,
        limit: PAGE_SIZE,
        ...(dateSort != null && { orderBy: dateSort }),
      });
      const list = Array.isArray(res.data) ? res.data : [];
      setData(list.map(apiSessionToRecord));
      setTotal(typeof res.total === 'number' ? res.total : 0);
      setTotalPages(Math.max(1, typeof res.totalPages === 'number' ? res.totalPages : 1));
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data
              ?.message
          : 'Failed to load live sessions';
      showToast(message ?? 'Failed to load live sessions', 'error');
      setData([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, page, dateSort, showToast]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  useEffect(() => {
    const t = setTimeout(() => {
      setSearchQuery(search);
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [search]);

  const handleSortChange = useCallback((direction: DateSortDirection) => {
    setDateSort(direction);
    setPage(1);
  }, []);

  const itemLabel = total === 1 ? '1 item' : `${total} items`;

  return (
    <div className="mb-10 mt-5">
      {addLiveSession && canManageSessions ? (
        <div className="space-y-6">
          <div
            onClick={() => setAddLiveSession(false)}
            className="flex cursor-pointer items-center gap-1 text-green-200 hover:text-green-300 transition-colors w-fit"
          >
            <GoBackIcon />
            <span className="text-sm font-medium">Back</span>
          </div>
          <h3 className="text-green-200 text-2xl font-bold">
            Add Live Session
          </h3>

          <div className="max-w-[747px] w-full rounded-xl border border-green-400 bg-white px-6 md:px-10 py-8 shadow-sm">
            <AddLive onSuccess={() => { setAddLiveSession(false); fetchList(); }} />
          </div>
        </div>
      ) : (
        <div className="space-y-3 border-[#DCFFAD] border-1 mt-10 pb-10 bg-white px-4 md:px-6 py-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-green-200 text-2xl font-semibold">
                Live Sessions
              </h2>
              <span className="inline-flex items-center rounded-full bg-[#DCFFAD] px-3 py-1 text-xs font-medium text-green-700">
                {itemLabel}
              </span>
            </div>

            {canManageSessions && (
              <Button
                variant="primary"
                className="font-medium flex gap-1 shrink-0"
                onClick={() => setAddLiveSession(true)}
              >
                <AddsIcon />
                <span className="hidden md:inline">Add Live Session</span>
              </Button>
            )}
          </div>

          <div className="mt-6 flex w-full justify-center">
            <div className="relative flex w-full max-w-[60%] items-center gap-2 rounded-lg bg-[#DCFFAD91] px-3 py-3">
              <SearchIcon className="absolute left-3 text-gray-400 pointer-events-none shrink-0" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by topic or speaker"
                className="w-full bg-transparent pl-8 text-sm focus:outline-none"
              />
            </div>
          </div>

          {loading ? (
            <div className="mt-6 py-12 flex flex-col items-center justify-center gap-4 text-gray-600">
              <LoadingIcon width="40" height="40" className="animate-spin text-green-200" />
              <p className="text-sm font-medium">Loading sessions</p>
            </div>
          ) : total === 0 ? (
            <div className="mt-6 flex justify-center py-8">
              <Empty
                title="No Live Session for now."
                description="Click Add Live Session to have a list."
                imageSrc="/image/emp.png"
                imageAlt="Empty chat"
                imageWidth={320}
                imageHeight={320}
              />
            </div>
          ) : (
            <div className="mt-6">
              <LiveTable
                data={data}
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
                onCancelSuccess={fetchList}
                dateSort={dateSort}
                onDateSortChange={handleSortChange}
                canManage={canManageSessions}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
