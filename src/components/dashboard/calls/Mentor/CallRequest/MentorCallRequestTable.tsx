'use client';

import { SearchIcon } from '@/assets/icons';
import Button from '@/components/ui/button/Button';
import { Pagination } from '@/components/ui/Pagination/Pagination';
import { Column, DataTable } from '@/components/ui/table';
import { useEffect, useMemo, useState } from 'react';
import useToastify from '@/hooks/useToastify';
import DeclineModal from '@/components/ui/modal/DeclineModal/DeclineModal';
import Image from 'next/image';
import { normalizeImageUrl } from '@/utils/helper';
import {
  useAcceptCallRequestMutation,
  useMentorCallRequestsQuery,
  useRejectCallRequestMutation,
} from '@/store/dashboard/dashboard.api';
import {
  pickCallsArray,
  rawToMentorCallRequestRow,
  type MentorCallRequestRow,
} from '@/utils/mapCallApi';

type CallRequestRow = MentorCallRequestRow;

const DEFAULT_REJECT_MESSAGE =
  'Thank you for your interest. I am unable to schedule a call at this time. Please try again later or reach out to another mentor.';

export default function MentorCallRequestTable() {
  const { showToast } = useToastify();
  const { data: raw, isLoading, isError } = useMentorCallRequestsQuery();
  const [acceptRequest] = useAcceptCallRequestMutation();
  const [rejectRequest] = useRejectCallRequestMutation();

  const data = useMemo(
    () => pickCallsArray(raw).map(rawToMentorCallRequestRow),
    [raw]
  );

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [perPage] = useState(5);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [declineModalOpen, setDeclineModalOpen] = useState(false);
  const [declineId, setDeclineId] = useState<string | null>(null);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [viewingNote, setViewingNote] = useState<{ name: string; note: string } | null>(null);
  const [detailRequest, setDetailRequest] = useState<CallRequestRow | null>(null);
  /** Mentor-safe teenager view (opened from call request detail). */
  const [teenagerDetail, setTeenagerDetail] = useState<CallRequestRow | null>(null);

  const handleAccept = async (id: string) => {
    setProcessingId(id);
    try {
      await acceptRequest(id).unwrap();
      showToast('Call request accepted', 'success');
    } catch {
      showToast('Failed to accept request', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeclineConfirm = async (reason: string) => {
    if (!declineId) return;

    setProcessingId(declineId);
    setDeclineModalOpen(false);

    try {
      await rejectRequest({ id: declineId, reason: reason || undefined }).unwrap();
      showToast('Call request declined', 'success');
    } catch {
      showToast('Failed to decline request', 'error');
    } finally {
      setProcessingId(null);
      setDeclineId(null);
    }
  };

  const handleDeclineClick = (id: string) => {
    setDeclineId(id);
    setDeclineModalOpen(true);
  };

  const columns: Column<CallRequestRow>[] = [
    {
      key: 'name',
      label: 'Teenager',
      render: (row) => (
        <div className="flex items-center gap-2">
          {row.pictureUrl ? (
            <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full ring-1 ring-gray-200">
              <Image
                src={normalizeImageUrl(row.pictureUrl)}
                alt=""
                fill
                className="object-cover"
                sizes="32px"
              />
            </span>
          ) : (
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-800">
              {row.name.charAt(0).toUpperCase()}
            </span>
          )}
          <span className="font-medium text-sm text-[#101828]">{row.name}</span>
        </div>
      ),
    },
    {
      key: 'requestedAtLabel',
      label: 'Requested',
      render: (row) => (
        <span className="text-sm text-[#101828] whitespace-nowrap">{row.requestedAtLabel}</span>
      ),
    },
    {
      key: 'topicDisplay',
      label: 'Topic',
      render: (row) => (
        <span className="text-sm text-[#101828] max-w-[180px] truncate" title={row.topicDisplay}>
          {row.topicDisplay}
        </span>
      ),
    },
    {
      key: 'note',
      label: 'Note',
      render: (row) => {
        const note = row.note ?? '';
        const isLong = note.length > 80;
        return (
          <div className="max-w-[240px]" onClick={(e) => e.stopPropagation()}>
            <span
              className="text-sm text-gray-600 line-clamp-2 block cursor-default"
              title={note || undefined}
            >
              {note || '—'}
            </span>
            {note && isLong && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setViewingNote({ name: row.name, note });
                  setNoteModalOpen(true);
                }}
                className="mt-0.5 text-xs text-green-600 hover:text-green-700 underline underline-offset-1"
              >
                View full note
              </button>
            )}
          </div>
        );
      },
    },
    {
      key: 'status',
      label: '',
      render: (row) => {
        const isProcessing = processingId === row.id;
        if (row.status !== 'Pending') {
          return (
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                row.status === 'Accepted'
                  ? 'bg-green-50 text-green-600'
                  : 'bg-red-50 text-red-600'
              }`}
            >
              {row.status}
            </span>
          );
        }
        return (
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <Button
              onClick={() => handleAccept(row.id)}
              disabled={isProcessing}
              className="bg-green-200 text-white px-6 py-2 rounded-xl"
            >
              Accept
            </Button>
            <Button
              onClick={() => handleDeclineClick(row.id)}
              disabled={isProcessing}
              className="bg-red-100 text-white px-6 py-2 rounded-xl"
            >
              Reject
            </Button>
          </div>
        );
      },
    },
  ];

  const filtered = data.filter((row) => {
    const q = search.toLowerCase();
    if (!q) return true;
    return (
      row.name.toLowerCase().includes(q) ||
      row.topicDisplay.toLowerCase().includes(q) ||
      row.requestedAtLabel.toLowerCase().includes(q) ||
      (row.note ?? '').toLowerCase().includes(q)
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
            Call Requests
          </h3>
        </div>
        <div className="relative flex items-center h-[44px] gap-3 w-[363px] bg-[#DCFFAD91] px-2 rounded-lg">
          <SearchIcon className="text-gray-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, topic, or note"
            className="w-full h-full text-sm bg-transparent focus:outline-none"
          />
        </div>
      </div>

      {isLoading && (
        <p className="mx-6 text-sm text-gray-500">Loading call requests…</p>
      )}
      {isError && !isLoading && (
        <p className="mx-6 text-sm text-red-600">Could not load call requests.</p>
      )}
      {!isLoading && !isError && filtered.length === 0 && (
        <p className="mx-6 text-sm text-gray-500">No pending call requests.</p>
      )}

      <DeclineModal
        isOpen={declineModalOpen}
        title="Decline Call Request"
        description="The mentee will receive your message. You can edit the default message below."
        defaultReason={DEFAULT_REJECT_MESSAGE}
        confirmText="Decline"
        onConfirm={handleDeclineConfirm}
        onCancel={() => {
          setDeclineModalOpen(false);
          setDeclineId(null);
        }}
        isLoading={!!processingId}
      />

      {noteModalOpen && viewingNote && (
        <div
          onClick={() => {
            setNoteModalOpen(false);
            setViewingNote(null);
          }}
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/20 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="mx-4 w-full max-w-md rounded-xl border border-green-200/60 bg-white p-4 shadow-lg"
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-bold text-green-200">
                Note from {viewingNote.name}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setNoteModalOpen(false);
                  setViewingNote(null);
                }}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100"
              >
                Close
              </button>
            </div>
            <p className="text-sm text-[#101828] whitespace-pre-wrap">
              {viewingNote.note}
            </p>
          </div>
        </div>
      )}

      {detailRequest && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-sm"
          onClick={() => setDetailRequest(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="mx-4 w-full max-w-md rounded-xl border border-green-200/60 bg-white p-5 shadow-lg"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-green-200">Call request detail</h3>
              <button
                type="button"
                onClick={() => setDetailRequest(null)}
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100"
              >
                Close
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-[11px] text-[#667085] font-medium uppercase tracking-wider">Teenager</p>
                <p className="text-sm font-medium text-[#101828]">{detailRequest.name}</p>
              </div>
              <div>
                <p className="text-[11px] text-[#667085] font-medium uppercase tracking-wider">
                  Requested time
                </p>
                <p className="text-sm text-[#101828]">{detailRequest.requestedAtLabel}</p>
              </div>
              <div>
                <p className="text-[11px] text-[#667085] font-medium uppercase tracking-wider">Topic</p>
                <p className="text-sm text-[#101828]">{detailRequest.topicDisplay}</p>
              </div>
              <div>
                <p className="text-[11px] text-[#667085] font-medium uppercase tracking-wider">Message</p>
                <p className="text-sm text-[#101828] whitespace-pre-wrap">
                  {detailRequest.note || '—'}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-[#667085] font-medium uppercase tracking-wider">Status</p>
                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                    detailRequest.status === 'Accepted'
                      ? 'bg-green-50 text-green-600'
                      : detailRequest.status === 'Rejected'
                        ? 'bg-red-50 text-red-600'
                        : 'bg-amber-50 text-amber-600'
                  }`}
                >
                  {detailRequest.status}
                </span>
              </div>
              <p>
                <button
                  type="button"
                  className="text-sm font-medium text-green-600 hover:text-green-700 underline underline-offset-2"
                  onClick={() => setTeenagerDetail(detailRequest)}
                >
                  View teenager details
                </button>
              </p>
              {detailRequest.status === 'Pending' && (
                <div className="flex gap-2 pt-2" onClick={(e) => e.stopPropagation()}>
                  <Button
                    onClick={() => {
                      setDetailRequest(null);
                      void handleAccept(detailRequest.id);
                    }}
                    disabled={!!processingId}
                    className="bg-green-200 text-white px-6 py-2 rounded-xl flex-1"
                  >
                    Accept
                  </Button>
                  <Button
                    onClick={() => {
                      setDetailRequest(null);
                      handleDeclineClick(detailRequest.id);
                    }}
                    disabled={!!processingId}
                    className="bg-red-100 text-white px-6 py-2 rounded-xl flex-1"
                  >
                    Reject
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {teenagerDetail && (
        <div
          className="fixed inset-0 z-[101] flex items-center justify-center bg-black/20 backdrop-blur-sm"
          onClick={() => setTeenagerDetail(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="mx-4 w-full max-w-md rounded-xl border border-green-200/60 bg-white p-5 shadow-lg"
          >
            <div className="mb-4 flex items-center justify-between gap-2">
              <h3 className="text-lg font-bold text-green-200">Teenager</h3>
              <button
                type="button"
                onClick={() => setTeenagerDetail(null)}
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100"
              >
                Close
              </button>
            </div>
            <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left gap-4">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full ring-2 ring-green-100 bg-green-50">
                {teenagerDetail.pictureUrl ? (
                  <Image
                    src={normalizeImageUrl(teenagerDetail.pictureUrl)}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-2xl font-bold text-green-800">
                    {teenagerDetail.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <p className="text-base font-semibold text-[#101828]">{teenagerDetail.name}</p>
                <p className="text-xs text-gray-500">
                  Basic info from this request only — no address or contact details.
                </p>
              </div>
            </div>
            <div className="mt-5 space-y-4 border-t border-gray-100 pt-4">
              <div>
                <p className="text-[11px] text-[#667085] font-medium uppercase tracking-wider">
                  Requested time
                </p>
                <p className="text-sm text-[#101828]">{teenagerDetail.requestedAtLabel}</p>
              </div>
              <div>
                <p className="text-[11px] text-[#667085] font-medium uppercase tracking-wider">Topic</p>
                <p className="text-sm text-[#101828]">{teenagerDetail.topicDisplay}</p>
              </div>
              <div>
                <p className="text-[11px] text-[#667085] font-medium uppercase tracking-wider">Message</p>
                <p className="text-sm text-[#101828] whitespace-pre-wrap">
                  {teenagerDetail.note || '—'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <DataTable
        columns={columns}
        data={paginated}
        compact
        onRowClick={(row) => setDetailRequest(row)}
      />
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
