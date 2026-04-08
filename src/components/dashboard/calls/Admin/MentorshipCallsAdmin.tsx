'use client';

import { DownloadIcon, LoadingIcon, SearchIcon, StarIcon } from '@/assets/icons';
import { Column, DataTable } from '@/components/ui/table';
import { Pagination } from '@/components/ui/Pagination/Pagination';
import Button from '@/components/ui/button/Button';
import { useEffect, useState } from 'react';
import { useGetCallsQuery } from '@/store/calls/calls.api';
import type { CallRecord } from '@/store/calls/calls.api';
import { useGetTeenagerByIdQuery } from '@/store/users/users.api';
import { downloadCallReport } from '@/utils/downloadCallReport';

// Fallback data when backend is not ready (menteeId used to fetch mentee details when name is clicked)
const fallbackData: CallRecord[] = [
  {
    id: '1',
    mentorName: 'Alex Johnson',
    menteeName: 'Olivia Rhye',
    menteeId: '1',
    date: '12 Dec, 2025',
    time: '10:00 AM',
    topic: 'Hope',
    callLength: '55m 34s',
    status: 'Completed',
    comment: 'Good',
    menteeComment: 'Very helpful session.',
    rating: 4,
  },
  {
    id: '2',
    mentorName: 'Sarah Williams',
    menteeName: 'Phoenix Baker',
    menteeId: '2',
    date: '12 Dec, 2025',
    time: '2:30 PM',
    topic: 'Joy in Chaos',
    callLength: '1h 23m',
    status: 'Rescheduled',
    comment: 'Rescheduled',
    menteeComment: undefined,
    rating: 3,
  },
  {
    id: '3',
    mentorName: 'Alex Johnson',
    menteeName: 'Lana Steiner',
    menteeId: '3',
    date: '11 Dec, 2025',
    time: '4:15 PM',
    topic: 'Shame',
    callLength: '45m',
    status: 'Completed',
    comment: 'Completed',
    rating: 5,
  },
  {
    id: '4',
    mentorName: 'Michael Brown',
    menteeName: 'Demi Wilkinson',
    menteeId: '4',
    date: '10 Dec, 2025',
    time: '11:00 AM',
    topic: 'Overcoming Fear',
    callLength: '1h 10m',
    status: 'Completed',
    comment: 'Good',
    rating: 4,
  },
];

