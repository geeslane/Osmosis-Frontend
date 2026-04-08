import { axiosBaseQuery } from '@/lib/baseApi';
import { createApi } from '@reduxjs/toolkit/query/react';

/** API day keys (GET/PUT /mentor/availability). */
export type WeekdayApiKey =
  | 'SUNDAY'
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY';

export interface TimeBlock {
  start: string;
  end: string;
}

/** UI model: ordered Monday → Sunday (unchanged for existing screens). */
export interface DaySchedule {
  day:
    | 'monday'
    | 'tuesday'
    | 'wednesday'
    | 'thursday'
    | 'friday'
    | 'saturday'
    | 'sunday';
  blocks: TimeBlock[];
}

/** API shape: object keyed by weekday; may be {} if never saved. */
export type WeeklyScheduleApi = Partial<Record<WeekdayApiKey, TimeBlock[]>>;

export interface MentorAvailability {
  weeklySchedule: WeeklyScheduleApi;
  meetingLink?: string | null;
  /** User completed Google OAuth; tokens stored server-side. */
  googleCalendarConnected?: boolean;
  /** Last sync succeeded (optional; may mirror backend). */
  googleCalendarSynced?: boolean;
}

interface MentorAvailabilityResponse {
  success: boolean;
  data?: MentorAvailability;
  message?: string;
}

/** PUT /mentor/availability — only these fields (no googleCalendarSynced in body). */
export type SaveMentorAvailabilityBody = {
  weeklySchedule: WeeklyScheduleApi;
  meetingLink?: string | null;
};

const UI_DAY_TO_API: Record<DaySchedule['day'], WeekdayApiKey> = {
  monday: 'MONDAY',
  tuesday: 'TUESDAY',
  wednesday: 'WEDNESDAY',
  thursday: 'THURSDAY',
  friday: 'FRIDAY',
  saturday: 'SATURDAY',
  sunday: 'SUNDAY',
};

const UI_DAY_ORDER: DaySchedule['day'][] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

/** Full weekly object for PUT (every day present; empty array = no blocks that day). */
export function weeklyScheduleToApi(schedule: DaySchedule[]): WeeklyScheduleApi {
  const out: WeeklyScheduleApi = {};
  for (const d of schedule) {
    out[UI_DAY_TO_API[d.day]] = d.blocks;
  }
  return out;
}

export function weeklyScheduleFromApi(
  api: WeeklyScheduleApi | Record<string, TimeBlock[]> | undefined | null
): DaySchedule[] {
  const raw = api ?? {};
  return UI_DAY_ORDER.map((day) => {
    const key = UI_DAY_TO_API[day];
    const blocks = raw[key];
    return {
      day,
      blocks: Array.isArray(blocks) ? blocks : [],
    };
  });
}

export function hasWeeklyScheduleBlocks(
  w: WeeklyScheduleApi | Record<string, TimeBlock[]> | undefined | null
): boolean {
  if (!w || typeof w !== 'object') return false;
  return Object.values(w).some((blocks) => Array.isArray(blocks) && blocks.length > 0);
}

export interface AvailableSlotsResult {
  slots: string[];
  date?: string;
  duration?: number;
}

function normalizeSlotList(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  if (raw.length === 0) return [];
  if (typeof raw[0] === 'string') return raw as string[];
  return (raw as { start?: string }[])
    .map((s) => s?.start)
    .filter((t): t is string => Boolean(t));
}

export const ScheduleApi = createApi({
  reducerPath: 'scheduleApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['MentorAvailability', 'Calls'],
  endpoints: (builder) => ({
    getMentorAvailability: builder.query<MentorAvailability | null, void>({
      query: () => ({
        url: '/mentor/availability',
        method: 'GET',
      }),
      transformResponse: (response: MentorAvailabilityResponse) =>
        response?.data ?? null,
      providesTags: ['MentorAvailability'],
    }),

    saveMentorAvailability: builder.mutation<
      MentorAvailabilityResponse,
      SaveMentorAvailabilityBody
    >({
      query: (body) => ({
        url: '/mentor/availability',
        method: 'PUT',
        data: body,
      }),
      invalidatesTags: ['MentorAvailability'],
    }),

    /** GET with mentor JWT → OAuth URL; redirect user to connect Google Calendar. */
    getGoogleCalendarAuthUrl: builder.query<{ url: string }, void>({
      query: () => ({
        url: '/mentor/availability/google-calendar/auth-url',
        method: 'GET',
      }),
      transformResponse: (response: {
        success?: boolean;
        data?: { url?: string };
      }): { url: string } => ({
        url: response?.data?.url ?? '',
      }),
    }),

    syncGoogleCalendar: builder.mutation<
      { success: boolean; googleCalendarSynced?: boolean; message?: string },
      void
    >({
      query: () => ({
        url: '/mentor/availability/google-calendar/sync',
        method: 'POST',
      }),
      transformResponse: (response: {
        success?: boolean;
        data?: { googleCalendarSynced?: boolean; message?: string };
      }) => ({
        success: response?.success ?? true,
        googleCalendarSynced: response?.data?.googleCalendarSynced,
        message: response?.data?.message,
      }),
      invalidatesTags: ['MentorAvailability'],
    }),

    /** GET /mentor/:mentorId/available-slots — slots are HH:mm start times (30-min grid). */
    getAvailableSlots: builder.query<
      AvailableSlotsResult,
      { mentorId: string; date: string; duration?: number }
    >({
      query: ({ mentorId, date, duration = 30 }) => ({
        url: `/mentor/${mentorId}/available-slots`,
        method: 'GET',
        params: { date, duration },
      }),
      transformResponse: (response: {
        success?: boolean;
        data?: { slots?: unknown; date?: string; duration?: number };
      }): AvailableSlotsResult => {
        const slots = normalizeSlotList(response?.data?.slots);
        return {
          slots,
          date: response?.data?.date,
          duration: response?.data?.duration,
        };
      },
    }),

    createCallRequest: builder.mutation<
      { success: boolean; message?: string; data?: unknown },
      { mentorId: string; date: string; time: string; message?: string }
    >({
      query: (body) => ({
        url: '/call-requests',
        method: 'POST',
        data: body,
      }),
      transformResponse: (response: { success?: boolean; message?: string }) => ({
        success: response?.success ?? true,
        message: response?.message,
      }),
      invalidatesTags: ['Calls'],
    }),
  }),
});

export const {
  useGetMentorAvailabilityQuery,
  useSaveMentorAvailabilityMutation,
  useLazyGetGoogleCalendarAuthUrlQuery,
  useSyncGoogleCalendarMutation,
  useGetAvailableSlotsQuery,
  useCreateCallRequestMutation,
} = ScheduleApi;
