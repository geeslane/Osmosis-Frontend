import { axiosBaseQuery } from '@/lib/baseApi';
import { createApi } from '@reduxjs/toolkit/query/react';

interface PaginationParams {
  page?: number;
  limit?: number;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
}

interface AdminResponse {
  success: boolean;
  message?: string;
  data?: any;
  page?: number;
  limit?: number;
  total?: number;
}

/* interface CreateAdminRequest {
  fullName: string;
  email: string;
  phoneNumber?: string;
  address?: string;
} */

interface UpdateAdminProfileRequest {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  picture?: File;
}

interface UpdateRequestStatusRequest {
  status: 'APPROVED' | 'REJECTED';
  reasonForRejection?: string; // Required if status is REJECTED
}

interface UpdateMentorStatusRequest {
  id: string;
  formData: FormData;
}

interface UpdateTeenagerStatusRequest {
  status: 'ACTIVE' | 'INACTIVE' | 'DEACTIVATED';
}

interface UpdateMentorProfileRequest {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: string;
  occupation?: string;
  linkedinUrl?: string;
  mentorshipTopics?: string[];
  inspiration?: string;
  bio?: string;
  picture?: File;
}

interface UpdateTeenagerProfileRequest {
  teenagerFullName?: string;
  teenagerEmail?: string;
  teenagerPhoneNumber?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: string;
  class?: string;
  hobbies?: string;
  parentFullName?: string;
  parentEmail?: string;
  parentPhoneNumber?: string;
  picture?: File;
}

