'use client';

import { EmailIcon, LoadingIcon } from '@/assets/icons';
import Image from 'next/image';
import React, { useState } from 'react';
import InputForm from '@/components/form/InputForm';
import SelectForm from '@/components/form/SelectForm';
import { useRequestMagicLinkMutation } from '@/store/auth/auth.api';
import { useRouter } from 'next/navigation';
import useToastify from '@/hooks/useToastify';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Link from 'next/link';
import { ArrowBackIcon } from '@/assets/icons';

const magicLinkSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  userType: yup
    .string()
    .oneOf(['ADMIN', 'TEENAGER', 'MENTOR'], 'Please select a valid user type')
    .required('User type is required'),
});

type MagicLinkFormInputs = {
  email: string;
  userType: 'ADMIN' | 'TEENAGER' | 'MENTOR';
};

export default function MagicLinkPage() {
  const { showToast } = useToastify();
  const router = useRouter();
  const [requestMagicLink, { isLoading }] = useRequestMagicLinkMutation();
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MagicLinkFormInputs>({
    resolver: yupResolver(magicLinkSchema),
  });

  const onSubmit = async (formData: MagicLinkFormInputs) => {
    try {
      await requestMagicLink({
        email: formData.email,
        userType: formData.userType,
      }).unwrap();
      setSuccess(true);
      showToast(
        'If an account exists with this email, a magic link has been sent. Please check your inbox.',
        'success'
      );
    } catch (error: any) {
      const message =
        error?.data?.message || error?.error || 'Failed to send magic link. Please try again.';
      showToast(message, 'error');
    }
  };

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
        <div className="w-full font-montserrat montserrat">
          <Image
            className="my-[40px] mx-auto md:mx-0"
            src={'/image/logo.png'}
            alt=""
            width={151}
            height={32}
          />
          <div className="flex flex-col mt-6 gap-7">
            <div>
              <h3 className="text-[32px] md:text-[40px] text-center md:text-left text-green-200 font-bold">
                Request Magic Link
              </h3>
              <p className="text-[#37445D] font-medium text-xl text-center md:text-left">
                Enter your email to receive a magic link
              </p>
            </div>

            {success ? (
              <div className="w-full space-y-6">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 font-medium">
                    If an account exists with this email, a magic link has been sent. Please check your inbox and click the link to sign in.
                  </p>
                </div>
                <Link
                  href="/signin"
                  className="flex items-center text-white bg-green-100 justify-center w-full px-4 py-3 text-sm font-medium text-white-100 transition rounded-xl shadow-theme-xs"
                >
                  Back to Sign In
                </Link>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full space-y-6"
              >
                <div className="grid grid-cols-1 gap-5">
                  <div className="sm:col-span-1">
                    <SelectForm
                      label="User Type"
                      name="userType"
                      placeholder="Select your user type"
                      register={register}
                      error={errors.userType}
                      options={[
                        { label: 'Teenager', value: 'TEENAGER' },
                        { label: 'Mentor', value: 'MENTOR' },
                        { label: 'Admin', value: 'ADMIN' },
                      ]}
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <InputForm
                      label="Email"
                      name="email"
                      placeholder="Enter your email"
                      register={register}
                      error={errors.email}
                      type="email"
                      icon={<EmailIcon />}
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
                        'Send Magic Link'
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
