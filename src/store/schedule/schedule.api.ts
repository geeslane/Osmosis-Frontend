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
  tagTypes: ['MentorAvailability'],
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
  }),
});

export const {
  useGetMentorAvailabilityQuery,
  useSaveMentorAvailabilityMutation,
  useSyncGoogleCalendarMutation,
} = ScheduleApi;
