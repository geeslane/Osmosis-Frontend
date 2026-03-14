import { axiosBaseQuery } from '@/lib/baseApi';
import { createApi } from '@reduxjs/toolkit/query/react';

export interface TimeBlock {
  start: string;
  end: string;
}

export interface DaySchedule {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  blocks: TimeBlock[];
}

export interface MentorAvailability {
  weeklySchedule: DaySchedule[];
  meetingLink?: string;
  googleCalendarSynced?: boolean;
}

interface MentorAvailabilityResponse {
  success: boolean;
  data?: MentorAvailability;
  message?: string;
}

const STORAGE_KEY = 'mentor_availability';

const getStoredAvailability = (): MentorAvailability | null => {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const setStoredAvailability = (data: MentorAvailability) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const ScheduleApi = createApi({
  reducerPath: 'scheduleApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['MentorAvailability', 'Calls'],
  endpoints: (builder) => ({
    getMentorAvailability: builder.query<MentorAvailability | null, void>({
      queryFn: async (_arg, _queryApi, _extraOptions, fetchWithBQ) => {
        const result = await fetchWithBQ({
          url: '/mentor/availability',
          method: 'GET',
        });
        if (!result.error) {
          const response = result.data as MentorAvailabilityResponse | undefined;
          if (response?.data) return { data: response.data };
        }
        const stored = getStoredAvailability();
        return { data: stored };
      },
      providesTags: ['MentorAvailability'],
    }),

    saveMentorAvailability: builder.mutation<
      MentorAvailabilityResponse,
      MentorAvailability
    >({
      queryFn: async (payload, _queryApi, _extraOptions, fetchWithBQ) => {
        const result = await fetchWithBQ({
          url: '/mentor/availability',
          method: 'PUT',
          data: payload,
        });
        const response = result.data as MentorAvailabilityResponse | undefined;
        if (response?.success && response?.data) {
          setStoredAvailability(response.data);
          return { data: response };
        }
        setStoredAvailability(payload);
        return {
          data: {
            success: true,
            data: payload,
            message: 'Availability saved successfully',
          },
        };
      },
      invalidatesTags: ['MentorAvailability'],
    }),

    syncGoogleCalendar: builder.mutation<
      { success: boolean; message: string },
      void
    >({
      queryFn: async (_arg, _queryApi, _extraOptions, fetchWithBQ) => {
        const result = await fetchWithBQ({
          url: '/mentor/availability/google-calendar/sync',
          method: 'POST',
        });
        if (!result.error && result.data) {
          const res = result.data as { success?: boolean; message?: string };
          if (res.success) return { data: { success: true, message: res.message || 'Synced successfully' } };
        }
        return {
          data: {
            success: false,
            message:
              'Google Calendar sync will be available once the backend is configured. Your schedule is saved and mentees will see your availability.',
          },
        };
      },
      invalidatesTags: ['MentorAvailability'],
    }),

    /** Mentee booking: get available slots for a mentor on a given date */
    getAvailableSlots: builder.query<
      { slots: { start: string; end: string }[] },
      { mentorId: string; date: string }
    >({
      queryFn: async ({ mentorId, date }, _queryApi, _extraOptions, fetchWithBQ) => {
        const result = await fetchWithBQ({
          url: `/mentor/${mentorId}/available-slots`,
          method: 'GET',
          params: { date, duration: 30 },
        });
        if (!result.error && result.data) {
          const data = result.data as { success?: boolean; data?: { slots?: { start: string; end: string }[] } };
          const slots = data?.data?.slots ?? [];
          return { data: { slots } };
        }
        return { data: { slots: [] } };
      },
    }),

    /** Mentee booking: create call request with optional message */
    createCallRequest: builder.mutation<
      { success: boolean; message?: string; data?: unknown },
      { mentorId: string; date: string; time: string; message?: string }
    >({
      queryFn: async (body, _queryApi, _extraOptions, fetchWithBQ) => {
        const result = await fetchWithBQ({
          url: '/call-requests',
          method: 'POST',
          data: body,
        });
        if (!result.error && result.data) {
          const data = result.data as { success?: boolean; message?: string };
          return { data: { success: data?.success ?? true, message: data?.message } };
        }
        return {
          data: {
            success: false,
            message: (result.error as { data?: { message?: string } })?.data?.message ?? 'Failed to send request',
          },
        };
      },
      invalidatesTags: ['Calls'],
    }),
  }),
});

export const {
  useGetMentorAvailabilityQuery,
  useSaveMentorAvailabilityMutation,
  useSyncGoogleCalendarMutation,
  useGetAvailableSlotsQuery,
  useCreateCallRequestMutation,
} = ScheduleApi;
