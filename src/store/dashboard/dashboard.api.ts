import {
  GetModuleByIdResponse,
  ModulesResponse,
  type TeenagerModuleProgressItem,
} from '@/components/types';
import { axiosBaseQuery } from '@/lib/baseApi';
import { createApi } from '@reduxjs/toolkit/query/react';
import {
  unwrapProgressList,
  unwrapDeliverableAnswer,
} from '@/utils/teenagerModuleProgress';

export type GetModulesParams = {
  page?: number;
  limit?: number;
  title?: string;
};

export type GetMentorsParams = {
  page?: number;
  limit?: number;
  topic?: string;
  status?: 'ACTIVE' | 'INACTIVE';
};

export type ProgramConfig = {
  startDate: string;
  endDate: string;
  numberOfModules: number;
};

/** Admin / Super Admin home summary. Prefer GET `/admin/dashboard/stats`; see JSDoc on endpoint for contract. */
export type AdminDashboardStats = {
  totalAdmins: number;
  totalMentors: number;
  totalMentees: number;
  totalModules: number;
  totalCalls: number;
  /** Scheduled mentorship calls not yet held (optional). */
  upcomingCalls?: number;
  /** Count of live sessions in `scheduled` status (optional). */
  upcomingLiveSessions?: number;
  totalLiveSessions: number;
  /** Combined pending mentor + mentee application requests (optional). */
  pendingRequests?: number;
};

function emptyAdminDashboardStats(): AdminDashboardStats {
  return {
    totalAdmins: 0,
    totalMentors: 0,
    totalMentees: 0,
    totalModules: 0,
    totalCalls: 0,
    totalLiveSessions: 0,
  };
}

function parsePaginationTotal(res: { data?: unknown }): number {
  const body = res.data;
  if (!body || typeof body !== 'object') return 0;
  const b = body as Record<string, unknown>;
  const pag = b.pagination;
  if (pag && typeof pag === 'object' && 'total' in pag) {
    return Number((pag as { total?: number }).total) || 0;
  }
  return 0;
}

function parseModulesListTotal(res: { data?: unknown }): number {
  const body = res.data;
  if (!body || typeof body !== 'object') return 0;
  const b = body as Record<string, unknown>;
  const inner = b.data;
  if (inner && typeof inner === 'object' && 'total' in inner) {
    return Number((inner as { total?: number }).total) || 0;
  }
  return 0;
}

function parseLiveSessionsListTotal(res: { data?: unknown }): number {
  const body = res.data;
  if (!body || typeof body !== 'object') return 0;
  const b = body as Record<string, unknown>;
  const nested = b.data;
  if (nested && typeof nested === 'object' && 'total' in nested) {
    return Number((nested as { total?: number }).total) || 0;
  }
  if ('total' in b) return Number((b as { total?: number }).total) || 0;
  return 0;
}

function normalizeAdminStatsPayload(raw: unknown): AdminDashboardStats | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  let d: Record<string, unknown> = r;
  if (r.data && typeof r.data === 'object' && !Array.isArray(r.data)) {
    d = r.data as Record<string, unknown>;
    if (d.data && typeof d.data === 'object' && !Array.isArray(d.data)) {
      d = d.data as Record<string, unknown>;
    }
  }
  const num = (k: string, alt?: string) => {
    const v = d[k] ?? (alt ? d[alt] : undefined);
    return v === undefined || v === null ? undefined : Number(v);
  };
  return {
    totalAdmins: num('totalAdmins', 'admins') ?? 0,
    totalMentors: num('totalMentors', 'mentors') ?? 0,
    totalMentees: num('totalMentees', 'mentees') ?? 0,
    totalModules: num('totalModules', 'modules') ?? 0,
    totalCalls: num('totalCalls', 'calls') ?? 0,
    upcomingCalls: num('upcomingCalls'),
    upcomingLiveSessions: num('upcomingLiveSessions'),
    totalLiveSessions: num('totalLiveSessions', 'liveSessions') ?? 0,
    pendingRequests: num('pendingRequests'),
  };
}

