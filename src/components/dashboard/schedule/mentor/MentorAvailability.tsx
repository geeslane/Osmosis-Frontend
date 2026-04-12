'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Button from '@/components/ui/button/Button';
import useToastify from '@/hooks/useToastify';
import {
  useLazyMentorGoogleCalendarAuthUrlQuery,
  useMentorAvailabilityQuery,
  useMentorGoogleCalendarSyncMutation,
  useUpdateMentorAvailabilityMutation,
} from '@/store/dashboard/dashboard.api';

type DayKey =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';

type AvailabilitySlot = {
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
};

type DayAvailability = {
  day: DayKey;
  isAvailable: boolean;
  slots: AvailabilitySlot[];
};

function pickAvailability(raw: any): DayAvailability[] {
  const src =
    raw?.data?.data?.availability ??
    raw?.data?.data ??
    raw?.data ??
    raw?.availability ??
    raw;
  if (!Array.isArray(src)) return [];
  return src;
}

const DAYS: { key: DayKey; label: string }[] = [
  { key: 'MONDAY', label: 'Monday' },
  { key: 'TUESDAY', label: 'Tuesday' },
  { key: 'WEDNESDAY', label: 'Wednesday' },
  { key: 'THURSDAY', label: 'Thursday' },
  { key: 'FRIDAY', label: 'Friday' },
  { key: 'SATURDAY', label: 'Saturday' },
  { key: 'SUNDAY', label: 'Sunday' },
];

function ensureAllDays(days: DayAvailability[]): DayAvailability[] {
  const byDay = new Map(days.map((d) => [d.day, d] as const));
  return DAYS.map(({ key }) => {
    const existing = byDay.get(key);
    return (
      existing ?? {
        day: key,
        isAvailable: false,
        slots: [],
      }
    );
  });
}

