'use client';
import { SearchIcon, StarIcon } from '@/assets/icons';
import Button from '@/components/ui/button/Button';
import { Pagination } from '@/components/ui/Pagination/Pagination';
import { Column, DataTable } from '@/components/ui/table';
import { useGetMenteePreviousCallsQuery } from '@/store/calls/calls.api';
import { useTeenagerCallFeedbackMutation } from '@/store/dashboard/dashboard.api';
import { callRecordToPreviousRow, type PreviousCallRow } from '@/utils/mapCallApi';
import { isPreviousCallPastBySchedule } from '@/utils/dashboardCallReminders';
import { useEffect, useMemo, useState } from 'react';
import useToastify from '@/hooks/useToastify';
import ActionModal from '@/components/ui/modal/ActionModal';

export type PreviousCall = PreviousCallRow;

export default function PreviousCallTable({
  onView,
}: {
  onView?: (row: PreviousCall) => void;
}) {
  const { showToast } = useToastify();
  const { data, isLoading, isError } = useGetMenteePreviousCallsQuery();
  const [submitFeedback, { isLoading: isSubmitting }] = useTeenagerCallFeedbackMutation();

  const rows = useMemo(
    () => (data?.data ?? []).map((c) => callRecordToPreviousRow(c, 'mentee')),
    [data?.data]
  );

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<PreviousCall | null>(null);
  const [statusFilter] = useState<'All' | PreviousCall['status']>('All');

  const [perPage] = useState(5);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState('');

  const handleSubmitFeedback = async () => {
    if (!selectedRow) return;
    try {
      const payload: {
        callId: string;
        rating?: number;
        comment?: string;
      } = { callId: selectedRow.id };
      if (feedbackRating >= 1 && feedbackRating <= 5) payload.rating = feedbackRating;
      const trimmed = feedbackComment.trim();
      if (trimmed) payload.comment = trimmed;
      await submitFeedback(payload).unwrap();
      showToast('Feedback submitted. Thank you!', 'success');
      setOpenModal(false);
      setSelectedRow(null);
      setFeedbackRating(0);
      setFeedbackComment('');
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'data' in err
          ? String((err as { data?: { message?: string } }).data?.message ?? '')
          : '';
      showToast(msg || 'Could not submit feedback', 'error');
    }
  };

  const handleCloseFeedbackModal = () => {
    setOpenModal(false);
    setSelectedRow(null);
    setFeedbackRating(0);
    setFeedbackComment('');
  };

  const columns: Column<PreviousCall>[] = [
    {
      key: 'name',
      label: 'Mentor Name',
      render: (row) => {
        return (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onView?.(row);
            }}
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
        const pastBySchedule = isPreviousCallPastBySchedule(row);
        const completedByStatus = row.status === 'Completed';
        const canGiveFeedback =
          row.status !== 'Inactive' &&
          (pastBySchedule || completedByStatus);
        const hasRating =
          row.rating != null && row.rating >= 1 && row.rating <= 5;
        const hasMenteeComment =
          row.menteeComment != null &&
          String(row.menteeComment).trim() !== '';
        const feedbackDone = hasRating || hasMenteeComment;
        return (
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <Button
              onClick={() => {
                setSelectedRow(row);
                setFeedbackRating(
                  row.rating != null && row.rating >= 1 ? row.rating : 0
                );
                setFeedbackComment(row.menteeComment ?? '');
                setOpenModal(true);
              }}
              disabled={isSubmitting || !canGiveFeedback || feedbackDone}
              className="bg-green-200 text-white px-6 py-2 rounded-xl"
            >
              {feedbackDone ? 'Feedback sent' : 'Give feedback'}
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
    <div className="space-y-3  border-[#DCFFAD] border-1 mt-10 pb-10">
      <div className="flex flex-col mx-6 my-[18px] md:flex-row md:items-center md:justify-between gap-2">
        <div className="relative inline-flex items-center">
          <h3 className="font-semibold text-2xl text-green-200">
            Call History
          </h3>
        </div>
        <div className="relative flex items-center h-[44px] gap-3 w-[363px] bg-[#DCFFAD91] px-2 rounded-lg">
          <SearchIcon className="text-gray-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name"
            className="w-full h-full text-sm bg-transparent focus:outline-none"
          />
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
        title="How was your call?"
        description="Rate your mentor and share how the call went."
        confirmText="Submit feedback"
        color="text-green-200"
        onCancel={handleCloseFeedbackModal}
        onConfirm={handleSubmitFeedback}
      >
        <div className="mt-6 space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Rate your mentor</p>
            <div className="flex gap-1 items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFeedbackRating(star)}
                  className="p-0.5 focus:outline-none"
                  aria-label={`${star} star${star > 1 ? 's' : ''}`}
                >
                  <StarIcon
                    fill={star <= feedbackRating ? '#F59E0B' : '#E5E7EB'}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-500">{feedbackRating}/5</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Your feedback (optional)</p>
            <textarea
              value={feedbackComment}
              onChange={(e) => setFeedbackComment(e.target.value)}
              placeholder="How did the call go?"
              rows={3}
              className="rounded-lg border border-green-200 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-200/50 w-full px-3 py-2 text-sm"
            />
          </div>
        </div>
      </ActionModal>

      <DataTable
        columns={columns}
        data={paginated}
        onRowClick={(row) => onView?.(row)}
        compact
      />
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
