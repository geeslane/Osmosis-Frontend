'use client';

import React, { useState, useMemo } from 'react';
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
const BOOKING_START_OFFSET_DAYS = 3;

type MentorItem = {
  id: string;
  name: string;
  bio: string;
  linkedinUrl?: string;
  topics: string | string[];
  image?: string;
};

const DUMMY_MENTORS: MentorItem[] = [
  {
    id: 'dummy-1',
    name: 'Sample Mentor One',
    bio: 'Experienced mentor in career development and leadership. Passionate about helping mentees achieve their goals.',
    linkedinUrl: 'https://linkedin.com/in/sample1',
    topics: 'Career, Leadership',
  },
  {
    id: 'dummy-2',
    name: 'Sample Mentor Two',
    bio: 'Tech industry veteran with focus on software engineering and product management. Available for technical guidance.',
    linkedinUrl: 'https://linkedin.com/in/sample2',
    topics: 'Technology, Product',
  },
  {
    id: 'dummy-3',
    name: 'Sample Mentor Three',
    bio: 'Dedicated to youth mentorship and personal growth. Background in education and coaching.',
    linkedinUrl: 'https://linkedin.com/in/sample3',
    topics: 'Education, Coaching',
  },
];

function getNextDays(count: number, startOffsetDays: number): string[] {
  const result: string[] = [];
  const start = new Date();
  start.setDate(start.getDate() + startOffsetDays);
  start.setHours(0, 0, 0, 0);
  for (let i = 0; i < count; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    result.push(d.toISOString().slice(0, 10));
  }
  return result;
}

function formatTime(s: string): string {
  const [h, m] = s.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m ?? 0).padStart(2, '0')} ${period}`;
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

// ---- MentorAvailabilityStrip: next 7 days availability for a mentor ----
function SlotDayCell({
  mentorId,
  date,
}: {
  mentorId: string;
  date: string;
}) {
  const { data } = useGetAvailableSlotsQuery(
    { mentorId, date },
    { skip: mentorId.startsWith('dummy-') }
  );
  const hasSlots = (data?.slots?.length ?? 0) > 0;
  const dayLabel = useMemo(() => {
    const d = new Date(date + 'Z');
    return d.toLocaleDateString('en-US', { weekday: 'short' });
  }, [date]);
  return (
    <span
      className={`inline-flex items-center justify-center min-w-[2.25rem] rounded-lg px-2 py-1 text-xs font-medium ${
        hasSlots ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
      }`}
      title={hasSlots ? 'Has availability' : 'No slots'}
    >
      {dayLabel}
    </span>
  );
}

function MentorAvailabilityStrip({ mentorId }: { mentorId: string }) {
  const dates = useMemo(() => getNextDays(7, BOOKING_START_OFFSET_DAYS), []);
  return (
    <div className="mt-3 pt-3 border-t border-gray-100">
      <p className="text-xs font-medium text-gray-500 mb-2">Availability (next 7 days)</p>
      <div className="flex flex-wrap gap-1.5">
        {dates.map((date) => (
          <SlotDayCell key={date} mentorId={mentorId} date={date} />
        ))}
      </div>
    </div>
  );
}

// ---- MentorCardView ----
function MentorCardView({
  mentor,
  onBook,
}: {
  mentor: MentorItem;
  onBook: (id: string) => void;
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
          <MentorAvailabilityStrip mentorId={mentor.id} />
          <Button
            type="button"
            className="mt-4 bg-green-200 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:opacity-95 w-full sm:w-auto"
            onClick={() => onBook(mentor.id)}
          >
            Book a call
          </Button>
        </div>
      </div>
    </div>
  );
}

// ---- AvailableDatesOnly: only dates that have slots, next 10 days from +3 ----
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
    { mentorId, date },
    { skip: mentorId.startsWith('dummy-') }
  );
  const hasSlots = (data?.slots?.length ?? 0) > 0;
  if (isLoading || !hasSlots) return null;
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
        selected
          ? 'bg-green-200 text-white shadow-sm'
          : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
      }`}
    >
      {formatDate(date)}
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
    () => getNextDays(DAYS_AHEAD, BOOKING_START_OFFSET_DAYS),
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

  const { data: topicsData, isLoading: topicsLoading } =
    useGetDropdownByTypeQuery({ type: 'mentorship-topics' });
  const topicOptions = topicsData?.data ?? [];

  const { data: mentorsResponse, isLoading: mentorsLoading } =
    useGetMentorsQuery(
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
  const displayMentors =
    apiMentors.length > 0 ? apiMentors : (step === 2 ? DUMMY_MENTORS : []);

  const [createCallRequest, { isLoading: isSubmitting }] =
    useCreateCallRequestMutation();

  const { data: slotsData } = useGetAvailableSlotsQuery(
    {
      mentorId: selectedMentor?.id ?? '',
      date: selectedDate ?? '',
    },
    {
      skip:
        !selectedMentor ||
        !selectedDate ||
        step !== 3 ||
        selectedMentor.id.startsWith('dummy-'),
    }
  );
  const slots = slotsData?.slots ?? [];
  const [selectedTime, setSelectedTime] = useState<string>('');

  const handleBack = () => {
    if (step === 1) {
      router.push('/dashboard/calls/mentee');
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

  const isDummyMentor = selectedMentor?.id.startsWith('dummy-');
  const displaySlots =
    selectedDate && isDummyMentor && slots.length === 0
      ? ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'].map((start) => ({ start, end: start }))
      : slots;

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
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#101828]">
          {step === 1 && 'Book a call with a mentor'}
          {step === 2 && 'Choose a mentor'}
          {step === 3 && 'Pick a date & time'}
        </h1>
        <p className="text-gray-600 mt-1 text-sm md:text-base">
          {step === 1 && 'Choose a mentorship topic to view available mentors.'}
          {step === 2 && 'Mentors who offer this topic. Compare availability and pick one.'}
          {step === 3 && selectedMentor && `Booking with ${selectedMentor.name}. Optional message below.`}
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
          {mentorsLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <LoadingIcon width="40" height="40" className="animate-spin text-green-200" />
              <p className="text-sm text-gray-600">Loading mentors...</p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2">
              {displayMentors.map((mentor: MentorItem) => (
                <MentorCardView
                  key={mentor.id}
                  mentor={mentor}
                  onBook={() => handleBookMentor(mentor)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {step === 3 && selectedMentor && (
        <div className="max-w-2xl w-full min-w-0">
          <div className="rounded-2xl border border-gray-200/80 bg-white shadow-sm overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-100">
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
                <div className="flex flex-wrap gap-2">
                  {displaySlots.map((slot) => (
                    <button
                      key={slot.start}
                      type="button"
                      onClick={() => setSelectedTime(slot.start)}
                      className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        selectedTime === slot.start
                          ? 'bg-green-200 text-white shadow-sm'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      {formatTime(slot.start)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="p-6 border-b border-gray-100">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Message (optional)</p>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What do you want to talk about? Any questions on your mind?"
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