export default function MentorshipCallsAdmin() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCall, setSelectedCall] = useState<CallRecord | null>(null);
  const [menteeModalId, setMenteeModalId] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isLoading } = useGetCallsQuery({
    page,
    limit: 10,
    search: debouncedSearch || undefined,
  });

  const { data: menteeResponse, isLoading: menteeLoading } = useGetTeenagerByIdQuery(
    menteeModalId ?? '',
    { skip: !menteeModalId }
  );
  const menteeDetails = menteeResponse?.data?.data;

  const callData = data?.data ?? fallbackData;
  const pagination = data?.pagination;
  const totalPages =
    pagination?.totalPages ?? Math.max(1, Math.ceil(callData.length / 10));

  const filtered = callData.filter((row) => {
    const q = debouncedSearch.toLowerCase();
    if (!q) return true;
    return (
      row.mentorName.toLowerCase().includes(q) ||
      row.menteeName.toLowerCase().includes(q) ||
      row.topic.toLowerCase().includes(q) ||
      row.date.toLowerCase().includes(q) ||
      (row.time?.toLowerCase().includes(q) ?? false)
    );
  });

  const paginated = pagination
    ? callData
    : filtered.slice((page - 1) * 10, page * 10);

  const handleDownloadReport = () => {
    const toExport = filtered.length ? filtered : callData;
    const reportData = toExport.map((r) => ({
      'Mentor Name': r.mentorName,
      'Mentee Name': r.menteeName,
      'Date & Time': r.time ? `${r.date}, ${r.time}` : r.date,
      Topic: r.topic,
      Status: r.status,
      Comment: r.comment,
      Rating: r.rating,
    }));
    const filename = debouncedSearch
      ? `call-history-${debouncedSearch.replace(/\s+/g, '-')}.csv`
      : 'mentorship-calls-report.csv';
    downloadCallReport(reportData, filename);
  };

  const columns: Column<CallRecord>[] = [
    {
      key: 'mentorName',
      label: 'Mentor',
      render: (row) => (
        <span className="font-medium text-sm text-[#101828]">
          {row.mentorName}
        </span>
      ),
    },
    {
      key: 'menteeName',
      label: 'Mentee',
      render: (row) =>
        row.menteeId ? (
          <div onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setMenteeModalId(row.menteeId!)}
              className="font-medium text-sm text-[#101828] hover:text-green-600 hover:underline text-left"
            >
              {row.menteeName}
            </button>
          </div>
        ) : (
          <span className="font-medium text-sm text-[#101828]">{row.menteeName}</span>
        ),
    },
    {
      key: 'date',
      label: 'Date & Time',
      render: (row) => {
        const dateTime = row.time ? `${row.date}, ${row.time}` : row.date;
        return (
          <span className="text-sm font-medium text-gray-600">{dateTime}</span>
        );
      },
    },
    {
      key: 'topic',
      label: 'Topic',
      render: (row) => (
        <span className="font-medium text-sm text-[#101828]">{row.topic}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            row.status === 'Completed'
              ? 'bg-green-50 text-green-600'
              : row.status === 'Rescheduled'
                ? 'bg-amber-50 text-amber-600'
                : 'bg-gray-100 text-gray-600'
          }`}
        >
          {row.status ?? '—'}
        </span>
      ),
    },
    {
      key: 'rating',
      label: 'Mentee Rating',
      render: (row) => (
        <span className="text-sm font-medium text-gray-600">
          {row.rating != null ? `${row.rating}/5` : '—'}
        </span>
      ),
    },
  ];

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [page, totalPages]);

  if (isLoading && !callData.length) {
    return (
      <div className="mt-10 flex items-center justify-center py-12">
        <LoadingIcon
          height="32"
          width="32"
          className="animate-spin text-green-100"
        />
      </div>
    );
  }

  return (
    <div className="mt-6 max-w-6xl">
      <div className="rounded-xl border border-[#DCFFAD] bg-white shadow-sm overflow-hidden">
        <div className="flex flex-col gap-4 p-6 border-b border-gray-100 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500">
            Click any row to view call details. Search by mentor or mentee name.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 rounded-lg border border-green-200/60 bg-gray-50/50 px-3 py-2 min-w-[200px] sm:min-w-[280px]">
              <SearchIcon className="text-gray-400 shrink-0" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search mentor or mentee name"
                className="w-full text-sm bg-transparent focus:outline-none text-green-200 placeholder:text-gray-400"
              />
            </div>
            <Button
              variant="primary"
              onClick={handleDownloadReport}
              leftIcon={
                <DownloadIcon width="18" height="18" className="text-white" />
              }
              className="shrink-0"
            >
              Download Report
            </Button>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={paginated}
          onRowClick={(row) => setSelectedCall(row)}
          compact
        />

        <div className="px-6 py-4 border-t border-gray-100">
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </div>

      {/* View Call Modal */}
      {selectedCall && (
        <div
          onClick={() => setSelectedCall(null)}
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/20 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="mx-4 w-full max-w-md rounded-xl border border-green-200/60 bg-white p-4 shadow-lg"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-bold text-green-200">
                Call Details
              </h3>
              <button
                type="button"
                onClick={() => setSelectedCall(null)}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Mentor</p>
                  <p className="text-sm font-semibold text-[#101828]">
                    {selectedCall.mentorName}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Mentee</p>
                  <p className="text-sm font-semibold text-[#101828]">
                    {selectedCall.menteeName}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Date & Time</p>
                  <p className="text-sm font-medium text-[#101828]">
                    {selectedCall.time
                      ? `${selectedCall.date}, ${selectedCall.time}`
                      : selectedCall.date}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Topic</p>
                  <p className="text-sm font-medium text-[#101828]">
                    {selectedCall.topic}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Status</p>
                  <p
                    className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                      selectedCall.status === 'Completed'
                        ? 'bg-green-50 text-green-600'
                        : selectedCall.status === 'Rescheduled'
                          ? 'bg-amber-50 text-amber-600'
                          : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {selectedCall.status ?? '—'}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-0.5">
                  Mentor&apos;s feedback
                </p>
                <p className="text-sm font-medium text-[#101828]">
                  {selectedCall.comment ?? 'No feedback given'}
                </p>
              </div>

              <div>
                <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-0.5">
                  Mentee&apos;s feedback
                </p>
                <p className="text-sm font-medium text-[#101828]">
                  {selectedCall.menteeComment ?? 'No feedback given'}
                </p>
              </div>

              <div>
                <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1">
                  Mentee rating
                </p>
                <div className="flex gap-0.5 items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon
                      key={i}
                      fill={
                        i < (selectedCall.rating ?? 0) ? '#F59E0B' : '#E5E7EB'
                      }
                    />
                  ))}
                  {selectedCall.rating != null && (
                    <span className="ml-1.5 text-xs text-gray-500">
                      {selectedCall.rating}/5
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mentee details modal – fetched by ID when mentee name is clicked */}
      {menteeModalId && (
        <div
          onClick={() => setMenteeModalId(null)}
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/20 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="mx-4 w-full max-w-lg rounded-xl border border-green-200/60 bg-white p-5 shadow-lg max-h-[90vh] overflow-y-auto"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-bold text-green-200">
                Mentee details
              </h3>
              <button
                type="button"
                onClick={() => setMenteeModalId(null)}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
            </div>

            {menteeLoading ? (
              <div className="flex items-center justify-center py-10">
                <LoadingIcon
                  height="32"
                  width="32"
                  className="animate-spin text-green-100"
                />
              </div>
            ) : menteeDetails ? (
              <div className="space-y-4">
                <div>
                  <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Name</p>
                  <p className="text-sm font-semibold text-[#101828]">
                    {menteeDetails.teenagerFullName ?? '—'}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Email</p>
                  <p className="text-sm text-[#101828]">{menteeDetails.teenagerEmail ?? '—'}</p>
                </div>
                <div>
                  <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Phone</p>
                  <p className="text-sm text-[#101828]">{menteeDetails.teenagerPhoneNumber ?? '—'}</p>
                </div>
                <div>
                  <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Parent / guardian</p>
                  <p className="text-sm text-[#101828]">{menteeDetails.parentFullName ?? '—'}</p>
                  {menteeDetails.parentEmail && (
                    <p className="text-xs text-gray-500 mt-0.5">{menteeDetails.parentEmail}</p>
                  )}
                  {menteeDetails.parentPhoneNumber && (
                    <p className="text-xs text-gray-500">{menteeDetails.parentPhoneNumber}</p>
                  )}
                </div>
                {menteeDetails.address && (
                  <div>
                    <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Address</p>
                    <p className="text-sm text-[#101828]">{menteeDetails.address}</p>
                  </div>
                )}
                {menteeDetails.class && (
                  <div>
                    <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Class</p>
                    <p className="text-sm text-[#101828]">{menteeDetails.class}</p>
                  </div>
                )}
                {menteeDetails.hobbies && (
                  <div>
                    <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Hobbies</p>
                    <p className="text-sm text-[#101828]">{menteeDetails.hobbies}</p>
                  </div>
                )}
                <div>
                  <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Status</p>
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                      menteeDetails.status === 'ACTIVE'
                        ? 'bg-green-50 text-green-600'
                        : menteeDetails.status === 'INACTIVE'
                          ? 'bg-red-50 text-red-600'
                          : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {menteeDetails.status ?? '—'}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500 py-4">Could not load mentee details.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
