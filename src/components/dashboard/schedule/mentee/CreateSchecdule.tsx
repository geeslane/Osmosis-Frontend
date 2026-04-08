'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { GoBackIcon, LinkedinIcon, LoadingIcon } from '@/assets/icons';
import Button from '@/components/ui/button/Button';
import useToastify from '@/hooks/useToastify';
import { normalizeImageUrl, formatDate } from '@/utils/helper';
import { useGetDropdownByTypeQuery } from '@/store/auth/auth.api';
import {
  useCreateCallRequestMutation,
  useGetAvailableSlotsQuery,
} from '@/store/schedule/schedule.api';
import { useGetMentorsQuery } from '@/store/users/users.api';

const DAYS_AHEAD = 10;
/** First bookable calendar day = UTC today + 3 (matches GET /mentor/:id/available-slots). */
const BOOKING_START_OFFSET_DAYS = 3;
const SLOT_DURATION_MINUTES = 30;

function getUtcTodayYmd(): string {
  return new Date().toISOString().slice(0, 10);
}

function addUtcCalendarDays(ymd: string, days: number): string {
  const [y, mo, d] = ymd.split('-').map(Number);
  const dt = new Date(Date.UTC(y, mo - 1, d));
  dt.setUTCDate(dt.getUTCDate() + days);
  return dt.toISOString().slice(0, 10);
}

function getEarliestBookingYmdUtc(): string {
  return addUtcCalendarDays(getUtcTodayYmd(), BOOKING_START_OFFSET_DAYS);
}

function getUtcDateRangeFrom(startYmd: string, count: number): string[] {
  const out: string[] = [];
  let cur = startYmd;
  for (let i = 0; i < count; i++) {
    out.push(cur);
    cur = addUtcCalendarDays(cur, 1);
  }
  return out;
}

type MentorItem = {
  id: string;
  name: string;
  bio: string;
  linkedinUrl?: string;
  topics: string | string[];
  image?: string;
};

function formatTime(s: string): string {
  const [h, m] = s.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m ?? 0).padStart(2, '0')} ${period}`;
}

function BookingStepper({ step }: { step: 1 | 2 | 3 }) {
  const steps = [
    { n: 1 as const, label: 'Topic' },
    { n: 2 as const, label: 'Mentor' },
    { n: 3 as const, label: 'Date & time' },
  ];
  return (
    <nav aria-label="Booking steps" className="mb-6 sm:mb-8 max-w-xl mx-auto">
      <ol className="flex w-full list-none items-center gap-0 p-0 m-0">
        {steps.map((s, i) => {
          const done = step > s.n;
          const active = step === s.n;
          return (
            <li
              key={s.n}
              className={`flex min-w-0 items-center ${i < steps.length - 1 ? 'flex-1' : 'flex-none'}`}
            >
              <div className="flex flex-col items-center gap-1.5">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                    active
                      ? 'bg-green-200 text-white shadow-sm ring-2 ring-green-200/35 ring-offset-2'
                      : done
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {done ? '✓' : s.n}
                </span>
                <span
                  className={`max-w-[4.5rem] text-center text-[10px] font-medium leading-tight sm:max-w-none sm:text-xs ${
                    active ? 'text-green-200' : done ? 'text-gray-700' : 'text-gray-400'
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`mx-1.5 h-0.5 min-w-[1rem] flex-1 rounded-full sm:mx-3 ${
                    step > s.n ? 'bg-green-200' : 'bg-gray-200'
                  }`}
                  aria-hidden
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function mapMentorFromApi(apiMentor: {
  id: string;
  fullName?: string;
  pictureUrl?: string;
  mentorshipTopics?: string[] | string;
  bio?: string;
  linkedinUrl?: string;
}): MentorItem {
  const topics = apiMentor.mentorshipTopics;
  const topicsStr = Array.isArray(topics)
    ? topics.join(', ')
    : typeof topics === 'string'
      ? topics
      : '—';
  return {
    id: apiMentor.id,
    name: apiMentor.fullName || 'Mentor',
    bio: apiMentor.bio || '—',
    linkedinUrl: apiMentor.linkedinUrl,
    topics: topicsStr,
    image: apiMentor.pictureUrl,
  };
}

