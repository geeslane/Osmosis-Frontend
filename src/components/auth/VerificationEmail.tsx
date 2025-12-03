'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useVerifyEmailMutation } from '@/store/auth/auth.api';
import useToastify from '@/hooks/useToastify';
import { LoadingIcon } from '@/assets/icons';

interface VerifyEmailProps {
  email: string;
  token: string;
}

export default function VerificationEmail({ email, token }: VerifyEmailProps) {
  const router = useRouter();
  const { showToast } = useToastify();
  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();

  useEffect(() => {
    if (!email || !token) return;

    const handleEmailVerification = async () => {
      try {
        const response = await verifyEmail({ email, token }).unwrap();
        router.push('/dashboard');
        showToast(response.message, 'success');
      } catch (error: any) {
        const message = error?.data?.message || 'Verification failed. Please try again.';
        router.push(`/verify-email?email=${encodeURIComponent(email)}`);
        showToast(message, 'error');
      }
    };

    handleEmailVerification();
  }, [email, token, verifyEmail, showToast, router]);

  return (
    <div className="flex flex-col flex-1 lg:mx-18 my-[40px] shadow-[1px_4px_40px_0px_#0000000D] rounded-[20px] px-2 md:px-8 py-10 w-full overflow-y-auto no-scrollbar">
      <div className="flex flex-col font-lora justify-center flex-1 w-full max-w-md mx-auto items-center text-center">
        <h1 className="text-4xl font-lora font-semibold mb-4 text-black-600">
          Verifying your email...
        </h1>
        <p className="text-gray-700 mb-4">Please wait while we confirm your email.</p>

        {isLoading && <LoadingIcon className="w-6 h-6 animate-spin text-black" />}
      </div>
    </div>
  );
}
