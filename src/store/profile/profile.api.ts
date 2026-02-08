import { axiosBaseQuery } from '@/lib/baseApi';
import { createApi } from '@reduxjs/toolkit/query/react';

interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    token?: string;
  };
}

interface MeResponse {
  success: boolean;
  data: {
    message: string;
    data: {
      id: string;
      fullName: string;
      email: string;
      phoneNumber?: string | null;
      address?: string | null;
      pictureUrl?: string | null;
      role: string;
      isPasswordTemporary?: boolean;
      createdAt: string;
      updatedAt: string;
    };
    userType?: string;
  };
  timestamp?: string;
}
interface UpdateProfileRequest {
  full_name: string;
  email: string;
}

interface UpdateProfileResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    full_name: string;
    email: string;
    role: string;
    provider?: string;
    avatar?: string;
  };
}
interface ResetAccountPasswordPayload {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

export const ProfileApi = createApi({
  reducerPath: 'profileApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['profile'],
  endpoints: (builder) => ({
    getMe: builder.query<MeResponse, void>({
      query: () => ({
        url: '/auth/me',
        method: 'GET',
      }),
      providesTags: ['profile'],
      transformResponse: (response: any): MeResponse => {
        // Transform the API response to match the expected format
        if (response?.success && response?.data?.data) {
          const apiData = response.data.data;
          const role = response.data;
          return {
            success: response.success,
            data: {
              message: response.data.message || '',
              userType: response.data.userType,
              data: {
                id: apiData.id,
                fullName: apiData.fullName,
                email: apiData.email,
                role: role.userType,
                pictureUrl: apiData.pictureUrl || null,
                phoneNumber: apiData.phoneNumber || null,
                address: apiData.address || null,
                isPasswordTemporary: apiData.isPasswordTemporary || false,
                createdAt: apiData.createdAt,
                updatedAt: apiData.updatedAt,
              },
            },
            timestamp: response.timestamp,
          };
        }
        return response;
      },
    }),
    updateUserProfileImage: builder.mutation<MeResponse, FormData>({
      query: (formData) => ({
        url: '/api/upload',
        method: 'POST',
        data: formData,
      }),
      invalidatesTags: ['profile'],
    }),
    updateUserProfile: builder.mutation<
      UpdateProfileResponse,
      UpdateProfileRequest
    >({
      query: (data) => ({
        url: '/api/profile/update',
        method: 'PUT',
        data,
      }),
      invalidatesTags: ['profile'],
    }),
    deleteAccount: builder.mutation<
      any,
      { reason: string; deletePassword?: string }
    >({
      query: (data) => ({
        url: 'api/profile',
        method: 'DELETE',
        data,
      }),
    }),
    resetAccountPassword: builder.mutation<
      AuthResponse,
      ResetAccountPasswordPayload
    >({
      query: (data) => ({
        url: 'api/profile/password',
        method: 'PUT',
        data,
      }),
    }),
  }),
});

export const {
  useGetMeQuery,
  useUpdateUserProfileImageMutation,
  useUpdateUserProfileMutation,
  useDeleteAccountMutation,
  useResetAccountPasswordMutation,
} = ProfileApi;
