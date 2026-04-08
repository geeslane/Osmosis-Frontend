import { axiosBaseQuery } from '@/lib/baseApi';
import { createApi } from '@reduxjs/toolkit/query/react';

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  read: boolean;
  createdAt: string;
  type?: string;
  link?: string;
}

export interface GetNotificationsResponse {
  data: NotificationItem[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export const NotificationsApi = createApi({
  reducerPath: 'notificationsApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Notifications'],
  endpoints: (builder) => ({
    getNotifications: builder.query<
      GetNotificationsResponse,
      { page?: number; limit?: number; read?: boolean } | void
    >({
      queryFn: async (arg, _queryApi, _extraOptions, fetchWithBQ) => {
        const params = typeof arg === 'object' && arg ? arg : {};
        const queryParams: Record<string, number | boolean | undefined> = {
          page: params.page ?? 1,
          limit: params.limit ?? 20,
        };
        if (params.read !== undefined) queryParams.read = params.read;
        const result = await fetchWithBQ({
          url: '/me/notifications',
          method: 'GET',
          params: queryParams,
        });
        if (result.error && (result.error as { status?: number }).status === 404) {
          return { data: { data: [], pagination: undefined } };
        }
        if (result.error) return { error: result.error };
        const data = result.data as GetNotificationsResponse | undefined;
        return { data: data ?? { data: [] } };
      },
      providesTags: ['Notifications'],
    }),

    markNotificationRead: builder.mutation<void, string>({
      query: (id) => ({
        url: `/me/notifications/${id}`,
        method: 'PATCH',
        data: { read: true },
      }),
      invalidatesTags: ['Notifications'],
    }),

    markNotificationUnread: builder.mutation<void, string>({
      query: (id) => ({
        url: `/me/notifications/${id}`,
        method: 'PATCH',
        data: { read: false },
      }),
      invalidatesTags: ['Notifications'],
    }),

    markAllNotificationsRead: builder.mutation<void, void>({
      query: () => ({
        url: '/me/notifications/read-all',
        method: 'PATCH',
      }),
      invalidatesTags: ['Notifications'],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkNotificationUnreadMutation,
  useMarkAllNotificationsReadMutation,
} = NotificationsApi;
