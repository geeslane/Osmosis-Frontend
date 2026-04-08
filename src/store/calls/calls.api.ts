import { axiosBaseQuery } from '@/lib/baseApi';
import { normalizeCallsListPayload } from '@/utils/mapCallApi';
import { createApi } from '@reduxjs/toolkit/query/react';

export interface CallRecord {
  id: string;
  mentorName: string;
  menteeName: string;
  /** Mentee (teenager) user ID – used to fetch full mentee details when name is clicked */
  menteeId?: string;
  date: string;
  time?: string;
  topic: string;
  callLength?: string;
  status: string;
  comment?: string;
  menteeComment?: string;
  rating?: number;
  /** Join URL when backend provides it */
  meetingUrl?: string;
}

export interface GetCallsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface GetCallsResponse {
  data: CallRecord[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export const CallsApi = createApi({
  reducerPath: 'callsApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Calls'],
  endpoints: (builder) => ({
    getCalls: builder.query<GetCallsResponse, GetCallsParams>({
      query: (params) => ({
        url: '/calls',
        method: 'GET',
        params: {
          page: params.page ?? 1,
          limit: params.limit ?? 10,
          ...(params.search && { search: params.search }),
        },
      }),
      transformResponse: (raw: unknown): GetCallsResponse => {
        const rows = normalizeCallsListPayload(raw);
        let pagination: GetCallsResponse['pagination'];
        if (raw && typeof raw === 'object') {
          const o = raw as Record<string, unknown>;
          if (o.pagination && typeof o.pagination === 'object') {
            pagination = o.pagination as GetCallsResponse['pagination'];
          } else if (o.data && typeof o.data === 'object' && !Array.isArray(o.data)) {
            const d = o.data as Record<string, unknown>;
            if (d.pagination && typeof d.pagination === 'object') {
              pagination = d.pagination as GetCallsResponse['pagination'];
            }
          }
        }
        return { data: rows, pagination };
      },
      providesTags: ['Calls'],
    }),

    /** Mentee: upcoming calls (for booking eligibility – cannot book if any upcoming). */
    getMenteeUpcomingCalls: builder.query<GetCallsResponse, void>({
      queryFn: async (_arg, _queryApi, _extraOptions, fetchWithBQ) => {
        const result = await fetchWithBQ({
          url: '/teenager/me/calls/upcoming',
          method: 'GET',
        });
        if (!result.error && result.data !== undefined) {
          const rows = normalizeCallsListPayload(result.data);
          return { data: { data: rows } };
        }
        return { data: { data: [] } };
      },
      providesTags: ['Calls'],
    }),

    /** Mentee: previous calls (for booking eligibility – cannot book if had a call in last 7 days). */
    getMenteePreviousCalls: builder.query<GetCallsResponse, void>({
      queryFn: async (_arg, _queryApi, _extraOptions, fetchWithBQ) => {
        const result = await fetchWithBQ({
          url: '/teenager/me/calls/previous',
          method: 'GET',
          params: { limit: 50 },
        });
        if (!result.error && result.data !== undefined) {
          const rows = normalizeCallsListPayload(result.data);
          return { data: { data: rows } };
        }
        return { data: { data: [] } };
      },
      providesTags: ['Calls'],
    }),

    /** Mentor: upcoming calls */
    getMentorUpcomingCalls: builder.query<GetCallsResponse, void>({
      queryFn: async (_arg, _queryApi, _extraOptions, fetchWithBQ) => {
        const result = await fetchWithBQ({
          url: '/mentor/me/calls/upcoming',
          method: 'GET',
        });
        if (!result.error && result.data !== undefined) {
          const rows = normalizeCallsListPayload(result.data);
          return { data: { data: rows } };
        }
        return { data: { data: [] } };
      },
      providesTags: ['Calls'],
    }),

    /** Mentor: previous calls */
    getMentorPreviousCalls: builder.query<GetCallsResponse, void>({
      queryFn: async (_arg, _queryApi, _extraOptions, fetchWithBQ) => {
        const result = await fetchWithBQ({
          url: '/mentor/me/calls/previous',
          method: 'GET',
          params: { limit: 50 },
        });
        if (!result.error && result.data !== undefined) {
          const rows = normalizeCallsListPayload(result.data);
          return { data: { data: rows } };
        }
        return { data: { data: [] } };
      },
      providesTags: ['Calls'],
    }),

    /** Cancel upcoming call (mentor) */
    cancelMentorCall: builder.mutation<{ success?: boolean; message?: string }, { callId: string }>(
      {
        query: ({ callId }) => ({
          url: `/mentor/me/calls/${callId}/cancel`,
          method: 'PATCH',
        }),
        invalidatesTags: ['Calls'],
      }
    ),

    /** Cancel upcoming call (teenager) */
    cancelTeenagerCall: builder.mutation<
      { success?: boolean; message?: string },
      { callId: string }
    >({
      query: ({ callId }) => ({
        url: `/teenager/me/calls/${callId}/cancel`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Calls'],
    }),
  }),
});

export const {
  useGetCallsQuery,
  useGetMenteeUpcomingCallsQuery,
  useGetMenteePreviousCallsQuery,
  useGetMentorUpcomingCallsQuery,
  useGetMentorPreviousCallsQuery,
  useCancelMentorCallMutation,
  useCancelTeenagerCallMutation,
} = CallsApi;
