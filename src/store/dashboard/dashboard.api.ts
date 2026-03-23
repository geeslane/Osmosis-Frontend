import { GetModuleByIdResponse, ModulesResponse } from '@/components/types';
import { axiosBaseQuery } from '@/lib/baseApi';
import { createApi } from '@reduxjs/toolkit/query/react';

export type GetModulesParams = {
  page?: number;
  limit?: number;
  title?: string;
};

export const DashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Modules', 'AllCourses'],
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
} = DashboardApi;
