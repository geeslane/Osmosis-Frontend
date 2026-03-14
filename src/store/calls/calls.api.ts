import { axiosBaseQuery } from '@/lib/baseApi';
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
      providesTags: ['Calls'],
    }),

    /** Mentee: upcoming calls (for booking eligibility – cannot book if any upcoming). */
    getMenteeUpcomingCalls: builder.query<GetCallsResponse, void>({
      queryFn: async (_arg, _queryApi, _extraOptions, fetchWithBQ) => {
        const result = await fetchWithBQ({
          url: '/teenager/me/calls/upcoming',
          method: 'GET',
        });
        if (!result.error && result.data) {
          const res = result.data as GetCallsResponse | undefined;
          return { data: res ?? { data: [] } };
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
        if (!result.error && result.data) {
          const res = result.data as GetCallsResponse | undefined;
          return { data: res ?? { data: [] } };
        }
        return { data: { data: [] } };
      },
      providesTags: ['Calls'],
    }),
  }),
});

export const {
  useGetCallsQuery,
  useGetMenteeUpcomingCallsQuery,
  useGetMenteePreviousCallsQuery,
} = CallsApi;
