'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { CalendarIcon, GoogleIcon, LoadingIcon } from '@/assets/icons';
import Button from '@/components/ui/button/Button';
import useToastify from '@/hooks/useToastify';
import { RootState } from '@/store';
import {
  hasWeeklyScheduleBlocks,
  useGetMentorAvailabilityQuery,
  useLazyGetGoogleCalendarAuthUrlQuery,
  useSaveMentorAvailabilityMutation,
  useSyncGoogleCalendarMutation,
  weeklyScheduleFromApi,
  weeklyScheduleToApi,
  type DaySchedule,
  type TimeBlock,
} from '@/store/schedule/schedule.api';
import {
  useGetMentorByIdQuery,
  useUpdateMentorProfileMutation,
} from '@/store/users/users.api';
import { useGetDropdownByTypeQuery } from '@/store/auth/auth.api';

const DAYS: DaySchedule['day'][] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

const DAY_LABELS: Record<DaySchedule['day'], string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
};

// Generate time options from 6:00 to 22:00 in 30-min increments
const TIME_OPTIONS = (() => {
  const options: string[] = [];
  for (let h = 6; h <= 22; h++) {
    for (let m = 0; m < 60; m += 30) {
      options.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
    }
  }
  return options;
})();

const createEmptySchedule = (): DaySchedule[] =>
  DAYS.map((day) => ({ day, blocks: [] }));

const getDefaultBlock = (): TimeBlock => ({ start: '09:00', end: '17:00' });

/** GET /mentor/:id may return `{ data: mentor }` or `{ data: { data: mentor } }` depending on API envelope. */
function extractMentorRecord(mentorData: { data?: unknown } | undefined): Record<string, unknown> | null {
  const d = mentorData?.data;
  if (!d || typeof d !== 'object') return null;
  const obj = d as Record<string, unknown>;
  const inner = obj.data;
  if (inner != null && typeof inner === 'object' && !Array.isArray(inner)) {
    return inner as Record<string, unknown>;
  }
  return obj;
}