export const DashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: [
    'Modules',
    'AllCourses',
    'ProgramConfig',
    'Calls',
    'CallRequests',
    'Notifications',
    'Availability',
    /** Per-teenager module progress (admin/mentor view + cache bust on submit/complete). */
    'TeenagerModuleProgress',
    'AdminDashboardStats',
  ],
  endpoints: (builder) => ({
    modules: builder.query<ModulesResponse, GetModulesParams | void>({
      query: (params) => ({
        url: '/module',
        method: 'GET',
        params,
      }),
      providesTags: ['Modules'],
    }),
    createModule: builder.mutation<void, FormData>({
      query: (formData) => ({
        url: '/module',
        method: 'POST',
        data: formData,
      }),
      invalidatesTags: ['Modules'],
    }),
    updateModule: builder.mutation<void, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/module/${id}`,
        method: 'PATCH',
        data: formData,
      }),
      invalidatesTags: ['Modules'],
    }),
    getModuleById: builder.query<GetModuleByIdResponse, string>({
      query: (id) => ({
        url: `/module/${id}`,
        method: 'GET',
      }),
      providesTags: ['Modules'],
    }),

    /**
     * Module progress for a specific teenager (admin / mentor viewing mentee).
     * Backend: GET /teenager/:teenagerId/modules/progress
     * Returns 404 if not implemented — UI falls back to empty progress.
     */
    getTeenagerModulesProgress: builder.query<TeenagerModuleProgressItem[], string>({
      async queryFn(teenagerId, _api, _extraOptions, fetchWithBQ) {
        const res = await fetchWithBQ({
          url: `/teenager/${teenagerId}/modules/progress`,
          method: 'GET',
        });
        if (res.error) {
          const st = (res.error as { status?: number }).status;
          if (st === 404 || st === 501) return { data: [] };
          return { error: res.error };
        }
        return { data: unwrapProgressList(res.data) };
      },
      providesTags: (result, err, teenagerId) => [
        { type: 'TeenagerModuleProgress', id: teenagerId },
      ],
    }),

    /** Logged-in teenager: existing deliverable text for a module. GET /teenager/me/modules/:moduleId/deliverable */
    getTeenagerMeModuleDeliverable: builder.query<string | undefined, string>({
      async queryFn(moduleId, _api, _extraOptions, fetchWithBQ) {
        const res = await fetchWithBQ({
          url: `/teenager/me/modules/${moduleId}/deliverable`,
          method: 'GET',
        });
        if (res.error) {
          const st = (res.error as { status?: number }).status;
          if (st === 404 || st === 501) return { data: undefined };
          return { error: res.error };
        }
        return { data: unwrapDeliverableAnswer(res.data) };
      },
      providesTags: (result, err, moduleId) => [
        { type: 'TeenagerModuleProgress', id: `me-${moduleId}` },
      ],
    }),

    /** Teenager submits deliverable answers. POST /teenager/me/modules/:moduleId/deliverable */
    submitTeenagerModuleDeliverable: builder.mutation<
      unknown,
      { moduleId: string; answer: string }
    >({
      query: ({ moduleId, answer }) => ({
        url: `/teenager/me/modules/${moduleId}/deliverable`,
        method: 'POST',
        data: { answer },
      }),
      invalidatesTags: ['Modules', 'TeenagerModuleProgress'],
    }),

    /**
     * Teenager sets module completion (list checkbox + detail button).
     * PATCH /teenager/me/modules/:moduleId/complete — body `{ completed: boolean }`.
     * If your API only supports marking complete (no body), add `completed: false` support or a dedicated uncomplete route (see team prompt).
     */
    setTeenagerModuleCompletion: builder.mutation<
      unknown,
      { moduleId: string; completed: boolean }
    >({
      query: ({ moduleId, completed }) => ({
        url: `/teenager/me/modules/${moduleId}/complete`,
        method: 'PATCH',
        data: { completed },
      }),
      invalidatesTags: ['Modules', 'TeenagerModuleProgress'],
    }),

    deleteModule: builder.mutation<void, string>({
      query: (id) => ({
        url: `/module/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Modules'],
    }),

    /**
     * Admin / Super Admin dashboard summary (user counts, calls, modules, live sessions, pending queue).
     * **Primary:** `GET /admin/dashboard/stats` — see `normalizeAdminStatsPayload` for accepted JSON shapes.
     * **Fallback:** If that route returns 404/501, totals are approximated from `limit=1` list responses (may omit fields on partial errors).
     */
    getAdminDashboardStats: builder.query<
      AdminDashboardStats,
      { role?: 'SUPERADMIN' | 'ADMIN' } | void
    >({
      queryFn: async (arg, _api, _extraOptions, fetchWithBQ) => {
        const role =
          arg && typeof arg === 'object' && 'role' in arg
            ? (arg as { role?: 'SUPERADMIN' | 'ADMIN' }).role
            : undefined;

        const primary = await fetchWithBQ({ url: '/admin/dashboard/stats', method: 'GET' });

        if (!primary.error && primary.data) {
          const parsed = normalizeAdminStatsPayload(primary.data);
          if (parsed) return { data: parsed };
        }

        const st =
          primary.error && typeof primary.error === 'object'
            ? (primary.error as { status?: number }).status
            : undefined;
        if (primary.error && st != null && st !== 404 && st !== 501) {
          return { error: primary.error };
        }

        const stats = emptyAdminDashboardStats();
        const results = await Promise.all([
          fetchWithBQ({ url: '/module', method: 'GET', params: { page: 1, limit: 1 } }),
          fetchWithBQ({ url: '/mentor', method: 'GET', params: { page: 1, limit: 1 } }),
          fetchWithBQ({ url: '/teenager', method: 'GET', params: { page: 1, limit: 1 } }),
          fetchWithBQ({ url: '/calls', method: 'GET', params: { page: 1, limit: 1 } }),
          fetchWithBQ({ url: '/mentor/requests', method: 'GET', params: { page: 1, limit: 1 } }),
          fetchWithBQ({ url: '/teenager/requests', method: 'GET', params: { page: 1, limit: 1 } }),
          fetchWithBQ({ url: '/api/live-sessions', method: 'GET', params: { page: 1, limit: 1 } }),
          ...(role === 'SUPERADMIN'
            ? [fetchWithBQ({ url: '/admin', method: 'GET', params: { page: 1, limit: 1 } })]
            : []),
        ]);

        stats.totalModules = parseModulesListTotal(results[0]!);
        stats.totalMentors = parsePaginationTotal(results[1]!);
        stats.totalMentees = parsePaginationTotal(results[2]!);
        stats.totalCalls = parsePaginationTotal(results[3]!);
        const mentorPending = parsePaginationTotal(results[4]!);
        const menteePending = parsePaginationTotal(results[5]!);
        stats.pendingRequests = mentorPending + menteePending;
        stats.totalLiveSessions = parseLiveSessionsListTotal(results[6]!);
        if (role === 'SUPERADMIN' && results[7]) {
          stats.totalAdmins = parsePaginationTotal(results[7]!);
        }

        return { data: stats };
      },
      providesTags: ['AdminDashboardStats'],
    }),

    /** Mentor dashboard: rating (average) and total calls. Backend: GET /mentor/me/stats or derive from calls. */
    getMentorDashboardStats: builder.query<
      { averageRating?: number; totalCalls?: number },
      void
    >({
      queryFn: async (_arg, _queryApi, _extraOptions, fetchWithBQ) => {
        const result = await fetchWithBQ({
          url: '/mentor/me/stats',
          method: 'GET',
        });
        if (!result.error && result.data) {
          const d = result.data as { data?: { averageRating?: number; totalCalls?: number } };
          return {
            data: {
              averageRating: d?.data?.averageRating ?? 0,
              totalCalls: d?.data?.totalCalls ?? 0,
            },
          };
        }
        return { data: { averageRating: 0, totalCalls: 0 } };
      },
    }),

    /** Program schedule: start/end dates and number of modules (admin). */
    getProgramConfig: builder.query<ProgramConfig | null, void>({
      queryFn: async (_arg, _queryApi, _extraOptions, fetchWithBQ) => {
        const result = await fetchWithBQ({ url: '/program/config', method: 'GET' });
        if (result.error && (result.error as { status?: number }).status === 404) {
          return { data: null };
        }
        if (result.error) return { error: result.error };
        const d = result.data as { data?: ProgramConfig };
        return { data: d?.data ?? null };
      },
      providesTags: ['ProgramConfig'],
    }),

    updateProgramConfig: builder.mutation<ProgramConfig, ProgramConfig>({
      query: (body) => ({
        url: '/program/config',
        method: 'PUT',
        data: body,
      }),
      invalidatesTags: ['ProgramConfig', 'Modules'],
    }),

    /** Upload file to Cloudinary. Returns URL for use in editor (e.g. images). */
    uploadFile: builder.mutation<
      { message: string; url: string; publicId: string },
      { formData: FormData; folder?: string; resourceType?: 'image' | 'raw' }
    >({
      query: ({ formData, folder = 'uploads', resourceType = 'image' }) => ({
        url: '/api/upload',
        method: 'POST',
        data: formData,
        params: { folder, resourceType },
      }),
    }),

    // Calls (Mentor)
    mentorUpcomingCalls: builder.query<any, void>({
      query: () => ({
        url: '/mentor/me/calls/upcoming',
        method: 'GET',
      }),
      providesTags: ['Calls'],
    }),
    mentorPreviousCalls: builder.query<any, void>({
      query: () => ({
        url: '/mentor/me/calls/previous',
        method: 'GET',
      }),
      providesTags: ['Calls'],
    }),
    mentorCallRequests: builder.query<any, void>({
      query: () => ({
        url: '/mentor/me/call-requests',
        method: 'GET',
      }),
      providesTags: ['CallRequests'],
    }),
    /** Mentee: pending call requests they submitted (if backend exposes this route). */
    teenagerCallRequests: builder.query<any, void>({
      queryFn: async (_arg, _api, _extraOptions, fetchWithBQ) => {
        const result = await fetchWithBQ({
          url: '/teenager/me/call-requests',
          method: 'GET',
        });
        if (result.error) {
          const st = (result.error as { status?: number }).status;
          if (st === 404 || st === 501) {
            return { data: { data: [] } };
          }
          return { error: result.error };
        }
        return { data: result.data };
      },
      providesTags: ['CallRequests'],
    }),
    acceptCallRequest: builder.mutation<any, string>({
      query: (id) => ({
        url: `/call-requests/${id}/accept`,
        method: 'POST',
      }),
      invalidatesTags: ['CallRequests', 'Calls'],
    }),
    rejectCallRequest: builder.mutation<any, { id: string; reason?: string }>({
      query: ({ id, reason }) => ({
        url: `/call-requests/${id}/reject`,
        method: 'POST',
        data: reason ? { reason } : undefined,
      }),
      invalidatesTags: ['CallRequests', 'Calls'],
    }),
    mentorCallFeedback: builder.mutation<
      any,
      { callId: string; notes?: string; rating?: number; comment?: string }
    >({
      query: ({ callId, ...data }) => ({
        url: `/mentor/me/calls/${callId}/feedback`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: ['Calls'],
    }),

    // Calls (Teenager / mentee)
    teenagerUpcomingCalls: builder.query<any, void>({
      query: () => ({
        url: '/teenager/me/calls/upcoming',
        method: 'GET',
      }),
      providesTags: ['Calls'],
    }),
    teenagerPreviousCalls: builder.query<any, void>({
      query: () => ({
        url: '/teenager/me/calls/previous',
        method: 'GET',
      }),
      providesTags: ['Calls'],
    }),
    teenagerCallFeedback: builder.mutation<
      any,
      { callId: string; rating?: number; comment?: string }
    >({
      query: ({ callId, ...data }) => ({
        url: `/teenager/me/calls/${callId}/feedback`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: ['Calls'],
    }),
    completeTeenagerCall: builder.mutation<any, string>({
      query: (callId) => ({
        url: `/teenager/me/calls/${callId}/complete`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Calls'],
    }),
    cancelTeenagerCall: builder.mutation<any, string>({
      query: (callId) => ({
        url: `/teenager/me/calls/${callId}/cancel`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Calls'],
    }),

    // Notifications
    notifications: builder.query<any, void>({
      query: () => ({
        url: '/me/notifications',
        method: 'GET',
      }),
      providesTags: ['Notifications'],
    }),
    markAllNotificationsRead: builder.mutation<any, void>({
      query: () => ({
        url: '/me/notifications/read-all',
        method: 'PATCH',
      }),
      invalidatesTags: ['Notifications'],
    }),
    markNotificationRead: builder.mutation<any, string>({
      query: (id) => ({
        url: `/me/notifications/${id}/read`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Notifications'],
    }),
    setNotificationReadState: builder.mutation<any, { id: string; read: boolean }>(
      {
        query: ({ id, read }) => ({
          url: `/me/notifications/${id}`,
          method: 'PATCH',
          data: { read },
        }),
        invalidatesTags: ['Notifications'],
      }
    ),

    // Mentor availability + Google Calendar
    mentorAvailability: builder.query<any, void>({
      query: () => ({
        url: '/mentor/availability',
        method: 'GET',
      }),
      providesTags: ['Availability'],
    }),
    updateMentorAvailability: builder.mutation<any, any>({
      query: (data) => ({
        url: '/mentor/availability',
        method: 'PUT',
        data,
      }),
      invalidatesTags: ['Availability'],
    }),
    mentorGoogleCalendarAuthUrl: builder.query<any, void>({
      query: () => ({
        url: '/mentor/availability/google-calendar/auth-url',
        method: 'GET',
      }),
    }),
    mentorGoogleCalendarSync: builder.mutation<any, void>({
      query: () => ({
        url: '/mentor/availability/google-calendar/sync',
        method: 'POST',
      }),
      invalidatesTags: ['Availability'],
    }),

    // Teenager booking flow
    liveSessionTopics: builder.query<any, void>({
      query: () => ({
        url: '/api/live-sessions/topics',
        method: 'GET',
      }),
    }),
    mentorsForBooking: builder.query<any, GetMentorsParams>({
      query: (params) => ({
        url: '/mentor',
        method: 'GET',
        params,
      }),
    }),
    mentorAvailableSlots: builder.query<any, { mentorId: string; date: string }>({
      query: ({ mentorId, date }) => ({
        url: `/mentor/${mentorId}/available-slots`,
        method: 'GET',
        params: { date },
      }),
    }),
    createCallRequest: builder.mutation<
      any,
      {
        mentorId: string;
        date: string;
        time: string;
        message?: string;
        topicLabel?: string | null;
        topicValue?: string | null;
      }
    >({
      query: (data) => ({
        url: '/call-requests',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['CallRequests', 'Calls'],
    }),

    // Admin calls list
    adminCalls: builder.query<any, { page?: number; limit?: number; q?: string } | void>({
      query: (params) => ({
        url: '/calls',
        method: 'GET',
        params,
      }),
      providesTags: ['Calls'],
    }),
  }),
});

export const {
  useModulesQuery,
  useCreateModuleMutation,
  useUpdateModuleMutation,
  useGetModuleByIdQuery,
  useGetTeenagerModulesProgressQuery,
  useGetTeenagerMeModuleDeliverableQuery,
  useSubmitTeenagerModuleDeliverableMutation,
  useSetTeenagerModuleCompletionMutation,
  useDeleteModuleMutation,
  useUploadFileMutation,
  useGetAdminDashboardStatsQuery,
  useGetMentorDashboardStatsQuery,
  useGetProgramConfigQuery,
  useUpdateProgramConfigMutation,
  useMentorUpcomingCallsQuery,
  useMentorPreviousCallsQuery,
  useMentorCallRequestsQuery,
  useTeenagerCallRequestsQuery,
  useAcceptCallRequestMutation,
  useRejectCallRequestMutation,
  useMentorCallFeedbackMutation,
  useTeenagerUpcomingCallsQuery,
  useTeenagerPreviousCallsQuery,
  useTeenagerCallFeedbackMutation,
  useCompleteTeenagerCallMutation,
  useCancelTeenagerCallMutation,
  useNotificationsQuery,
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
  useSetNotificationReadStateMutation,
  useMentorAvailabilityQuery,
  useUpdateMentorAvailabilityMutation,
  useMentorGoogleCalendarAuthUrlQuery,
  useLazyMentorGoogleCalendarAuthUrlQuery,
  useMentorGoogleCalendarSyncMutation,
  useLiveSessionTopicsQuery,
  useMentorsForBookingQuery,
  useMentorAvailableSlotsQuery,
  useCreateCallRequestMutation,
  useAdminCallsQuery,
} = DashboardApi;
