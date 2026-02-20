'use client';
import { LoadingIcon } from '@/assets/icons';
import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';
import { useVerifyMagicLinkMutation } from '@/store/auth/auth.api';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { setSessionCookie } from '@/lib/session';

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [verifyMagicLink] = useVerifyMagicLinkMutation();
  const [status, setStatus] = useState<
    'verifying' | 'success' | 'error' | 'already_used'
  >('verifying');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const hasVerified = useRef(false);

  useEffect(() => {
    if (hasVerified.current) return;
    hasVerified.current = true;

    const verifyMagicLinkFlow = async () => {
      const token = searchParams.get('token');
      const email = searchParams.get('email');

      if (!token || !email) {
        setStatus('error');
        setErrorMessage('Invalid magic link. Missing token or email.');
        return;
      }

      try {
        const response = await verifyMagicLink({
          token,
          email: decodeURIComponent(email),
        }).unwrap();

        const verifyData = response.data?.data;
        const newToken = response.data?.data?.token;
        console.log('new', newToken);
        if (response.success) {
          await setSessionCookie({
            token: newToken,
            role: verifyData?.userType,
          });

          setStatus('success');

          if (verifyData?.requiresPasswordChange) {
            setTimeout(() => {
              router.replace(
                `/auth/change-password?userType=${verifyData.userType}&userId=${verifyData.userId}`
              );
            }, 1500);
          } else {
            setTimeout(() => {
              router.replace('/auth/loading');
            }, 1500);
          }
        }
      } catch (err: unknown) {
        const message =
          err &&
          typeof err === 'object' &&
          'data' in err &&
          err.data &&
          typeof (err.data as { message?: string }).message === 'string'
            ? (err.data as { message: string }).message
            : err && typeof err === 'object' && 'message' in err && typeof (err as { message: string }).message === 'string'
              ? (err as { message: string }).message
              : 'Failed to verify magic link. The link may be invalid or expired.';
        setErrorMessage(message);
        const isAlreadyUsed =
          /already\s+used|has\s+been\s+used|link\s+used/i.test(message) ||
          (err && typeof err === 'object' && 'status' in err && (err as { status?: number }).status === 401);
        setStatus(isAlreadyUsed ? 'already_used' : 'error');
      }
    };

    verifyMagicLinkFlow();
  }, [searchParams, verifyMagicLink, router]);

  if (status === 'verifying') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-6">
          <Image
            src={'/image/logo.png'}
            alt="Osmosis Logo"
            width={151}
            height={32}
            className="mb-4"
          />
          <div className="flex flex-col items-center gap-4">
            <LoadingIcon
              width="40"
              height="40"
              className="animate-spin text-green-100"
            />
            <p className="text-[#37445D] font-medium text-lg">
              Verifying your magic link...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-6">
          <Image
            src={'/image/logo.png'}
            alt="Osmosis Logo"
            width={151}
            height={32}
            className="mb-4"
          />
          <div className="flex flex-col items-center gap-4">
            <div className="text-green-600 text-5xl mb-4">✓</div>
            <h2 className="text-2xl font-bold text-green-200 mb-2">Success!</h2>
            <p className="text-[#37445D] font-medium text-lg">
              You&apos;ve been successfully signed in. Redirecting...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'already_used') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-6 max-w-md mx-5">
          <Image
            src={'/image/logo.png'}
            alt="Osmosis Logo"
            width={151}
            height={32}
            className="mb-4"
          />
          <div className="flex flex-col items-center gap-4 text-center">
            <h2 className="text-2xl font-bold text-[#282F2E] mb-2">
              This link has already been used or has expired
            </h2>
            <p className="text-[#37445D] font-medium mb-6">
              Request a new link below to sign in.
            </p>
            <Link
              href="/auth/magic-link"
              className="w-full bg-green-100 text-white px-6 py-3 rounded-xl hover:bg-green-200 font-medium text-center transition"
            >
              Generate a new magic link
            </Link>
            <Link
              href="/signin"
              className="text-green-200 hover:text-green-300 font-medium text-sm"
            >
              Go to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-6 max-w-md mx-5">
          <Image
            src={'/image/logo.png'}
            alt="Osmosis Logo"
            width={151}
            height={32}
            className="mb-4"
          />
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="text-red-600 text-5xl mb-4">✗</div>
            <h2 className="text-2xl font-bold text-red-600 mb-2">
              Verification Failed
            </h2>
            <p className="text-[#37445D] font-medium mb-6">{errorMessage}</p>
            <div className="flex flex-col gap-3 w-full">
              <Link
                href="/auth/magic-link"
                className="bg-green-100 text-white px-6 py-3 rounded-xl hover:bg-green-200 font-medium text-center transition"
              >
                Request New Magic Link
              </Link>
              <Link
                href="/signin"
                className="text-green-100 hover:text-green-200 font-medium text-center"
              >
                Go to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
