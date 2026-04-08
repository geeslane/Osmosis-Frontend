import { GetModuleByIdResponse, ModulesResponse } from '@/components/types';
import { axiosBaseQuery } from '@/lib/baseApi';
import { createApi } from '@reduxjs/toolkit/query/react';

export type GetModulesParams = {
  page?: number;
  limit?: number;
  title?: string;
};

export type ProgramConfig = {
  startDate: string;
  endDate: string;
  numberOfModules: number;
};

export const DashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Modules', 'AllCourses', 'ProgramConfig'],
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

    deleteModule: builder.mutation<void, string>({
      query: (id) => ({
        url: `/module/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Modules'],
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
  }),
});

export const {
  useModulesQuery,
  useCreateModuleMutation,
  useUpdateModuleMutation,
  useGetModuleByIdQuery,
  useDeleteModuleMutation,
  useUploadFileMutation,
  useGetMentorDashboardStatsQuery,
  useGetProgramConfigQuery,
  useUpdateProgramConfigMutation,
} = DashboardApi;
