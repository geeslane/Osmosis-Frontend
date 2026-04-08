'use client';
import { DownloadIcon, SearchIcon } from '@/assets/icons';
import Button from '@/components/ui/button/Button';
import { Pagination } from '@/components/ui/Pagination/Pagination';
import { Column, DataTable } from '@/components/ui/table';
import { useGetMentorPreviousCallsQuery } from '@/store/calls/calls.api';
import { useMentorCallFeedbackMutation } from '@/store/dashboard/dashboard.api';
import { callRecordToPreviousRow, type PreviousCallRow } from '@/utils/mapCallApi';
import { useEffect, useMemo, useState } from 'react';
import useToastify from '@/hooks/useToastify';
import { downloadCallReport } from '@/utils/downloadCallReport';
import ActionModal from '@/components/ui/modal/ActionModal';

type PreviousCall = PreviousCallRow;

export default function PreviousCallTable({ onView }: { onView?: () => void }) {
  const { showToast } = useToastify();
  const { data, isLoading, isError } = useGetMentorPreviousCallsQuery();
  const [submitFeedback, { isLoading: isSubmitting }] = useMentorCallFeedbackMutation();

  const rows = useMemo(
    () => (data?.data ?? []).map((c) => callRecordToPreviousRow(c, 'mentor')),
    [data?.data]
  );

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<PreviousCall | null>(null);
  const [statusFilter] = useState<'All' | PreviousCall['status']>('All');
  const [feedbackNotes, setFeedbackNotes] = useState('');

  const [perPage] = useState(5);

  const openFeedbackModal = (row: PreviousCall, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedRow(row);
    setFeedbackNotes(row.mentorNotes ?? '');
    setOpenModal(true);
  };

  const handleSaveFeedback = async () => {
    if (!selectedRow) return;
    const notes = feedbackNotes.trim();
    if (notes.length < 2) {
      showToast('Please add a short note (at least 2 characters).', 'error');
      return;
    }
    try {
      await submitFeedback({
        callId: selectedRow.id,
        notes,
      }).unwrap();
      showToast('Feedback saved.', 'success');
      setOpenModal(false);
      setSelectedRow(null);
      setFeedbackNotes('');
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'data' in err
          ? String((err as { data?: { message?: string } }).data?.message ?? '')
          : '';
      showToast(msg || 'Could not save feedback', 'error');
    }
  };

  const columns: Column<PreviousCall>[] = [
    {
      key: 'name',
      label: 'Mentee Name',
      render: (row) => {
        return (
          <button
            type="button"
            onClick={onView}
            className="flex cursor-pointer items-center gap-2 w-[200px] text-left font-medium text-sm text-[#101828] hover:text-green-600"
          >
            {row.name}
          </button>
        );
      },
    },
    {
      key: 'date',
      label: 'Date & Time',
      render: (row) => {
        const dateTime = row.time ? `${row.date}, ${row.time}` : row.date;
        return (
          <div className="w-[200px]">
            <p className="font-medium text-sm text-[#101828]">{dateTime}</p>
          </div>
        );
      },
    },
    {
      key: 'topic',
      label: 'Topic',
      render: (row) => {
        return (
          <div className="flex items-center gap-2 w-[200px] ">
            <p className="font-medium text-sm text-[#101828]">{row.topic}</p>
          </div>
        );
      },
    },
    {
      key: 'status',
      label: '',
      render: (row) => {
        const isProcessing = isSubmitting && selectedRow?.id === row.id;
        const hasFeedback = !!(row.mentorNotes != null && String(row.mentorNotes).trim() !== '');
        return (
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <Button
              onClick={(e) => openFeedbackModal(row, e)}
              disabled={isProcessing || hasFeedback}
              className="bg-green-200 text-white px-8 py-2 rounded-xl"
            >
              {hasFeedback ? 'Feedback saved' : 'Add feedback'}
            </Button>
          </div>
        );
      },
    },
  ];

  const filtered = rows.filter((row) => {
    const q = search.toLowerCase();
    if (statusFilter !== 'All' && row.status !== statusFilter) return false;
    if (!q) return true;
    return (
      row.name.toLowerCase().includes(q) ||
      row.date.toLowerCase().includes(q) ||
      (row.time?.toLowerCase().includes(q) ?? false) ||
      row.topic.toLowerCase().includes(q) ||
      row.phone.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [page, totalPages]);

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="space-y-3 border-[#DCFFAD] border-1 mt-10 pb-10">
      <div className="flex flex-col mx-6 my-[18px] md:flex-row md:items-center md:justify-between gap-2">
        <div className="relative inline-flex items-center">
          <h3 className="font-semibold text-2xl text-green-200">
            Call History
          </h3>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex items-center h-[44px] gap-3 w-[363px] bg-[#DCFFAD91] px-2 rounded-lg">
            <SearchIcon className="text-gray-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by mentee name"
              className="w-full h-full text-sm bg-transparent focus:outline-none"
            />
          </div>
          <Button
            variant="primary"
            onClick={() => {
              const reportData = filtered.map((r) => ({
                'Mentee Name': r.name,
                'Date & Time': r.time ? `${r.date}, ${r.time}` : r.date,
                Topic: r.topic,
                Status: r.status,
              }));
              downloadCallReport(reportData, 'mentor-call-history.csv');
            }}
            leftIcon={<DownloadIcon width="18" height="18" className="text-white" />}
            className="shrink-0"
          >
            Print call history
          </Button>
        </div>
      </div>

      {isLoading && (
        <p className="mx-6 text-sm text-gray-500">Loading call history…</p>
      )}
      {isError && !isLoading && (
        <p className="mx-6 text-sm text-red-600">Could not load call history.</p>
      )}
      {!isLoading && !isError && filtered.length === 0 && (
        <p className="mx-6 text-sm text-gray-500">No previous calls yet.</p>
      )}

      <ActionModal
        isOpen={openModal}
        title="How was the call?"
        description={
          selectedRow
            ? `Share how ${selectedRow.name.split(' ')[0]} is doing and anything the Osmosis team or their parents should know.`
            : 'Share how the teenager is doing and anything the Osmosis team or their parents should know.'
        }
        confirmText="Save feedback"
        color="text-green-200"
        onCancel={() => {
          setOpenModal(false);
          setSelectedRow(null);
          setFeedbackNotes('');
        }}
        onConfirm={handleSaveFeedback}
      >
        <div className="mt-6">
          <textarea
            value={feedbackNotes}
            onChange={(e) => setFeedbackNotes(e.target.value)}
            placeholder="E.g. how they're doing overall, any concerns or wins, and what the team or parents should know..."
            rows={4}
            className="rounded-lg border border-green-200/60 text-[#101828] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-200/40 w-full p-3 text-sm"
          />
        </div>
      </ActionModal>

      <DataTable
        columns={columns}
        data={paginated}
        onRowClick={() => onView?.()}
        compact
      />
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
