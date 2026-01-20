'use client';

import { LoadingIcon } from '@/assets/icons';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import PasswordInputForm from '@/components/form/PasswordInputForm';
import {
  useChangePasswordMutation,
} from '@/store/auth/auth.api';
import { useRouter, useSearchParams } from 'next/navigation';
import useToastify from '@/hooks/useToastify';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Link from 'next/link';
import { ArrowBackIcon } from '@/assets/icons';

const passwordSchema = yup.object({
  currentPassword: yup.string().required('Current password is required'),
  newPassword: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(
      /[^A-Za-z0-9]/,
      'Password must contain at least one special character'
    )
    .required('New password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Passwords must match')
    .required('Please confirm your password'),
});

type ChangePasswordFormInputs = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function ChangePasswordPage() {
  const { showToast } = useToastify();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userType, setUserType] = useState<'ADMIN' | 'MENTOR' | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [changePassword, { isLoading }] =
    useChangePasswordMutation();

  useEffect(() => {
    const userTypeParam = searchParams.get('userType') as 'ADMIN' | 'MENTOR';
    const userIdParam = searchParams.get('userId');
    if (userTypeParam && userIdParam) {
      setUserType(userTypeParam);
      setUserId(userIdParam);
    } else {
      showToast('Invalid request. Please login again.', 'error');
    }
  }, [searchParams, showToast]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordFormInputs>({
    resolver: yupResolver(passwordSchema),
  });

  const onSubmit = async (formData: ChangePasswordFormInputs) => {
    if (!userType || !userId) {
      showToast('Invalid request. Please login again.', 'error');
      return;
    }

    try {
      const payload = {
        id: userId,
        data: {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        },
      };

      if (userType === 'ADMIN') {
        await changePassword(payload).unwrap();
      } else if (userType === 'MENTOR') {
        await changePassword(payload).unwrap();
      }

      showToast('Password changed successfully!', 'success');
      const dashboardPath = '/dashboard';
      router.push(dashboardPath);
    } catch (error: any) {
      let message = 'Failed to change password';
      if (error?.data?.message) {
        message = error.data.message;
      } else if (error?.error) {
        message = error.error;
      }

      if (message.includes('current password')) {
        message = 'Current password is incorrect';
      }

      showToast(message, 'error');
    }
  };

  if (!userType || !userId) {
    return null;
  }

  return (
    <div className="mx-5 md:mx-[133px] my-[20px] md:my-[40px]">
      <Link
        href="/signin"
        className="flex mb-5 items-center justify-end font-montserrat montserrat font-medium"
      >
        <ArrowBackIcon className="w-5 h-5" />
        Back to Sign In
      </Link>

      <div className="flex flex-col gap-5 justify-center overflow-y-scroll no-scrollbar max-h-[80%] h-full">
        <div className="w-full font-montserrat montserrat max-w-md mx-auto">
          <Image
            className="my-[40px] mx-auto"
            src={'/image/logo.png'}
            alt=""
            width={151}
            height={32}
          />
          <div className="flex flex-col mt-6 gap-7">
            <div>
              <h3 className="text-[32px] md:text-[40px] text-center text-green-200 font-bold">
                Change Password
              </h3>
              <p className="text-[#37445D] font-medium text-xl text-center">
                Please change your password to continue
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
              <div className="grid grid-cols-1 gap-5">
                <div>
                  <PasswordInputForm
                    label="Current Password"
                    name="currentPassword"
                    placeholder="Enter current password"
                    register={register}
                    error={errors.currentPassword}
                  />
                </div>
                <div>
                  <PasswordInputForm
                    label="New Password"
                    name="newPassword"
                    placeholder="Enter new password"
                    register={register}
                    error={errors.newPassword}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Password must be at least 8 characters and contain uppercase,
                    lowercase, number, and special character
                  </p>
                </div>
                <div>
                  <PasswordInputForm
                    label="Confirm New Password"
                    name="confirmPassword"
                    placeholder="Confirm new password"
                    register={register}
                    error={errors.confirmPassword}
                  />
                </div>
                <div className="mt-7">
                  <button
                    type="submit"
                    className="flex items-center text-white bg-green-100 justify-center w-full px-4 py-3 text-sm font-medium text-white-100 transition rounded-xl shadow-theme-xs disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <LoadingIcon width="20" height="20" />
                    ) : (
                      'Change Password'
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