export const UsersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Admin', 'Mentor', 'Teenager', 'MentorRequest', 'TeenagerRequest'],
  endpoints: (builder) => ({
    createAdmin: builder.mutation<AdminResponse, FormData>({
      query: (formData) => {
        return {
          url: '/admin',
          method: 'POST',
          data: formData,
        };
      },
      invalidatesTags: ['Admin'],
    }),
    getAdminById: builder.query<AdminResponse, string>({
      query: (id) => ({
        url: `/admin/${id}`,
        method: 'GET',
      }),
      providesTags: ['Admin'],
    }),
    updateMentorStatus: builder.mutation<
      AdminResponse,
      UpdateMentorStatusRequest
    >({
      query: ({ id, formData }) => ({
        url: `/mentor/${id}/status`,
        method: 'PATCH',
        data: formData,
      }),
      invalidatesTags: ['Mentor'],
    }),

    /*Need to be worked on */
    getAdmins: builder.query<AdminResponse, PaginationParams>({
      query: (params) => ({
        url: '/admin',
        method: 'GET',
        params,
      }),
      providesTags: ['Admin'],
    }),
    updateAdminProfile: builder.mutation<
      AdminResponse,
      { id: string; data: UpdateAdminProfileRequest }
    >({
      query: ({ id, data }) => {
        const formData = new FormData();
        if (data.fullName) formData.append('fullName', data.fullName);
        if (data.email) formData.append('email', data.email);
        if (data.phoneNumber) formData.append('phoneNumber', data.phoneNumber);
        if (data.address) formData.append('address', data.address);
        if (data.picture) formData.append('picture', data.picture);

        return {
          url: `/admin/${id}/profile`,
          method: 'PUT',
          data: formData,
        };
      },
      invalidatesTags: (result, error, { id }) => [{ type: 'Admin', id }],
    }),

    // Mentor endpoints
    getMentorRequests: builder.query<AdminResponse, PaginationParams>({
      query: (params) => ({
        url: '/mentor/requests',
        method: 'GET',
        params,
      }),
      providesTags: ['MentorRequest'],
    }),
    updateMentorRequestStatus: builder.mutation<
      AdminResponse,
      { id: string; data: UpdateRequestStatusRequest }
    >({
      query: ({ id, data }) => ({
        url: `/mentor/request/${id}/status`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: (result, error, { data: requestData }) => {
        if (requestData.status === 'APPROVED') {
          return ['MentorRequest', 'Mentor'];
        }
        return ['MentorRequest'];
      },
    }),
    getMentors: builder.query<AdminResponse, PaginationParams>({
      query: (params) => ({
        url: '/mentor',
        method: 'GET',
        params,
      }),
      providesTags: ['Mentor'],
    }),

    getMentorById: builder.query<AdminResponse, string>({
      query: (id) => ({
        url: `/mentor/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Mentor', id }],
    }),
    updateMentorProfile: builder.mutation<
      AdminResponse,
      { id: string; data: UpdateMentorProfileRequest }
    >({
      query: ({ id, data }) => {
        const formData = new FormData();
        if (data.fullName) formData.append('fullName', data.fullName);
        if (data.email) formData.append('email', data.email);
        if (data.phoneNumber) formData.append('phoneNumber', data.phoneNumber);
        if (data.address) formData.append('address', data.address);
        if (data.dateOfBirth) formData.append('dateOfBirth', data.dateOfBirth);
        if (data.gender) formData.append('gender', data.gender);
        if (data.occupation) formData.append('occupation', data.occupation);
        if (data.linkedinUrl) formData.append('linkedinUrl', data.linkedinUrl);
        if (data.mentorshipTopics) {
          data.mentorshipTopics.forEach((topic) => {
            formData.append('mentorshipTopics', topic);
          });
        }
        if (data.inspiration) formData.append('inspiration', data.inspiration);
        if (data.bio) formData.append('bio', data.bio);
        if (data.picture) formData.append('picture', data.picture);

        return {
          url: `/mentor/${id}/profile`,
          method: 'PUT',
          data: formData,
        };
      },
      invalidatesTags: (result, error, { id }) => [{ type: 'Mentor', id }],
    }),

    // Teenager endpoints
    getTeenagerRequests: builder.query<AdminResponse, PaginationParams>({
      query: (params) => ({
        url: '/teenager/requests',
        method: 'GET',
        params,
      }),
      providesTags: ['TeenagerRequest'],
    }),
    updateTeenagerRequestStatus: builder.mutation<
      AdminResponse,
      { id: string; data: UpdateRequestStatusRequest }
    >({
      query: ({ id, data }) => ({
        url: `/teenager/request/${id}/status`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: (result, error, { data: requestData }) => {
        // If approved, also invalidate Teenager list since they're now a user
        if (requestData.status === 'APPROVED') {
          return ['TeenagerRequest', 'Teenager'];
        }
        return ['TeenagerRequest'];
      },
    }),
    getTeenagers: builder.query<AdminResponse, PaginationParams>({
      query: (params) => ({
        url: '/teenager',
        method: 'GET',
        params,
      }),
      providesTags: ['Teenager'],
    }),
    updateTeenagerStatus: builder.mutation<
      AdminResponse,
      { id: string; data: UpdateTeenagerStatusRequest }
    >({
      query: ({ id, data }) => ({
        url: `/teenager/${id}/status`,
        method: 'PUT',
        data,
      }),
      invalidatesTags: ['Teenager'],
    }),
    getTeenagerById: builder.query<AdminResponse, string>({
      query: (id) => ({
        url: `/teenager/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Teenager', id }],
    }),
    updateTeenagerProfile: builder.mutation<
      AdminResponse,
      { id: string; data: UpdateTeenagerProfileRequest }
    >({
      query: ({ id, data }) => {
        const formData = new FormData();
        if (data.teenagerFullName)
          formData.append('teenagerFullName', data.teenagerFullName);
        if (data.teenagerEmail)
          formData.append('teenagerEmail', data.teenagerEmail);
        if (data.teenagerPhoneNumber)
          formData.append('teenagerPhoneNumber', data.teenagerPhoneNumber);
        if (data.address) formData.append('address', data.address);
        if (data.dateOfBirth) formData.append('dateOfBirth', data.dateOfBirth);
        if (data.gender) formData.append('gender', data.gender);
        if (data.class) formData.append('class', data.class);
        if (data.hobbies) formData.append('hobbies', data.hobbies);
        if (data.parentFullName)
          formData.append('parentFullName', data.parentFullName);
        if (data.parentEmail) formData.append('parentEmail', data.parentEmail);
        if (data.parentPhoneNumber)
          formData.append('parentPhoneNumber', data.parentPhoneNumber);
        if (data.picture) formData.append('picture', data.picture);

        return {
          url: `/teenager/${id}/profile`,
          method: 'PUT',
          data: formData,
        };
      },
      invalidatesTags: (result, error, { id }) => [{ type: 'Teenager', id }],
    }),
  }),
});

export const {
  useCreateAdminMutation,
  useGetAdminsQuery,
  useGetAdminByIdQuery,
  useUpdateAdminProfileMutation,
  useGetMentorRequestsQuery,
  useUpdateMentorRequestStatusMutation,
  useGetMentorsQuery,
  useUpdateMentorStatusMutation,
  useGetMentorByIdQuery,
  useUpdateMentorProfileMutation,
  useGetTeenagerRequestsQuery,
  useUpdateTeenagerRequestStatusMutation,
  useGetTeenagersQuery,
  useUpdateTeenagerStatusMutation,
  useGetTeenagerByIdQuery,
  useUpdateTeenagerProfileMutation,
} = UsersApi;
