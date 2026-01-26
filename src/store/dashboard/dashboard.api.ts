import { DashboardResponse } from '@/components/types';
import { axiosBaseQuery } from '@/lib/baseApi';
import { createApi } from '@reduxjs/toolkit/query/react';

/*  providesTags: (result, error, arg) => [
        { type: 'Course', id: arg.course },
      ],
      invalidatesTags: ['AllCourses'], */

export const DashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Course', 'AllCourses'],
  endpoints: (builder) => ({
    dashboard: builder.query<DashboardResponse, void>({
      query: () => ({
        url: '/api/dashboard',
        method: 'GET',
      }),
    }),
  }),
});

export const { useDashboardQuery } = DashboardApi;
