'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useResendVerifyEmailMutation } from '@/store/auth/auth.api';
import useToastify from '@/hooks/useToastify';
import Link from 'next/link';

interface VerifyEmailProps {
  email: string;
}

export default function ResendEmailVerification({ email }: VerifyEmailProps) {
  const { showToast } = useToastify();
  const [resendVerifyEmail, { isLoading: resending }] = useResendVerifyEmailMutation();

  const [cooldown, setCooldown] = useState(300);
  const cooldownRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (cooldown > 0) {
      cooldownRef.current = setTimeout(() => setCooldown(prev => prev - 1), 1000);
    } else if (cooldownRef.current) {
      clearTimeout(cooldownRef.current);
    }

    return () => {
      if (cooldownRef.current) clearTimeout(cooldownRef.current);
    };
  }, [cooldown]);

  const handleResend = async () => {
    try {
      await resendVerifyEmail({ email }).unwrap();
      setCooldown(300);
      showToast('Verification email resent!', 'success');
    } catch (error: any) {
      showToast(error?.response?.data?.message || error?.message || 'Something went wrong', 'error');
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col flex-1 lg:mx-18 shadow-[1px_4px_40px_0px_#0000000D] rounded-[20px] px-2 md:px-8 py-10 w-full overflow-y-auto no-scrollbar">
      <div className='flex items-center justify-center h-full'>
        <div className="flex flex-col font-lora flex-1 w-full max-w-md mx-auto">
          <div className="mb-4">
            <Image src="/authImages/logo1.png" alt="Fojo Logo" width={60} height={60} className="mx-auto" />
          </div>
          <div className="mb-6">
            <Image src="/authImages/envelope.png" alt="Envelope" width={80} height={80} className="mx-auto" />
          </div>
          <h2 className="text-xl font-semibold mb-2 text-center">Confirm Your Email.</h2>
          <p className="text-gray-600 mb-6 text-sm text-center">
            We&apos;ve sent a confirmation link to your email address. <br />
            Please check your inbox to activate your account.
          </p>

          <p className="text-gray-600 mb-4 text-center">Didn&apos;t get the email?</p>
          <button
            className="bg-black text-white py-2 px-4 rounded mb-4 w-full max-w-[300px] mx-auto disabled:opacity-50"
            onClick={handleResend}
            disabled={resending || cooldown > 0}
          >
            {resending
              ? 'Resending...'
              : cooldown > 0
                ? `Resend in ${formatTime(cooldown)}`
                : 'Resend Email'}
          </button>

          <Link className="text-black text-sm font-lora mx-auto" href="/signin">
            Back To Login
          </Link>
        </div>
      </div>
    </div>
  );
}