export default function MentorAvailability() {
  const { showToast } = useToastify();
  const { data, isLoading, isError } = useMentorAvailabilityQuery();
  const [updateAvailability, { isLoading: isSaving }] =
    useUpdateMentorAvailabilityMutation();
  const [syncCalendar, { isLoading: isSyncing }] =
    useMentorGoogleCalendarSyncMutation();
  const [getAuthUrl, { isFetching: isFetchingAuthUrl }] =
    useLazyMentorGoogleCalendarAuthUrlQuery();

  const initial = useMemo(() => ensureAllDays(pickAvailability(data)), [data]);
  const [meetingLink, setMeetingLink] = useState<string>('');
  const [days, setDays] = useState<DayAvailability[]>(initial);

  useEffect(() => {
    setDays(initial);
    const link =
      data?.data?.data?.meetingLink ??
      data?.data?.meetingLink ??
      data?.meetingLink ??
      '';
    setMeetingLink(link || '');
  }, [initial, data]);

  const addSlot = (day: DayKey) => {
    setDays((prev) =>
      prev.map((d) =>
        d.day === day
          ? {
              ...d,
              isAvailable: true,
              slots: [...(d.slots ?? []), { startTime: '09:00', endTime: '10:00' }],
            }
          : d
      )
    );
  };

  const updateSlot = (
    day: DayKey,
    idx: number,
    patch: Partial<AvailabilitySlot>
  ) => {
    setDays((prev) =>
      prev.map((d) => {
        if (d.day !== day) return d;
        const slots = [...(d.slots ?? [])];
        slots[idx] = { ...slots[idx], ...patch };
        return { ...d, slots };
      })
    );
  };

  const removeSlot = (day: DayKey, idx: number) => {
    setDays((prev) =>
      prev.map((d) => {
        if (d.day !== day) return d;
        const slots = [...(d.slots ?? [])];
        slots.splice(idx, 1);
        return { ...d, slots, isAvailable: slots.length > 0 ? d.isAvailable : false };
      })
    );
  };

  const toggleDay = (day: DayKey, isAvailable: boolean) => {
    setDays((prev) =>
      prev.map((d) =>
        d.day === day
          ? {
              ...d,
              isAvailable,
              slots: isAvailable ? d.slots : [],
            }
          : d
      )
    );
  };

  const handleSave = async () => {
    try {
      const payload = {
        meetingLink: meetingLink || undefined,
        availability: days.map((d) => ({
          day: d.day,
          isAvailable: !!d.isAvailable,
          slots: (d.slots ?? []).filter((s) => s.startTime && s.endTime),
        })),
      };
      await updateAvailability(payload).unwrap();
      showToast('Availability updated', 'success');
    } catch (err: any) {
      showToast(err?.data?.message || 'Failed to update availability', 'error');
    }
  };

  const handleConnectCalendar = async () => {
    try {
      const res: any = await getAuthUrl().unwrap();
      const url =
        res?.data?.data?.authUrl ??
        res?.data?.authUrl ??
        res?.authUrl ??
        res?.data?.url ??
        res?.url;
      if (!url) {
        showToast('No Google auth URL returned', 'error');
        return;
      }
      window.location.href = String(url);
    } catch (err: any) {
      showToast(err?.data?.message || 'Failed to start Google Calendar connect', 'error');
    }
  };

  const handleSyncCalendar = async () => {
    try {
      await syncCalendar().unwrap();
      showToast('Google Calendar sync verified', 'success');
    } catch (err: any) {
      showToast(err?.data?.message || 'Failed to sync Google Calendar', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <label className="text-green-300 font-medium">Meeting link (optional)</label>
        <input
          value={meetingLink}
          onChange={(e) => setMeetingLink(e.target.value)}
          placeholder="https://meet.google.com/... or Zoom link"
          className="w-full max-w-[640px] rounded-lg border border-green-100 px-3 py-2 text-sm focus:outline-none"
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          variant="primary"
          disabled={isFetchingAuthUrl}
          onClick={handleConnectCalendar}
        >
          Connect Google Calendar
        </Button>
        <Button
          variant="secondary"
          disabled={isSyncing}
          onClick={handleSyncCalendar}
        >
          Verify / Sync Calendar
        </Button>
        <Button variant="primary" disabled={isSaving} onClick={handleSave}>
          Save availability
        </Button>
      </div>

      {isError && (
        <p className="text-sm text-red-600">Failed to load availability.</p>
      )}
      {isLoading ? (
        <p className="text-sm text-green-200/70">Loading…</p>
      ) : (
        <div className="space-y-4">
          {days.map((d) => (
            <div
              key={d.day}
              className="rounded-lg border border-[#6CBB0180] p-4 space-y-3"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="font-semibold text-green-200">
                  {DAYS.find((x) => x.key === d.day)?.label ?? d.day}
                </div>
                <label className="flex items-center gap-2 text-sm text-green-200">
                  <input
                    type="checkbox"
                    checked={!!d.isAvailable}
                    onChange={(e) => toggleDay(d.day, e.target.checked)}
                  />
                  Available
                </label>
              </div>

              {d.isAvailable && (
                <div className="space-y-3">
                  {(d.slots ?? []).length === 0 ? (
                    <p className="text-sm text-green-200/70">
                      No time ranges yet. Add one.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {(d.slots ?? []).map((s, idx) => (
                        <div key={idx} className="flex flex-wrap items-center gap-2">
                          <input
                            type="time"
                            value={s.startTime}
                            onChange={(e) =>
                              updateSlot(d.day, idx, { startTime: e.target.value })
                            }
                            className="rounded-md border border-green-100 px-2 py-1 text-sm"
                          />
                          <span className="text-sm text-green-200/70">to</span>
                          <input
                            type="time"
                            value={s.endTime}
                            onChange={(e) =>
                              updateSlot(d.day, idx, { endTime: e.target.value })
                            }
                            className="rounded-md border border-green-100 px-2 py-1 text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => removeSlot(d.day, idx)}
                            className="text-sm font-semibold text-red-600 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => addSlot(d.day)}
                    className="text-sm font-semibold text-green-200 underline hover:no-underline"
                  >
                    Add time range
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