function formatTimeForDisplay(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, '0')} ${period}`;
}

const STEP2_DRAFT_PREFIX = 'mentor-availability-step2-draft:';
const STEP2_DRAFT_MAX_AGE_MS = 24 * 60 * 60 * 1000;

type Step2DraftPayload = {
  meetingLink: string;
  mentorshipTopics: string[];
  savedAt: number;
  /** Wizard step to reopen after OAuth return (step 3 = calendar). */
  resumeStep?: 2 | 3;
};

function step2DraftKey(mentorId: string) {
  return `${STEP2_DRAFT_PREFIX}${mentorId}`;
}

function saveStep2Draft(
  mentorId: string,
  data: Pick<Step2DraftPayload, 'meetingLink' | 'mentorshipTopics'> & {
    resumeStep?: 2 | 3;
  }
) {
  if (!mentorId || typeof window === 'undefined') return;
  const payload: Step2DraftPayload = {
    meetingLink: data.meetingLink,
    mentorshipTopics: data.mentorshipTopics,
    resumeStep: data.resumeStep,
    savedAt: Date.now(),
  };
  try {
    sessionStorage.setItem(step2DraftKey(mentorId), JSON.stringify(payload));
  } catch {
    // ignore quota / private mode
  }
}

function loadStep2Draft(mentorId: string): Step2DraftPayload | null {
  if (!mentorId || typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(step2DraftKey(mentorId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Step2DraftPayload>;
    if (typeof parsed.meetingLink !== 'string' || !Array.isArray(parsed.mentorshipTopics)) {
      return null;
    }
    const savedAt = typeof parsed.savedAt === 'number' ? parsed.savedAt : 0;
    if (Date.now() - savedAt > STEP2_DRAFT_MAX_AGE_MS) {
      sessionStorage.removeItem(step2DraftKey(mentorId));
      return null;
    }
    const resumeStep =
      parsed.resumeStep === 3 || parsed.resumeStep === 2 ? parsed.resumeStep : undefined;
    return {
      meetingLink: parsed.meetingLink,
      mentorshipTopics: parsed.mentorshipTopics.map(String),
      savedAt,
      resumeStep,
    };
  } catch {
    return null;
  }
}

function clearStep2Draft(mentorId: string) {
  if (!mentorId || typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(step2DraftKey(mentorId));
  } catch {
    // ignore
  }
}

export default function MentorAvailabilitySchedule() {
  const { showToast } = useToastify();
  const user = useSelector((state: RootState) => state.profile.user);
  const isMentor = user?.role === 'MENTOR';
  const mentorId = String(user?.id ?? '');

  const { data: availability, isLoading } = useGetMentorAvailabilityQuery();
  const [saveAvailability, { isLoading: isSaving }] =
    useSaveMentorAvailabilityMutation();
  const [fetchGoogleCalendarAuthUrl, { isFetching: isAuthUrlLoading }] =
    useLazyGetGoogleCalendarAuthUrlQuery();
  const [syncGoogleCalendar, { isLoading: isSyncing }] =
    useSyncGoogleCalendarMutation();

  const isGoogleCalendarConnected =
    Boolean(availability?.googleCalendarConnected) ||
    Boolean(availability?.googleCalendarSynced);

  const { data: mentorData, isLoading: isMentorProfileLoading } =
    useGetMentorByIdQuery(mentorId, {
      skip: !isMentor || !mentorId,
    });
  const [updateMentorProfile, { isLoading: isUpdatingProfile }] =
    useUpdateMentorProfileMutation();
  const { data: topicsDropdown } = useGetDropdownByTypeQuery({
    type: 'mentorship-topics',
  });
  const topicOptions = topicsDropdown?.data ?? [];

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isEditing, setIsEditing] = useState(false);
  const [weeklySchedule, setWeeklySchedule] = useState<DaySchedule[]>(
    createEmptySchedule()
  );
  const [meetingLink, setMeetingLink] = useState('');
  const [mentorshipTopics, setMentorshipTopics] = useState<string[]>([]);
  const [topicToAdd, setTopicToAdd] = useState('');
  /** Summary view after the full wizard is done (or server already has link/sync). */
  const [hasFinishedStep2, setHasFinishedStep2] = useState(false);

  const step2DraftRestoredRef = useRef(false);

  useEffect(() => {
    if (availability) {
      setWeeklySchedule(
        hasWeeklyScheduleBlocks(availability.weeklySchedule)
          ? weeklyScheduleFromApi(availability.weeklySchedule)
          : createEmptySchedule()
      );
      setMeetingLink(availability.meetingLink || '');
      if (
        availability.meetingLink?.trim() ||
        availability.googleCalendarSynced ||
        availability.googleCalendarConnected
      ) {
        setHasFinishedStep2(true);
      }

      // Resume at step 2 only when still on weekly step — do not pull users back from step 3
      if (
        hasWeeklyScheduleBlocks(availability.weeklySchedule) &&
        step === 1
      ) {
        setStep(2);
      }
    }
  }, [availability, step]);

  useEffect(() => {
    const mentor = extractMentorRecord(mentorData);
    if (!mentor) return;
    const raw = mentor.mentorshipTopics ?? mentor['mentorship_topics'];
    if (raw != null) {
      setMentorshipTopics(Array.isArray(raw) ? raw.map(String) : [String(raw)]);
    }
  }, [mentorData]);

  /** Restore meeting link + topics after Google OAuth redirect (same tab, sessionStorage). */
  useEffect(() => {
    if (isLoading || !mentorId || step2DraftRestoredRef.current) return;
    if (isMentor && isMentorProfileLoading) return;

    const draft = loadStep2Draft(mentorId);
    if (!draft) return;

    step2DraftRestoredRef.current = true;
    setMeetingLink(draft.meetingLink);
    setMentorshipTopics(draft.mentorshipTopics);
    setStep(draft.resumeStep ?? 2);
  }, [isLoading, mentorId, isMentor, isMentorProfileLoading]);

  const hasAnyBlocks = weeklySchedule.some((d) => d.blocks.length > 0);

  const addTopic = (value: string) => {
    if (value && !mentorshipTopics.includes(value)) {
      setMentorshipTopics((prev) => [...prev, value]);
      setTopicToAdd('');
    }
  };

  const removeTopic = (value: string) => {
    setMentorshipTopics((prev) => prev.filter((t) => t !== value));
  };

  const getTopicLabel = (value: string) =>
    topicOptions.find((o) => o.value === value)?.label ?? value;

  const addBlock = (day: DaySchedule['day']) => {
    setWeeklySchedule((prev) =>
      prev.map((d) =>
        d.day === day
          ? { ...d, blocks: [...d.blocks, getDefaultBlock()] }
          : d
      )
    );
  };

  const removeBlock = (day: DaySchedule['day'], index: number) => {
    setWeeklySchedule((prev) =>
      prev.map((d) =>
        d.day === day
          ? { ...d, blocks: d.blocks.filter((_, i) => i !== index) }
          : d
      )
    );
  };

  const updateBlock = (
    day: DaySchedule['day'],
    index: number,
    field: 'start' | 'end',
    value: string
  ) => {
    setWeeklySchedule((prev) =>
      prev.map((d) => {
        if (d.day !== day) return d;
        const blocks = [...d.blocks];
        blocks[index] = { ...blocks[index], [field]: value };
        return { ...d, blocks };
      })
    );
  };

  const handleSaveStep1 = async () => {
    if (!hasAnyBlocks) {
      showToast('Please add at least one time block', 'error');
      return;
    }
    try {
      await saveAvailability({
        weeklySchedule: weeklyScheduleToApi(weeklySchedule),
        meetingLink: meetingLink.trim() ? meetingLink.trim() : undefined,
      }).unwrap();
      showToast('Schedule saved successfully', 'success');
      setStep(2);
    } catch (err: any) {
      showToast(err?.data?.message || 'Failed to save schedule', 'error');
    }
  };

  const handleSaveStep2 = async () => {
    try {
      await saveAvailability({
        weeklySchedule: weeklyScheduleToApi(weeklySchedule),
        meetingLink: meetingLink.trim() ? meetingLink.trim() : undefined,
      }).unwrap();
      if (isMentor && mentorId && mentorshipTopics.length > 0) {
        await updateMentorProfile({
          id: mentorId,
          data: { mentorshipTopics },
        }).unwrap();
      }
      showToast('Saved. Next: connect Google Calendar (optional).', 'success');
      setStep(3);
    } catch (err: any) {
      showToast(err?.data?.message || 'Failed to save schedule', 'error');
    }
  };

  const handleFinishWizard = () => {
    showToast('Availability setup complete.', 'success');
    setHasFinishedStep2(true);
    setIsEditing(false);
    clearStep2Draft(mentorId);
  };

  const handleConnectGoogleCalendar = async () => {
    try {
      if (mentorId) {
        saveStep2Draft(mentorId, {
          meetingLink,
          mentorshipTopics,
          resumeStep: 3,
        });
      }
      const { url } = await fetchGoogleCalendarAuthUrl().unwrap();
      if (url) {
        window.location.href = url;
        return;
      }
      showToast('Could not start Google Calendar connection.', 'error');
    } catch (err: any) {
      showToast(
        err?.data?.message || 'Failed to get Google Calendar link.',
        'error'
      );
    }
  };

  const handleRefreshGoogleCalendar = async () => {
    try {
      const result = await syncGoogleCalendar().unwrap();
      const msg =
        result.message ||
        (result.googleCalendarSynced
          ? 'Calendar sync updated.'
          : 'Sync completed.');
      if (result.success) {
        showToast(msg, 'success');
      } else {
        showToast(msg, 'info');
      }
    } catch (err: any) {
      showToast(err?.data?.message || 'Failed to sync calendar', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="mt-10 flex items-center justify-center py-12">
        <LoadingIcon height="32" width="32" className="animate-spin text-green-100" />
      </div>
    );
  }

  // View mode: show configured schedule, allow Edit (wizard completed or server has data)
  const isConfigured =
    hasAnyBlocks && availability && hasWeeklyScheduleBlocks(availability.weeklySchedule);
  if (isConfigured && !isEditing && hasFinishedStep2) {
    return (
      <div className="mt-10 max-w-2xl space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-bold text-green-200 md:text-[28px]">
            Your Availability Schedule
          </h2>
          <Button
            variant="primary"
            onClick={() => {
              setIsEditing(true);
              setStep(1);
            }}
          >
            Edit Schedule
          </Button>
        </div>

        <div className="rounded-xl border border-green-200/60 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-base font-semibold text-green-200">
            Weekly Schedule
          </h3>
          <div className="space-y-3">
            {weeklySchedule.map((day) => (
              <div key={day.day} className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <span className="font-medium text-green-300 sm:w-28">
                  {DAY_LABELS[day.day]}
                </span>
                <div className="flex flex-wrap gap-2">
                  {day.blocks.length ? (
                    day.blocks.map((block, i) => (
                      <span
                        key={i}
                        className="rounded-lg bg-green-50 px-3 py-1.5 text-sm font-medium text-green-200"
                      >
                        {formatTimeForDisplay(block.start)} –{' '}
                        {formatTimeForDisplay(block.end)}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-400">Not available</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {availability?.meetingLink && (
          <div className="rounded-xl border border-green-200/60 bg-white p-6 shadow-sm">
            <h3 className="mb-2 text-base font-semibold text-green-200">
              Meeting Link
            </h3>
            <a
              href={availability.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-100 hover:underline"
            >
              {availability.meetingLink}
            </a>
          </div>
        )}

        {isMentor && (
          <div className="rounded-xl border border-green-200/60 bg-white p-6 shadow-sm">
            <h3 className="mb-3 text-base font-semibold text-green-200">
              Topics of interest
            </h3>
            {mentorshipTopics.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {mentorshipTopics.map((value) => (
                  <span
                    key={value}
                    className="rounded-lg bg-green-50 px-3 py-1.5 text-sm font-medium text-green-200"
                  >
                    {topicOptions.find((o) => o.value === value)?.label ?? value}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-600">
                No topics loaded from your profile yet. Open <strong>Edit Schedule</strong>, add topics in step 2 — they are saved with your mentor profile.
              </p>
            )}
          </div>
        )}

        {(availability?.googleCalendarConnected ||
          availability?.googleCalendarSynced) && (
          <div className="flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-200">
            <CalendarIcon />
            <span>
              {availability?.googleCalendarSynced
                ? 'Google Calendar is connected and synced. Busy times are excluded from booking slots.'
                : 'Google Calendar is connected. Busy times will be excluded from booking slots after sync.'}
            </span>
          </div>
        )}
      </div>
    );
  }

  // Step 1: Weekly time blocks
  return (
    <div className="mt-10 max-w-2xl space-y-8">
      <div className="flex flex-wrap items-center gap-2">
        {([1, 2, 3] as const).map((n) => (
          <span
            key={n}
            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
              step === n
                ? 'bg-green-100 text-white'
                : step > n
                  ? 'bg-green-100/30 text-green-200'
                  : 'bg-gray-200 text-gray-500'
            }`}
          >
            {n}
          </span>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-green-200 md:text-[28px]">
        {step === 1 && 'Set Your Weekly Availability'}
        {step === 2 && 'Meeting Link & Topics'}
        {step === 3 && 'Google Calendar'}
      </h2>

      {step === 1 && (
        <>
          <p className="text-green-300">
            Select the time blocks when you&apos;re available for mentoring sessions each day
            of the week.
          </p>

          <div className="space-y-6 rounded-xl border border-green-200/60 bg-white p-6 shadow-sm">
            {weeklySchedule.map((day) => (
              <div key={day.day} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-medium text-green-200">
                    {DAY_LABELS[day.day]}
                  </span>
                  <button
                    type="button"
                    onClick={() => addBlock(day.day)}
                    className="text-sm font-medium text-green-100 hover:text-green-200"
                  >
                    + Add time block
                  </button>
                </div>
                <div className="space-y-2">
                  {day.blocks.map((block, i) => (
                    <div
                      key={i}
                      className="flex flex-wrap items-center gap-2"
                    >
                      <select
                        value={block.start}
                        onChange={(e) =>
                          updateBlock(day.day, i, 'start', e.target.value)
                        }
                        className="rounded-lg border border-green-200/80 bg-white px-3 py-2 text-sm focus:border-green-100 focus:outline-none focus:ring-1 focus:ring-green-100"
                      >
                        {TIME_OPTIONS.map((t) => (
                          <option key={t} value={t}>
                            {formatTimeForDisplay(t)}
                          </option>
                        ))}
                      </select>
                      <span className="text-gray-400">to</span>
                      <select
                        value={block.end}
                        onChange={(e) =>
                          updateBlock(day.day, i, 'end', e.target.value)
                        }
                        className="rounded-lg border border-green-200/80 bg-white px-3 py-2 text-sm focus:border-green-100 focus:outline-none focus:ring-1 focus:ring-green-100"
                      >
                        {TIME_OPTIONS.map((t) => (
                          <option key={t} value={t}>
                            {formatTimeForDisplay(t)}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => removeBlock(day.day, i)}
                        className="text-red-500 hover:text-red-600 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  {day.blocks.length === 0 && (
                    <p className="text-gray-400 text-sm">No blocks added</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <Button
              variant="primary"
              onClick={handleSaveStep1}
              isLoading={isSaving}
              disabled={!hasAnyBlocks}
              className="min-w-[220px] px-8 py-3"
            >
              Save Schedule
            </Button>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <p className="text-green-300">
            Add your meeting link (used for all sessions) and your mentorship topics so mentees
            know what you focus on.
          </p>

          <div className="space-y-6 rounded-xl border border-green-200/60 bg-white p-6 shadow-sm">
            {isMentor && (
              <div>
                <label className="mb-2 block font-medium text-green-300">
                  Topics of Interest
                </label>
                <p className="mb-3 text-sm text-gray-500">
                  Topics you selected during onboarding. Add or remove to update what mentees see.
                </p>
                <div className="mb-3 flex flex-wrap gap-2">
                  {mentorshipTopics.map((value) => (
                    <span
                      key={value}
                      className="inline-flex items-center gap-1 rounded-lg bg-green-50 px-3 py-1.5 text-sm font-medium text-green-200"
                    >
                      {getTopicLabel(value)}
                      <button
                        type="button"
                        onClick={() => removeTopic(value)}
                        className="ml-1 text-gray-400 hover:text-red-500"
                        aria-label="Remove topic"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <select
                  value={topicToAdd}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v) addTopic(v);
                  }}
                  className="rounded-lg border border-green-200/80 bg-white px-3 py-2 text-sm focus:border-green-100 focus:outline-none focus:ring-1 focus:ring-green-100"
                >
                  <option value="">Add a topic</option>
                  {topicOptions
                    .filter((o) => !mentorshipTopics.includes(o.value))
                    .map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                </select>
              </div>
            )}

            <div>
              <label
                htmlFor="meetingLink"
                className="mb-2 block font-medium text-green-300"
              >
                Meeting Link
              </label>
              <input
                id="meetingLink"
                type="url"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                placeholder="https://meet.google.com/xxx-xxxx-xxx or your Zoom/Teams link"
                className="w-full rounded-lg border border-green-200/80 bg-white px-4 py-3 text-sm focus:border-green-100 focus:outline-none focus:ring-1 focus:ring-green-100"
              />
            </div>

            <div className="flex justify-center gap-4 pt-2">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="min-w-[120px] border-green-300 px-6 py-3"
              >
                Back
              </Button>
              <Button
                variant="primary"
                onClick={handleSaveStep2}
                isLoading={isSaving || isUpdatingProfile}
                className="min-w-[180px] px-8 py-3"
              >
                Continue
              </Button>
            </div>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <p className="text-green-300">
            Optionally connect Google Calendar so mentees can&apos;t book sessions when you&apos;re
            already busy. You can skip this and finish — you can connect later from{' '}
            <strong>Edit Schedule</strong>.
          </p>

          <div className="space-y-6 rounded-xl border border-green-200/60 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
              {!isGoogleCalendarConnected ? (
                <Button
                  variant="secondary"
                  onClick={handleConnectGoogleCalendar}
                  isLoading={isAuthUrlLoading}
                  leftIcon={<GoogleIcon />}
                  className="flex items-center gap-2"
                >
                  Connect Google Calendar
                </Button>
              ) : (
                <>
                  <span className="flex items-center gap-2 text-sm font-medium text-green-200">
                    <CalendarIcon />
                    Google Calendar connected
                  </span>
                  <Button
                    variant="secondary"
                    onClick={handleRefreshGoogleCalendar}
                    isLoading={isSyncing}
                    leftIcon={<GoogleIcon />}
                    className="flex items-center gap-2"
                  >
                    Refresh sync
                  </Button>
                  {availability?.googleCalendarSynced && (
                    <span className="text-sm text-gray-500">Last sync OK</span>
                  )}
                </>
              )}
            </div>

            <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row sm:flex-wrap">
              <Button
                variant="outline"
                onClick={() => setStep(2)}
                className="min-w-[120px] border-green-300 px-6 py-3"
              >
                Back
              </Button>
              <Button
                variant="outline"
                onClick={handleFinishWizard}
                className="min-w-[140px] px-6 py-3"
              >
                Skip for now
              </Button>
              <Button
                variant="primary"
                onClick={handleFinishWizard}
                className="min-w-[160px] px-8 py-3"
              >
                Finish
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