// ---- MentorCardView ----
function MentorCardView({
  mentor,
  onBook,
}: {
  mentor: MentorItem;
  onBook: () => void;
}) {
  const [bioExpanded, setBioExpanded] = useState(false);
  const topicsStr =
    typeof mentor.topics === 'string'
      ? mentor.topics
      : Array.isArray(mentor.topics)
        ? mentor.topics.join(', ')
        : '—';
  const imageSrc = mentor.image ? normalizeImageUrl(mentor.image) : null;
  const initial = mentor.name.charAt(0).toUpperCase();

  return (
    <div className="rounded-2xl border border-green-200/60 bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow w-full min-w-0">
      <div className="flex flex-col sm:flex-row">
        <div className="relative h-36 sm:h-40 sm:w-36 flex-shrink-0 bg-green-50">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={mentor.name}
              fill
              className="object-cover"
              sizes="144px"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-green-200">
              {initial}
            </div>
          )}
        </div>
        <div className="p-4 sm:p-5 flex-1 flex flex-col min-w-0">
          <h3 className="font-bold text-base sm:text-lg text-[#101828]">{mentor.name}</h3>
          <p className="text-xs text-green-200 font-medium mt-0.5">{topicsStr}</p>
          <div className="mt-2 flex-1">
            <p className={`text-sm text-gray-600 ${!bioExpanded && mentor.bio.length > 100 ? 'line-clamp-3' : ''}`}>
              {mentor.bio}
            </p>
            {mentor.bio.length > 100 && (
              <button
                type="button"
                onClick={() => setBioExpanded((e) => !e)}
                className="text-sm font-medium text-green-200 hover:text-green-300 mt-1"
              >
                {bioExpanded ? 'Show less' : 'Read full bio'}
              </button>
            )}
          </div>
          {mentor.linkedinUrl && (
            <a
              href={
                mentor.linkedinUrl.startsWith('http')
                  ? mentor.linkedinUrl
                  : `https://${mentor.linkedinUrl}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-green-200 hover:text-green-300 mt-2"
            >
              <LinkedinIcon />
              LinkedIn
            </a>
          )}
          <Button
            type="button"
            className="mt-4 bg-green-200 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:opacity-95 w-full sm:w-auto"
            onClick={onBook}
          >
            Choose this mentor
          </Button>
        </div>
      </div>
    </div>
  );
}

function DateSlotCell({
  mentorId,
  date,
  selected,
  onSelect,
}: {
  mentorId: string;
  date: string;
  selected: boolean;
  onSelect: () => void;
}) {
  const { data, isLoading } = useGetAvailableSlotsQuery(
    { mentorId, date, duration: SLOT_DURATION_MINUTES },
    { skip: !mentorId || !date }
  );
  const hasSlots = (data?.slots?.length ?? 0) > 0;
  const disabled = isLoading || !hasSlots;
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => {
        if (!disabled) onSelect();
      }}
      title={hasSlots ? 'Openings available' : 'No openings this day'}
      className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-all border ${
        disabled
          ? 'cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400 opacity-80'
          : selected
            ? 'bg-green-200 text-white border-green-200 shadow-sm'
            : 'bg-white text-gray-800 border-gray-200 hover:bg-gray-50'
      }`}
    >
      {isLoading ? '…' : formatDate(date)}
    </button>
  );
}

function AvailableDatesOnly({
  mentorId,
  selectedDate,
  onSelectDate,
}: {
  mentorId: string;
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
}) {
  const dates = useMemo(
    () => getUtcDateRangeFrom(getEarliestBookingYmdUtc(), DAYS_AHEAD),
    []
  );
  return (
    <div className="flex flex-wrap gap-2">
      {dates.map((date) => (
        <DateSlotCell
          key={date}
          mentorId={mentorId}
          date={date}
          selected={selectedDate === date}
          onSelect={() => onSelectDate(date)}
        />
      ))}
    </div>
  );
}

