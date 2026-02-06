import {
  AuthResponse,
  DropdownResponse,
  LoginRequest,
  LoginResponse,
  OtpResendRequest,
  OtpResendResponse,
  OtpResponse,
  OtpVerifyRequest,
} from '@/components/types';
import { axiosBaseQuery } from '@/lib/baseApi';
import { createApi } from '@reduxjs/toolkit/query/react';

interface MagicLinkRequest {
  email: string;
  userType: 'ADMIN' | 'TEENAGER' | 'MENTOR';
}

interface MagicLinkVerifyRequest {
  token: string;
  email: string;
}

interface MagicLinkResponse {
  success: boolean;
  message: string;
  data?: {
    message: string;
    data: {
      user: any;
      userType?: 'ADMIN' | 'TEENAGER' | 'MENTOR';
      userId?: string;
      requiresPasswordChange?: boolean;
      token: string;
    };
  };
}

interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

interface RegisterRequest {
  full_name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

interface VerifyEmailPayload {
  email: string;
  token: string;
}

interface ResetPasswordPayload {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

interface ForgetPasswordPayload {
  email: string;
}

export const AuthApi = createApi({
  reducerPath: 'authApi',
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (data) => ({
        url: '/auth/login',
        method: 'POST',
        data,
      }),
    }),
    verifyOtp: builder.mutation<OtpResponse, OtpVerifyRequest>({
      query: (data) => ({
        url: '/auth/otp/verify',
        method: 'POST',
        data,
      }),
    }),
    resendOtp: builder.mutation<OtpResendResponse, OtpResendRequest>({
      query: (data) => ({
        url: '/auth/otp/resend',
        method: 'POST',
        data,
      }),
    }),
    getDropdownByType: builder.query<DropdownResponse, { type: string }>({
      query: ({ type }) => ({
        url: '/dropdowns',
        method: 'GET',
        params: { type },
      }),
    }),
    requestMagicLink: builder.mutation<
      { success: boolean; message: string },
      MagicLinkRequest
    >({
      query: (data) => ({
        url: '/auth/magic-link/request',
        method: 'POST',
        data,
      }),
    }),
    verifyMagicLink: builder.mutation<
      MagicLinkResponse,
      MagicLinkVerifyRequest
    >({
      query: (data) => ({
        url: '/auth/magic-link/verify',
        method: 'POST',
        data,
      }),
    }),
    changePassword: builder.mutation<
      { success: boolean; message: string },
      { id: string; data: ChangePasswordRequest }
    >({
      query: ({ id, data }) => ({
        url: `/auth/change-password/${id}`,
        method: 'POST',
        data,
      }),
    }),
    registerUser: builder.mutation<AuthResponse, RegisterRequest>({
      query: (data) => ({
        url: '/api/register',
        method: 'POST',
        data,
      }),
    }),
    registerTeenager: builder.mutation<AuthResponse, FormData>({
      query: (formData) => ({
        url: '/teenager/signup',
        method: 'POST',
        data: formData,
      }),
    }),
    registerMentor: builder.mutation<AuthResponse, FormData>({
      query: (formData) => {
        return {
          url: '/mentor/signup',
          method: 'POST',
          data: formData,
        };
      },
    }),
    verifyEmail: builder.mutation<AuthResponse, VerifyEmailPayload>({
      query: (data) => ({
        url: '/api/verify-email',
        method: 'POST',
        data,
      }),
    }),
    resendVerifyEmail: builder.mutation<AuthResponse, { email: string }>({
      query: (data) => ({
        url: '/api/verify-email/resend',
        method: 'POST',
        data,
      }),
    }),
    forgetPassword: builder.mutation<AuthResponse, ForgetPasswordPayload>({
      query: (data) => ({
        url: '/api/forgot-password',
        method: 'POST',
        data,
      }),
    }),
    resetPassword: builder.mutation<AuthResponse, ResetPasswordPayload>({
      query: (data) => ({
        url: '/api/reset-password',
        method: 'POST',
        data,
      }),
    }),

    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useRequestMagicLinkMutation,
  useVerifyMagicLinkMutation,
  useChangePasswordMutation,
  useRegisterUserMutation,
  useRegisterTeenagerMutation,
  useRegisterMentorMutation,
  useGetDropdownByTypeQuery,
  useResetPasswordMutation,
  useVerifyEmailMutation,
  useResendVerifyEmailMutation,
  useForgetPasswordMutation,
  useLogoutMutation,
} = AuthApi;
