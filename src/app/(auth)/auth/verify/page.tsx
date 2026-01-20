'use client';

import { LoadingIcon } from '@/assets/icons';
import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';
import { useVerifyMagicLinkMutation } from '@/store/auth/auth.api';
import { useRouter, useSearchParams } from 'next/navigation';
import useToastify from '@/hooks/useToastify';
import Link from 'next/link';
import { setSessionCookie } from '@/lib/session';

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [verifyMagicLink] = useVerifyMagicLinkMutation();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const hasVerified = useRef(false);

  useEffect(() => {
    const verifyMagicLinkFlow = async () => {
      // Prevent multiple verifications
      if (hasVerified.current) return;
      
      // Extract token and email from URL
      const token = searchParams.get('token');
      const email = searchParams.get('email');

      console.log('Magic link verification started', { token: token?.substring(0, 20) + '...', email });

      // Validate required parameters
      if (!token || !email) {
        console.error('Missing token or email', { token: !!token, email: !!email });
        setStatus('error');
        setErrorMessage('Invalid magic link. Missing token or email.');
        hasVerified.current = true;
        return;
      }

      try {
        // Call backend API to verify magic link
        const response = await verifyMagicLink({
          token,
          email: decodeURIComponent(email), // Decode URL-encoded email
        }).unwrap();

        console.log('Magic link verification response', response);

        // Handle nested response structure (response.data.data) similar to OTP verification
        const verifyData = response.data?.data || response.data;

        
        if (verifyData?.token) {
          try {
            // Store authentication token
            await setSessionCookie({
              token: verifyData.token,
              role: verifyData.userType || verifyData.user?.role,
            });

            console.log('Session cookie set, redirecting...');
            setStatus('success');
            hasVerified.current = true;

            // Redirect to loading page which will fetch user profile and redirect appropriately
            setTimeout(() => {
              router.replace('/auth/loading');
            }, 1500); // Show success message for 1.5 seconds
          } catch (cookieError) {
            console.error('Session cookie error:', cookieError);
            setStatus('error');
            setErrorMessage('Verification succeeded but failed to save session. Please try again.');
            hasVerified.current = true;
          }
        } else {
          console.error('No token in response', response);
          setStatus('error');
          setErrorMessage('Verification succeeded but no token received. Please try again.');
          hasVerified.current = true;
        }
      } catch (error: any) {
        console.error('Magic link verification error', error);
        let message = 'Failed to verify magic link';
        
        if (error?.data?.message) {
          message = error.data.message;
        } else if (error?.error) {
          message = error.error;
        } else if (error?.message) {
          message = error.message;
        }

        // Provide user-friendly error messages
        if (message.toLowerCase().includes('expired')) {
          message = 'This magic link has expired. Please request a new one.';
        } else if (message.toLowerCase().includes('invalid')) {
          message = 'Invalid magic link. Please check your email again.';
        } else if (message.toLowerCase().includes('mismatch')) {
          message = 'Email mismatch. Please use the email address you registered with.';
        } else if (message.toLowerCase().includes('used') || message.toLowerCase().includes('already')) {
          message = 'This magic link has already been used. Please request a new one.';
        }

        setErrorMessage(message);
        setStatus('error');
        hasVerified.current = true;
      }
    };

    verifyMagicLinkFlow();
  }, [searchParams, verifyMagicLink, router]);

  // Render UI based on status
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
            <LoadingIcon width="40" height="40" className="animate-spin text-green-100" />
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
            <h2 className="text-2xl font-bold text-red-600 mb-2">Verification Failed</h2>
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