export default function CreateSchedule() {
  const router = useRouter();
  const { showToast } = useToastify();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [selectedMentor, setSelectedMentor] = useState<MentorItem | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [mentorSearch, setMentorSearch] = useState('');

  const { data: topicsData, isLoading: topicsLoading } =
    useGetDropdownByTypeQuery({ type: 'mentorship-topics' });
  const topicOptions = topicsData?.data ?? [];

  const selectedTopicLabel = useMemo(() => {
    const o = topicOptions.find(
      (opt: { value: string; label: string }) => opt.value === selectedTopic
    );
    return o?.label ?? '';
  }, [topicOptions, selectedTopic]);

  const {
    data: mentorsResponse,
    isLoading: mentorsLoading,
    isError: mentorsError,
    refetch: refetchMentors,
  } = useGetMentorsQuery(
    {
      topic: selectedTopic || undefined,
      status: 'ACTIVE',
      limit: 50,
    },
    { skip: step < 2 }
  );

  const apiMentors = useMemo(
    () =>
      (mentorsResponse?.data ?? []).map((m: Record<string, unknown>) =>
        mapMentorFromApi(m as Parameters<typeof mapMentorFromApi>[0])
      ),
    [mentorsResponse]
  );

  const filteredMentors = useMemo(() => {
    const q = mentorSearch.trim().toLowerCase();
    if (!q) return apiMentors;
    return apiMentors.filter((m: MentorItem) => {
      const topicStr =
        typeof m.topics === 'string'
          ? m.topics
          : Array.isArray(m.topics)
            ? m.topics.join(', ')
            : '';
      return (
        m.name.toLowerCase().includes(q) ||
        m.bio.toLowerCase().includes(q) ||
        topicStr.toLowerCase().includes(q)
      );
    });
  }, [apiMentors, mentorSearch]);

  useEffect(() => {
    if (step === 1) setMentorSearch('');
  }, [step]);

  const [createCallRequest, { isLoading: isSubmitting }] =
    useCreateCallRequestMutation();

  const {
    data: slotsData,
    isLoading: slotsLoading,
    isError: slotsError,
    error: slotsErrorDetail,
  } = useGetAvailableSlotsQuery(
    {
      mentorId: selectedMentor?.id ?? '',
      date: selectedDate ?? '',
      duration: SLOT_DURATION_MINUTES,
    },
    {
      skip: !selectedMentor || !selectedDate || step !== 3,
    }
  );
  const slots = slotsData?.slots ?? [];
  const slotsErrorMessage =
    (slotsErrorDetail as { data?: { message?: string } })?.data?.message ??
    (slotsError ? 'Could not load time slots.' : null);
  const [selectedTime, setSelectedTime] = useState<string>('');

  const handleBack = () => {
    if (step === 1) {
      router.push('/dashboard/calls/mentee?role=upcoming');
      return;
    }
    if (step === 2) setStep(1);
    if (step === 3) {
      setStep(2);
      setSelectedDate(null);
      setSelectedTime('');
      setMessage('');
    }
  };

  const handleSeeMentors = () => {
    if (!selectedTopic) {
      showToast('Please select a topic', 'error');
      return;
    }
    setStep(2);
  };

  const handleBookMentor = (mentor: MentorItem) => {
    setSelectedMentor(mentor);
    setStep(3);
  };

  const handleSubmitRequest = async () => {
    if (!selectedMentor || !selectedDate || !selectedTime) {
      showToast('Please select date and time', 'error');
      return;
    }
    try {
      await createCallRequest({
        mentorId: selectedMentor.id,
        date: selectedDate,
        time: selectedTime,
        message: message.trim() || undefined,
      }).unwrap();
      showToast('Call request sent successfully', 'success');
      router.push('/dashboard/calls/mentee?role=upcoming');
    } catch (err: unknown) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ??
        'Failed to send request';
      showToast(msg, 'error');
    }
  };

  return (
    <div className="mt-6 sm:mt-8 max-w-4xl mx-auto w-full min-w-0 px-4 sm:px-0">
      <div className="mb-6 sm:mb-8">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-2 text-green-200 font-medium hover:text-green-300 transition-colors mb-4"
        >
          <GoBackIcon />
          <span className="text-sm">Back</span>
        </button>
        <BookingStepper step={step} />
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#101828]">
          {step === 1 && 'Book a call with a mentor'}
          {step === 2 && 'Choose a mentor'}
          {step === 3 && 'Pick a date & time'}
        </h1>
        <p className="text-gray-600 mt-1 text-sm md:text-base">
          {step === 1 && 'Pick what you want to focus on. We will show mentors who cover that area.'}
          {step === 2 && 'Choose a mentor, then continue to pick a date and time.'}
          {step === 3 && selectedMentor && (
            <>
              Pick a day, then a start time. Slots are {SLOT_DURATION_MINUTES} minutes. Gray days have no openings — try another day.
            </>
          )}
        </p>
      </div>

      {step === 1 && (
        <div className="rounded-2xl border border-green-200/60 bg-white shadow-sm p-6 md:p-8">
          <label className="block text-sm font-semibold text-[#344054] mb-2">
            What do you want to talk about?
          </label>
          {topicsLoading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <LoadingIcon width="40" height="40" className="animate-spin text-green-200" />
              <p className="text-sm text-gray-600">Loading topics...</p>
            </div>
          ) : (
            <>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full max-w-md rounded-xl border border-[#D0D5DD] bg-white px-4 py-3 text-[#101828] focus:outline-none focus:ring-2 focus:ring-green-200/50 focus:border-green-200"
              >
                <option value="">Select a topic</option>
                {topicOptions.map((opt: { value: string; label: string }) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {topicOptions.length === 0 && (
                <p className="text-sm text-gray-500 mt-2">Topics are loaded from the server. If the list is empty, the backend may not be configured yet.</p>
              )}
              <div className="mt-8">
                <Button
                  type="button"
                  onClick={handleSeeMentors}
                  disabled={!selectedTopic}
                  className="bg-green-200 text-white px-8 py-3 rounded-xl font-medium disabled:opacity-50"
                >
                  See mentors
                </Button>
              </div>
            </>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-green-200/60 bg-white shadow-sm overflow-hidden">
            <div className="flex flex-col gap-4 border-b border-gray-100 bg-gradient-to-r from-green-50/80 to-white px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Mentorship topic
                </p>
                <p className="mt-1 truncate text-base font-semibold text-[#101828]">
                  {selectedTopicLabel || selectedTopic || '—'}
                </p>
              </div>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setStep(1)}
                className="shrink-0 rounded-xl px-5 py-2.5 text-sm font-medium"
              >
                Change topic
              </Button>
            </div>
            {!mentorsLoading && !mentorsError && apiMentors.length > 0 && (
              <div className="px-4 py-4 sm:px-6">
                <label
                  htmlFor="mentor-search"
                  className="mb-2 block text-sm font-semibold text-[#344054]"
                >
                  Search mentors
                </label>
                <input
                  id="mentor-search"
                  type="search"
                  value={mentorSearch}
                  onChange={(e) => setMentorSearch(e.target.value)}
                  placeholder="Search by name, bio, or keywords…"
                  autoComplete="off"
                  className="w-full rounded-xl border border-[#D0D5DD] bg-white px-4 py-3 text-sm text-[#101828] placeholder:text-gray-400 focus:border-green-200 focus:outline-none focus:ring-2 focus:ring-green-200/50"
                />
              </div>
            )}
          </div>

          {mentorsLoading && (
            <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-gray-100 bg-white py-16 shadow-sm">
              <LoadingIcon width="40" height="40" className="animate-spin text-green-200" />
              <p className="text-sm text-gray-600">Loading mentors for your topic…</p>
            </div>
          )}

          {mentorsError && (
            <div className="rounded-2xl border border-red-200 bg-red-50/90 px-6 py-10 text-center shadow-sm">
              <p className="font-semibold text-red-900">We couldn&apos;t load mentors</p>
              <p className="mt-2 text-sm text-red-800/90">
                Check your connection and try again. If the problem continues, try again later.
              </p>
              <Button
                type="button"
                onClick={() => refetchMentors()}
                className="mt-6 rounded-xl bg-green-200 px-6 py-2.5 text-sm font-medium text-white hover:opacity-95"
              >
                Try again
              </Button>
            </div>
          )}

          {!mentorsLoading && !mentorsError && apiMentors.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50/70 px-6 py-12 text-center">
              <p className="text-base font-semibold text-[#101828]">No mentors for this topic yet</p>
              <p className="mt-2 text-sm text-gray-600">
                Try a different topic or check back soon as new mentors join.
              </p>
              <Button
                type="button"
                onClick={() => setStep(1)}
                className="mt-6 rounded-xl bg-green-200 px-6 py-2.5 text-sm font-medium text-white hover:opacity-95"
              >
                Choose another topic
              </Button>
            </div>
          )}

          {!mentorsLoading &&
            !mentorsError &&
            apiMentors.length > 0 &&
            filteredMentors.length === 0 && (
              <div className="rounded-2xl border border-gray-200 bg-white px-6 py-10 text-center shadow-sm">
                <p className="text-[#101828]">
                  No mentors match &ldquo;{mentorSearch.trim()}&rdquo;
                </p>
                <button
                  type="button"
                  onClick={() => setMentorSearch('')}
                  className="mt-4 text-sm font-medium text-green-200 hover:text-green-300"
                >
                  Clear search
                </button>
              </div>
            )}

          {!mentorsLoading && !mentorsError && filteredMentors.length > 0 && (
            <>
              <p className="text-sm text-gray-600">
                {filteredMentors.length === apiMentors.length
                  ? `${filteredMentors.length} mentor${filteredMentors.length !== 1 ? 's' : ''} available`
                  : `Showing ${filteredMentors.length} of ${apiMentors.length} mentors`}
              </p>
              <div className="grid gap-5 sm:grid-cols-2">
                {filteredMentors.map((mentor: MentorItem) => (
                  <MentorCardView
                    key={mentor.id}
                    mentor={mentor}
                    onBook={() => handleBookMentor(mentor)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {step === 3 && selectedMentor && (
        <div className="max-w-2xl w-full min-w-0">
          <div className="rounded-2xl border border-gray-200/80 bg-white shadow-sm overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <p className="mb-3 text-sm text-gray-600">
                Choose a date first. Days with no openings stay gray and cannot be selected. Then pick a time.
              </p>
              <AvailableDatesOnly
                mentorId={selectedMentor.id}
                selectedDate={selectedDate}
                onSelectDate={(date) => {
                  setSelectedDate(date);
                  setSelectedTime('');
                }}
              />
            </div>

            {selectedDate && (
              <div className="p-4 sm:p-6 border-b border-gray-100">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Time</p>
                {slotsLoading && (
                  <div className="flex items-center gap-3 py-4 text-sm text-gray-600">
                    <LoadingIcon width="24" height="24" className="animate-spin text-green-200" />
                    Loading available times…
                  </div>
                )}
                {slotsError && !slotsLoading && (
                  <p className="text-sm text-red-700">{slotsErrorMessage}</p>
                )}
                {!slotsLoading && !slotsError && slots.length === 0 && (
                  <p className="text-sm text-gray-600">
                    No slots on this date. Choose another day or try again later.
                  </p>
                )}
                {!slotsLoading && !slotsError && slots.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {slots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTime(slot)}
                        className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                          selectedTime === slot
                            ? 'bg-green-200 text-white shadow-sm'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                        }`}
                      >
                        {formatTime(slot)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="p-6 border-b border-gray-100">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Message (optional)</p>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Optional: anything you want your mentor to know before the call."
                rows={3}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-[#101828] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-200/40 focus:border-green-200/60 resize-none"
              />
            </div>

            <div className="p-4 sm:p-6 flex flex-wrap items-center gap-2 sm:gap-3 bg-gray-50/50">
              <Button
                type="button"
                onClick={handleSubmitRequest}
                disabled={!selectedDate || !selectedTime || isSubmitting}
                className="bg-green-200 text-white px-6 py-2.5 rounded-xl text-sm font-medium shadow-sm disabled:opacity-50 hover:opacity-95"
              >
                {isSubmitting ? 'Sending…' : 'Send request'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={handleBack}
                className="px-5 py-2.5 rounded-xl text-sm"
              >
                Back
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
