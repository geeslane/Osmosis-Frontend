import { axiosBaseQuery } from '@/lib/baseApi';
import { createApi } from '@reduxjs/toolkit/query/react';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  data?: {
    message?: string;
    data?: {
      sessionId?: string;
      requiresOtp?: boolean;
      requiresPasswordChange?: boolean;
      userType?: 'ADMIN' | 'MENTOR' | 'TEENAGER';
      userId?: string;
      token?: string;
    };
  };
  message?: string;
  timestamp?: string;
}

interface OtpVerifyRequest {
  sessionId: string;
  otpCode: string;
}

interface OtpResendRequest {
  sessionId: string;
}

interface OtpResponse {
  success: boolean;
  message: string;
  data?: {
    message?: string;
    data?: {
      token: string;
      userType: 'ADMIN' | 'MENTOR' | 'TEENAGER';
      userId: string;
      requiresPasswordChange?: boolean;
      user?: any;
    };
    token?: string;
    userType?: 'ADMIN' | 'MENTOR' | 'TEENAGER';
    userId?: string;
    requiresPasswordChange?: boolean;
  };
}

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

interface TeenagerRegisterRequest {
  teenagerFullName: string;
  teenagerEmail: string;
  teenagerPhoneNumber: string;
  parentFullName: string;
  parentEmail: string;
  parentPhoneNumber: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  hobbies: string;
  class: string;
  picture?: File;
}

interface MentorRegisterRequest {
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  occupation: string;
  linkedinUrl?: string;
  mentorshipTopics: string[];
  inspiration: string;
  bio: string;
  picture?: File;
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

interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    token?: string;
  };
}

interface SocialLoginPayload {
  token: string;
  provider: 'google';
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
    resendOtp: builder.mutation<{ success: boolean; message: string }, OtpResendRequest>({
      query: (data) => ({
        url: '/auth/otp/resend',
        method: 'POST',
        data,
      }),
    }),
    requestMagicLink: builder.mutation<{ success: boolean; message: string }, MagicLinkRequest>({
      query: (data) => ({
        url: '/auth/magic-link/request',
        method: 'POST',
        data,
      }),
    }),
    verifyMagicLink: builder.mutation<MagicLinkResponse, MagicLinkVerifyRequest>({
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
    registerTeenager: builder.mutation<AuthResponse, TeenagerRegisterRequest>({
      query: (data) => {
        const formData = new FormData();
        formData.append('teenagerFullName', data.teenagerFullName);
        formData.append('teenagerEmail', data.teenagerEmail);
        formData.append('teenagerPhoneNumber', data.teenagerPhoneNumber);
        formData.append('parentFullName', data.parentFullName);
        formData.append('parentEmail', data.parentEmail);
        formData.append('parentPhoneNumber', data.parentPhoneNumber);
        formData.append('dateOfBirth', data.dateOfBirth);
        formData.append('gender', data.gender);
        formData.append('address', data.address);
        formData.append('hobbies', data.hobbies);
        formData.append('class', data.class);
        if (data.picture) {
          formData.append('picture', data.picture);
        }

        return {
          url: '/teenager/signup',
          method: 'POST',
          data: formData,
        };
      },
    }),
    registerMentor: builder.mutation<AuthResponse, MentorRegisterRequest>({
      query: (data) => {
        const formData = new FormData();
        formData.append('fullName', data.fullName);
        formData.append('email', data.email);
        formData.append('phoneNumber', data.phoneNumber);
        formData.append('dateOfBirth', data.dateOfBirth);
        formData.append('gender', data.gender);
        formData.append('address', data.address);
        formData.append('occupation', data.occupation);
        data.mentorshipTopics.forEach((topic) => {
          formData.append('mentorshipTopics', topic);
        });
        formData.append('inspiration', data.inspiration);
        formData.append('bio', data.bio);
        if (data.linkedinUrl) {
          formData.append('linkedinUrl', data.linkedinUrl);
        }
        if (data.picture) {
          formData.append('picture', data.picture);
        }

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
    socialLogin: builder.mutation<
      AuthResponse,
      SocialLoginPayload & { full_name: string; email: string; avatar: string }
    >({
      query: ({ provider, ...body }) => ({
        url: `/api/auth/social/${provider}`,
        method: 'POST',
        data: {
          provider,
          ...body,
        },
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
  useResetPasswordMutation,
  useVerifyEmailMutation,
  useResendVerifyEmailMutation,
  useForgetPasswordMutation,
  useSocialLoginMutation,
  useLogoutMutation,
} = AuthApi;
