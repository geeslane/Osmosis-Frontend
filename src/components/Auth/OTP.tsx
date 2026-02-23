'use client';

import { LoadingIcon } from '@/assets/icons';
import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';
import {
  useVerifyOtpMutation,
  useResendOtpMutation,
} from '@/store/auth/auth.api';
import type { AppDispatch } from '@/store';
import { ProfileApi } from '@/store/profile/profile.api';
import { useDispatch } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';
import useToastify from '@/hooks/useToastify';
import Link from 'next/link';
import { ArrowBackIcon } from '@/assets/icons';
import { setSessionCookie } from '@/lib/session';

export default function OtpPage({ sessionId }: { sessionId: string }) {
  const { showToast } = useToastify();
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      if (i < 6) {
        newOtp[i] = pastedData[i];
      }
    }
    setOtp(newOtp);
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionId) {
      showToast('Invalid session. Please login again.', 'error');
      return;
    }

    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      showToast('Please enter the complete 6-digit OTP code', 'error');
      return;
    }

    try {
      const response = await verifyOtp({
        sessionId,
        otpCode,
      }).unwrap();

      const otpData = response.data?.data;

      if (otpData?.token) {
        try {
          await setSessionCookie({
            token: otpData.token,
            role: otpData.userType,
          });

          const userId = otpData.user?.id;

          const userType = otpData.userType;

          if (otpData?.requiresPasswordChange) {
            showToast('OTP verified! Please change your password.', 'success');
            router.replace(
              `/auth/change-password?userType=${userType}&userId=${userId}`
            );
          } else {
            showToast('OTP verified successfully!', 'success');
            // Await getMe so loading page has cached data and redirects immediately
            await dispatch(ProfileApi.endpoints.getMe.initiate(undefined));
            const redirectParam = searchParams.get('redirect');
            const loadingPath = redirectParam
              ? `/auth/loading?redirect=${encodeURIComponent(redirectParam)}`
              : '/auth/loading';
            router.replace(loadingPath);
          }
        } catch (cookieError) {
          console.error('Session cookie error:', cookieError);
          showToast('OTP verified but failed to save session', 'error');
        }
      } else {
        console.error('No token in response:', response);
        showToast('OTP verified but no token received', 'error');
      }
    } catch (error: any) {
      showToast(error || 'OTP verification failed', 'error');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  const handleResend = async () => {
    if (!sessionId) {
      showToast('Invalid session. Please login again.', 'error');
      return;
    }
    try {
      const response = await resendOtp({ sessionId }).unwrap();
      showToast(response?.data?.message, 'success');
      setCountdown(60);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (error: any) {
      const message = error?.message;
      showToast(message, 'error');
    }
  };

  if (!sessionId) {
    return null;
  }

  return (
    <div className="mx-5 md:mx-[133px] flex flex-col h-full pt-20">
      <Link
        href="/signin"
        className="flex mb-5 items-center justify-end font-montserrat montserrat font-medium"
      >
        <ArrowBackIcon className="w-5 h-5" />
        Back to Sign In
      </Link>

      <div className="flex flex-col gap-5 justify-center items-center overflow-y-scroll no-scrollbar max-h-[80%] h-full">
        <div className="w-full font-montserrat montserrat max-w-full md:max-w-none">
          <Image
            className="my-[40px] mx-auto lg:mx-none"
            src={'/image/logo.png'}
            alt=""
            width={151}
            height={32}
          />
          <div className="flex flex-col justify-center   mt-6 gap-7">
            <div className="text-center lg:text-center ">
              <h3 className="text-[32px] md:text-[40px] text-green-200 font-bold">
                Verify Your Account
              </h3>
              <p className="text-[#37445D] font-medium text-xl">
                Enter the 6-digit code sent to your email
              </p>
            </div>

            <form onSubmit={handleSubmit} className="w-full space-y-6">
              <div className="flex justify-center  gap-2 md:gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      if (el) {
                        inputRefs.current[index] = el;
                      }
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className="w-11 h-12 md:w-12 md:h-14 text-center text-2xl font-bold border-2 border-green-300 rounded-lg focus:border-green-100  focus:outline-none transition-all"
                  />
                ))}
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
                    'Verify OTP'
                  )}
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isResending || countdown > 0}
                  className="text-green-100 hover:text-green-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isResending
                    ? 'Sending...'
                    : countdown > 0
                      ? `Resend OTP in ${countdown}s`
                      : 'Resend OTP'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
