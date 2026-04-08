'use client';

import { SearchIcon } from '@/assets/icons';
import Button from '@/components/ui/button/Button';
import { Pagination } from '@/components/ui/Pagination/Pagination';
import { Column, DataTable } from '@/components/ui/table';
import { useEffect, useState } from 'react';
import useToastify from '@/hooks/useToastify';
import DeclineModal from '@/components/ui/modal/DeclineModal/DeclineModal';

type CallRequestRow = {
  id: string;
  name: string;
  email: string;
  note?: string;
  status: 'Pending' | 'Accepted' | 'Rejected';
};

const DEFAULT_REJECT_MESSAGE =
  'Thank you for your interest. I am unable to schedule a call at this time. Please try again later or reach out to another mentor.';

export default function MentorCallRequestTable() {
  const { showToast } = useToastify();
  const [data, setData] = useState<CallRequestRow[]>([
    {
      id: '1',
      name: 'Olivia Rhye',
      email: 'olivia@example.com',
      note: 'Would love to discuss career transitions and finding purpose.',
      status: 'Pending',
    },
    {
      id: '2',
      name: 'Phoenix Baker',
      email: 'phoenix@example.com',
      note: undefined,
      status: 'Pending',
    },
    {
      id: '3',
      name: 'Lana Steiner',
      email: 'lana@example.com',
      note: 'Interested in the Hope module.',
      status: 'Pending',
    },
  ]);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [perPage] = useState(5);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [declineModalOpen, setDeclineModalOpen] = useState(false);
  const [declineId, setDeclineId] = useState<string | null>(null);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [viewingNote, setViewingNote] = useState<{ name: string; note: string } | null>(null);
  const [detailRequest, setDetailRequest] = useState<CallRequestRow | null>(null);

  const handleAccept = async (id: string) => {
    setProcessingId(id);
    try {
      // TODO: API call to accept
      setData((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: 'Accepted' } : item
        )
      );
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
      // TODO: API call to reject with reason
      setData((prev) =>
        prev.map((item) =>
          item.id === declineId ? { ...item, status: 'Rejected' } : item
        )
      );
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
      label: 'Name',
      render: (row) => (
        <span className="font-medium text-sm text-[#101828]">{row.name}</span>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      render: (row) => (
        <span className="text-sm text-[#101828]">{row.email}</span>
      ),
    },
    {
      key: 'note',
      label: 'Note',
      render: (row) => {
        const note = row.note ?? '';
        const isLong = note.length > 80;
        return (
          <div className="max-w-[240px]">
            <span
              className="text-sm text-gray-600 line-clamp-2 block cursor-default"
              title={note || undefined}
            >
              {note || '—'}
            </span>
            {note && isLong && (
              <button
                type="button"
                onClick={() => {
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
      row.email.toLowerCase().includes(q) ||
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
            placeholder="Search by name or email"
            className="w-full h-full text-sm bg-transparent focus:outline-none"
          />
        </div>
      </div>

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

      {/* View full note modal */}
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

      {/* Call request detail modal */}
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
                <p className="text-[11px] text-[#667085] font-medium uppercase tracking-wider">Name</p>
                <p className="text-sm font-medium text-[#101828]">{detailRequest.name}</p>
              </div>
              <div>
                <p className="text-[11px] text-[#667085] font-medium uppercase tracking-wider">Email</p>
                <p className="text-sm text-[#101828]">{detailRequest.email}</p>
              </div>
              <div>
                <p className="text-[11px] text-[#667085] font-medium uppercase tracking-wider">Note</p>
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
              {detailRequest.status === 'Pending' && (
                <div className="flex gap-2 pt-2" onClick={(e) => e.stopPropagation()}>
                  <Button
                    onClick={() => {
                      setDetailRequest(null);
                      handleAccept(detailRequest.id);
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
