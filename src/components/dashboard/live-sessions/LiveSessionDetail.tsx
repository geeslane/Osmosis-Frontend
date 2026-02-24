'use client';

import {
  CalendarIcon,
  Edit,
  FileIcon,
  LinkedinIcon,
  LiveIcon,
  UserAddIcon,
} from '@/assets/icons';
import Button from '@/components/ui/button/Button';
import ActionModal from '@/components/ui/modal/ActionModal';
import type { AddLiveSessionFormInputs } from './AddLive';
import {
  apiSessionToRecord,
  formatSessionDateTime,
  isSessionPast,
  type LiveSessionRecord,
} from '@/lib/liveSessions';
import { liveSessionsApi, type ApiComment } from '@/lib/liveSessionsApi';
import useToastify from '@/hooks/useToastify';
import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import AddLive from './AddLive';
import { ChevronDownIcon } from 'lucide-react';
import { normalizeImageUrl } from '@/utils/helper';

type LiveSessionDetailProps = {
  id: string;
  onBack?: () => void;
};

const iconClass = 'flex-shrink-0 w-5 h-5 text-green-200';

function DetailRow({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | null | undefined;
  href?: string;
}) {
  const display = value ?? '—';
  const isLink = href && display !== '—';

  return (
    <div className="flex gap-4">
      <div className={iconClass}>{icon}</div>
      <div className="flex flex-col gap-1 min-w-0 flex-1">
        <p className="text-green-300 text-xs font-bold uppercase tracking-wide">
          {label}
        </p>
        {isLink ? (
          <a
            href={href.startsWith('http') ? href : `https://${href}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-200 font-medium break-all hover:underline hover:text-green-300 transition-colors"
          >
            {display}
          </a>
        ) : (
          <p className="text-[#282F2E] font-medium break-words text-sm leading-relaxed">
            {display}
          </p>
        )}
      </div>
    </div>
  );
}

const STATUS_STYLES = {
  scheduled:
    'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-sm shadow-emerald-100',
  completed: 'bg-sky-50 text-sky-700 border-sky-300 shadow-sm shadow-sky-100',
  cancelled: 'bg-red-50 text-red-600 border-red-200',
} as const;

export default function LiveSessionDetail({ id }: LiveSessionDetailProps) {
  const { showToast } = useToastify();
  const [session, setSession] = useState<LiveSessionRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const [notesForm, setNotesForm] = useState({
    sessionNotes: '',
    recordingUrl: '',
  });
  const [comments, setComments] = useState<ApiComment[]>([]);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentsPage, setCommentsPage] = useState(1);
  const [commentsTotalPages, setCommentsTotalPages] = useState(1);
  const [newCommentText, setNewCommentText] = useState('');
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [notesSaving, setNotesSaving] = useState(false);

  const fetchSession = useCallback(async () => {
    try {
      const api = await liveSessionsApi.getById(id);
      setSession(apiSessionToRecord(api));
    } catch {
      setSession(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchComments = useCallback(async () => {
    try {
      const res = await liveSessionsApi.getComments(id, {
        page: commentsPage,
        limit: 10,
      });
      setComments(res.data);
      setCommentsTotalPages(res.totalPages);
    } catch {
      setComments([]);
    }
  }, [id, commentsPage]);

  useEffect(() => {
    setLoading(true);
    fetchSession();
  }, [fetchSession]);

  useEffect(() => {
    if (session) fetchComments();
  }, [session, fetchComments]);

  if (loading) {
    return (
      <div className="rounded-xl border border-green-200/60 bg-white px-6 py-8 text-center text-gray-500">
        Loading session...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="rounded-md px-4 md:px-[64px] border-2 border-[#6CBB0180] py-8 w-full">
        <p className="text-red-500">Live session not found.</p>
      </div>
    );
  }

  const initialFormData: AddLiveSessionFormInputs = {
    topic: session.topic,
    date: session.date,
    time: session.time,
    url: session.url,
    speakerName: session.speakerName,
    bio: session.bio,
    linkedinUrl: session.linkedinUrl ?? '',
    pictureUrl: session.pictureUrl ?? '',
  };

  if (isEditing) {
    return (
      <div className="space-y-6 max-w-[747px] w-full">
        <div className="flex items-center justify-between">
          <h3 className="text-green-200 text-2xl font-bold">
            Edit Live Session
          </h3>
          <Button
            type="button"
            variant="secondary"
            className="font-medium flex gap-1"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </Button>
        </div>
        <div className="max-w-[747px] w-full rounded-xl border border-green-200/60 bg-white px-6 md:px-10 py-8 shadow-sm">
          <AddLive
            initialData={initialFormData}
            sessionId={session.id}
            onSaved={() => {
              fetchSession();
              setIsEditing(false);
            }}
          />
        </div>
      </div>
    );
  }

  const sessionDateTime = formatSessionDateTime(session.date, session.time);
  const speakerInitial = session.speakerName?.charAt(0)?.toUpperCase() ?? '?';
  const speakerImageUrl =
    session.pictureUrl && session.pictureUrl.trim()
      ? normalizeImageUrl(session.pictureUrl)
      : null;
  const isPast = isSessionPast(session.date, session.time);
  const isCancelled = session.status === 'cancelled';
  const displayStatus = isCancelled
    ? 'cancelled'
    : isPast
      ? 'completed'
      : session.status;
  const canEdit = !isCancelled && !isPast;
  const showNotesSection =
    !isCancelled && (isPast || session.status === 'completed');
  const hasNotesOrRecording = !!(
    session.sessionNotes?.trim() || session.recordingUrl?.trim()
  );

  const openNotesModal = () => {
    setNotesForm({
      sessionNotes: session.sessionNotes ?? '',
      recordingUrl: session.recordingUrl ?? '',
    });
    setNotesModalOpen(true);
  };

  const saveNotes = async () => {
    const notes = notesForm.sessionNotes.trim();
    if (notes.length < 5) {
      showToast('Session notes must be at least 5 characters.', 'error');
      return;
    }
    setNotesSaving(true);
    try {
      const updated = await liveSessionsApi.postNotes(session.id, {
        sessionNotes: notes,
        recordingUrl: notesForm.recordingUrl.trim() || undefined,
      });
      setSession(apiSessionToRecord(updated));
      showToast('Session notes and recording saved.', 'success');
      setNotesModalOpen(false);
    } catch (err: unknown) {
      const message =
        err &&
        typeof err === 'object' &&
        'response' in err &&
        (err as { response?: { data?: { message?: string } } }).response?.data?.message
          ? (err as { response: { data: { message: string } } }).response.data.message
          : 'Failed to save notes';
      showToast(String(message), 'error');
    } finally {
      setNotesSaving(false);
    }
  };

  const formatCommentTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    const timeStr = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    if (diffMins < 1) return `Just now • ${timeStr}`;
    if (diffMins < 60) return `${diffMins}m ago • ${timeStr}`;
    if (diffHours < 24) return `${diffHours}h ago • ${timeStr}`;
    if (diffDays < 7) return `${diffDays}d ago • ${timeStr}`;

    const dateStr = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
    return `${dateStr} • ${timeStr}`;
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row gap-6 w-full">
        {/* Left: Details, Speaker, Notes */}
        <div className="flex-1 md:flex-[2] min-w-0 flex flex-col gap-6">
          {/* Header with status + edit */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-green-200 text-2xl font-bold">
              Live Session Details
            </h3>
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold capitalize border ${STATUS_STYLES[displayStatus]}`}
              >
                {displayStatus}
              </span>
              {canEdit && (
                <Button
                  type="button"
                  variant="primary"
                  className="font-medium flex gap-1"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit />
                  Edit
                </Button>
              )}
            </div>
          </div>

          {/* Hero: topic + date/time */}
          <div
            className={`rounded-xl border px-5 py-5 md:px-6 md:py-6 ${
              isCancelled
                ? 'border-red-100 bg-red-50/50 opacity-90'
                : 'border-green-200/60 bg-gradient-to-br from-[#DCFFAD30] to-transparent'
            }`}
          >
            <h2 className="text-xl md:text-2xl font-bold text-[#282F2E] mb-1">
              {session.topic}
            </h2>
            <p className="text-sm text-green-300 font-medium flex items-center gap-2">
              <span className="w-4 h-4 flex-shrink-0 text-green-200">
                <CalendarIcon />
              </span>
              {sessionDateTime}
            </p>
            {isCancelled && (
              <>
                <p className="mt-2 text-sm text-red-600 font-medium">
                  This session was cancelled. It cannot be edited or cancelled again.
                </p>
                {session.cancellationReason && (
                  <p className="mt-1 text-sm text-gray-600">
                    Reason: {session.cancellationReason}
                  </p>
                )}
              </>
            )}
            {isPast && !isCancelled && (
              <p className="mt-2 text-sm text-sky-600 font-medium">
                This session has ended. Add notes and a recording link below.
              </p>
            )}
          </div>

          {/* Session & speaker card */}
          <div className="rounded-xl border border-green-200/60 bg-white shadow-sm overflow-hidden">
            {/* Session info */}
            <div className="px-4 md:px-8 py-5 border-b border-green-100/80">
              <h4 className="text-xs font-bold uppercase tracking-wider text-green-300 mb-4">
                Session
              </h4>
              <div className="space-y-5">
                <DetailRow
                  icon={<LiveIcon width={20} height={20} />}
                  label="Live Session URL"
                  value={session.url}
                  href={session.url}
                />
              </div>
            </div>

            {/* Speaker info */}
            <div className="px-4 md:px-8 py-5 md:py-6 bg-[#F8FDF5]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-green-300 mb-4">
                Speaker
              </h4>
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <div className="flex-shrink-0 w-14 h-14 rounded-full overflow-hidden bg-green-100 flex items-center justify-center text-green-200 font-bold text-xl border border-green-200/60">
                  {speakerImageUrl ? (
                    <Image
                      src={speakerImageUrl}
                      alt={session.speakerName ?? 'Guest speaker'}
                      width={56}
                      height={56}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    speakerInitial
                  )}
                </div>
                <div className="space-y-5 flex-1 min-w-0">
                  <DetailRow
                    icon={<UserAddIcon />}
                    label="Guest Speaker"
                    value={session.speakerName}
                  />
                  <DetailRow
                    icon={<FileIcon width="20" height="20" className="" />}
                    label="Bio"
                    value={session.bio}
                  />
                  <DetailRow
                    icon={<LinkedinIcon />}
                    label="LinkedIn"
                    value={session.linkedinUrl}
                    href={session.linkedinUrl ?? undefined}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Session notes & recording (completed/past only) */}
          {showNotesSection && (
            <div className="rounded-xl border border-sky-200/60 bg-gradient-to-br from-sky-50/80 to-white overflow-hidden shadow-sm">
              <div className="px-4 md:px-8 py-5 border-b border-sky-100 flex flex-wrap items-center justify-between gap-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-sky-700">
                  Session notes & recording
                </h4>
                <Button
                  type="button"
                  variant="primary"
                  className="font-semibold text-xs md:text-sm px-4 py-2"
                  onClick={openNotesModal}
                >
                  {hasNotesOrRecording
                    ? 'Edit notes & recording'
                    : 'Add notes & recording'}
                </Button>
              </div>
              <div className="px-4 md:px-8 py-5 space-y-4">
                {session.recordingUrl ? (
                  <DetailRow
                    icon={<LiveIcon width={20} height={20} />}
                    label="Recording"
                    value={session.recordingUrl}
                    href={session.recordingUrl}
                  />
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    No recording link added yet.
                  </p>
                )}
                {session.sessionNotes ? (
                  <div className="flex gap-4">
                    <div className={iconClass}>
                      <FileIcon width="20" height="20" className="" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-green-300 text-xs font-bold uppercase tracking-wide mb-1">
                        Notes
                      </p>
                      <p className="text-[#282F2E] font-medium text-sm leading-relaxed whitespace-pre-wrap">
                        {session.sessionNotes}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    No session notes yet.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right: Comments (Collapsible) */}
        <div className="w-full md:w-1/3 md:flex-[1] min-w-0 flex flex-col gap-4">
          <Button
            type="button"
            variant="outline"
            className="font-medium flex items-center gap-1.5 text-sm md:mt-0 mt-4"
            onClick={() => setCommentsOpen(!commentsOpen)}
            aria-expanded={commentsOpen}
            aria-controls="comments-panel"
          >
            <span>Comments ({comments.length})</span>
            <span
              className={`inline-flex transition-transform duration-200 ${commentsOpen ? 'rotate-180' : ''}`}
            >
              <ChevronDownIcon />
            </span>
          </Button>
          <div
            id="comments-panel"
            className={`overflow-hidden transition-all duration-300 ${commentsOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}
          >
            <div className="rounded-xl border border-green-200/70 bg-white shadow-sm px-4 py-5 md:px-6 md:py-6">
              {comments.length > 0 ? (
                <>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div>
                      <h4 className="text-base font-semibold text-[#282F2E]">
                        Teenagers&apos; comments
                      </h4>
                      <p className="text-xs text-green-300 mt-0.5">
                        What teenagers are saying about this session
                      </p>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-[#DCFFAD] text-green-200 text-xs font-semibold px-2.5 py-1 whitespace-nowrap leading-none h-6 min-w-[2.5rem] justify-center">
                      {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
                    </span>
                  </div>
                  <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                    {comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="rounded-lg border border-green-100 bg-[#F8FDF5] px-4 py-3 space-y-2"
                      >
                        <div className="flex items-start gap-3">
                          {comment.authorPictureUrl ? (
                            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border-2 border-green-200">
                              <Image
                                src={comment.authorPictureUrl}
                                alt={comment.authorName}
                                width={40}
                                height={40}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-sm font-semibold text-green-200 flex-shrink-0">
                              {comment.authorName.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1.5">
                              <p className="text-sm font-semibold text-[#282F2E]">
                                {comment.authorName}
                              </p>
                              <span className="text-[11px] text-gray-500 whitespace-nowrap">
                                {formatCommentTime(comment.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm text-[#282F2E] leading-relaxed break-words">
                              {comment.text}
                            </p>
                            {comment.replies && comment.replies.length > 0 && (
                              <div className="mt-3 pl-2 border-l-2 border-green-200 space-y-2">
                                {comment.replies.map((reply) => (
                                  <div key={reply.id} className="text-sm">
                                    <p className="font-medium text-[#282F2E]">
                                      {reply.authorName}
                                    </p>
                                    <p className="text-gray-600 break-words">
                                      {reply.text}
                                    </p>
                                    <span className="text-[10px] text-gray-400">
                                      {formatCommentTime(reply.createdAt)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <form
                    className="mt-4 pt-4 border-t border-green-100"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const text = newCommentText.trim();
                      if (text.length < 2) {
                        showToast('Comment must be at least 2 characters.', 'error');
                        return;
                      }
                      setCommentSubmitting(true);
                      try {
                        await liveSessionsApi.addComment(id, { text });
                        setNewCommentText('');
                        showToast('Comment added.', 'success');
                        fetchComments();
                      } catch (err: unknown) {
                        const message =
                          err &&
                          typeof err === 'object' &&
                          'response' in err &&
                          (err as { response?: { data?: { message?: string } } }).response?.data?.message
                            ? (err as { response: { data: { message: string } } }).response.data.message
                            : 'Failed to add comment';
                        showToast(String(message), 'error');
                      } finally {
                        setCommentSubmitting(false);
                      }
                    }}
                  >
                    <textarea
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      placeholder="Add a comment (min 2 characters)..."
                      rows={2}
                      className="w-full text-sm border border-green-200 rounded-lg px-3 py-2 focus:outline-none focus:border-green-300 resize-none"
                    />
                    <Button
                      type="submit"
                      variant="primary"
                      className="mt-2 text-sm"
                      disabled={commentSubmitting || newCommentText.trim().length < 2}
                    >
                      {commentSubmitting ? 'Sending...' : 'Add comment'}
                    </Button>
                  </form>
                  {commentsTotalPages > 1 && (
                    <div className="mt-4 flex items-center justify-between border-t border-green-100 pt-3">
                      <Button
                        type="button"
                        variant="secondary"
                        className="text-xs"
                        disabled={commentsPage <= 1}
                        onClick={() => setCommentsPage((p) => Math.max(1, p - 1))}
                      >
                        Previous
                      </Button>
                      <span className="text-xs text-gray-500">
                        Page {commentsPage} of {commentsTotalPages}
                      </span>
                      <Button
                        type="button"
                        variant="secondary"
                        className="text-xs"
                        disabled={commentsPage >= commentsTotalPages}
                        onClick={() =>
                          setCommentsPage((p) => Math.min(commentsTotalPages, p + 1))
                        }
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center text-gray-400 py-8">
                  <p className="text-sm">No comments for this session yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <ActionModal
        isOpen={notesModalOpen}
        title={
          hasNotesOrRecording
            ? 'Edit notes & recording'
            : 'Add notes & recording'
        }
        description="Add session notes (min 5 characters) and optional recording URL."
        confirmText="Save"
        cancelText="Cancel"
        isLoading={notesSaving}
        onConfirm={saveNotes}
        onCancel={() => setNotesModalOpen(false)}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-green-300 text-xs font-bold uppercase tracking-wide mb-1">
              Session notes
            </label>
            <textarea
              value={notesForm.sessionNotes}
              onChange={(e) =>
                setNotesForm((p) => ({ ...p, sessionNotes: e.target.value }))
              }
              placeholder="Key takeaways, Q&A highlights, follow-up resources..."
              rows={4}
              className="w-full text-sm border border-green-200 rounded-lg px-3 py-2 focus:outline-none focus:border-green-300 resize-none"
            />
          </div>
          <div>
            <label className="block text-green-300 text-xs font-bold uppercase tracking-wide mb-1">
              Recording URL
            </label>
            <input
              type="url"
              value={notesForm.recordingUrl}
              onChange={(e) =>
                setNotesForm((p) => ({ ...p, recordingUrl: e.target.value }))
              }
              placeholder="https://..."
              className="w-full text-sm border border-green-200 rounded-lg px-3 py-2 focus:outline-none focus:border-green-300"
            />
          </div>
        </div>
      </ActionModal>
    </div>
  );
}
