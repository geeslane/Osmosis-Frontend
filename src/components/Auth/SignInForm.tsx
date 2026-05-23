'use client';
import { EmailIcon, LoadingIcon } from '@/assets/icons';
import Image from 'next/image';
import React, { useRef, useState, useEffect, useMemo } from 'react';
import PasswordInputForm from '../form/PasswordInputForm';
import InputForm from '../form/InputForm';
import { setSessionCookie } from '@/lib/session';
import { useLoginMutation } from '@/store/auth/auth.api';
import { useRouter, useSearchParams } from 'next/navigation';
import useToastify from '@/hooks/useToastify';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/store';
import { ProfileApi } from '@/store/profile/profile.api';
import { clearUser } from '@/store/profile/profile.slice';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { SignInFormSchema } from '@/validation/schema';
import Link from 'next/link';
import {
  appendGoogleCalendarOAuthToPath,
  getSignInMessageForPendingGoogleCalendarOAuth,
  GOOGLE_CALENDAR_COPY,
  GOOGLE_CALENDAR_OAUTH_QUERY_KEYS,
  humanizeGoogleCalendarOAuthReason,
  MENTOR_GOOGLE_CALENDAR_CALLBACK_PATH,
  pickGoogleCalendarOAuthSearchParams,
} from '@/utils/googleCalendarAvailability';

type SigninFormInputs = {
  email: string;
  password: string;
};
export default function SignInForm() {
  const { showToast } = useToastify();
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const redirectPath = searchParams.get('redirect') || '/dashboard';
  const pendingCalendarOAuth = useMemo(() => {
    const fromRedirect =
      getSignInMessageForPendingGoogleCalendarOAuth(redirectPath);
    if (fromRedirect) return fromRedirect;

    const status = searchParams.get('google_calendar');
    if (status === 'error') {
      return {
        type: 'error' as const,
        message: humanizeGoogleCalendarOAuthReason(
          searchParams.get('reason') ??
            searchParams.get('message') ??
            searchParams.get('error')
        ),
      };
    }
    if (status === 'success') {
      return {
        type: 'info' as const,
        message: GOOGLE_CALENDAR_COPY.signInToFinish,
      };
    }
    return null;
  }, [redirectPath, searchParams]);

  const [UserSignIn, { isLoading }] = useLoginMutation();
  const [signupMenuOpen, setSignupMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninFormInputs>({
    resolver: yupResolver(SignInFormSchema),
  });

  /** Legacy URLs: /signin?google_calendar=…&redirect=/mentor/schedule → fold OAuth into redirect only */
  useEffect(() => {
    const status = searchParams.get('google_calendar');
    if (!status || typeof window === 'undefined') return;

    const redirectBase =
      searchParams.get('redirect')?.split('?')[0] ||
      MENTOR_GOOGLE_CALENDAR_CALLBACK_PATH;
    const oauth = pickGoogleCalendarOAuthSearchParams(searchParams);
    const mergedRedirect = appendGoogleCalendarOAuthToPath(redirectBase, oauth);

    const clean = new URL(window.location.href);
    for (const key of GOOGLE_CALENDAR_OAUTH_QUERY_KEYS) {
      clean.searchParams.delete(key);
    }
    clean.searchParams.set('redirect', mergedRedirect);
    window.history.replaceState({}, '', clean.toString());
  }, [searchParams]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setSignupMenuOpen(false);
      }
    };

    if (signupMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [signupMenuOpen]);

  const onSubmit = async (formData: SigninFormInputs) => {
    try {
      const apiData = {
        email: formData.email,
        password: formData.password,
      };
      const response = await UserSignIn(apiData).unwrap();
      const loginData = response.data?.data as
        | {
            sessionId?: string;
            requiresOtp?: boolean;
            requiresPasswordChange?: boolean;
            userType?: 'ADMIN';
            userId?: string;
            token?: string;
          }
        | undefined;
      const responseMessage = response.data?.message;

      if (!loginData) {
        showToast(responseMessage || 'Login failed', 'error');
        return;
      }
      if (loginData.requiresOtp && loginData.sessionId) {
        showToast(
          responseMessage || 'OTP code has been sent to your email',
          'success'
        );
        try {
          const params = new URLSearchParams();
          if (redirectPath && redirectPath !== '/dashboard') {
            params.set('redirect', redirectPath);
          }

          if (
            loginData.requiresPasswordChange &&
            loginData.userId &&
            loginData.userType
          ) {
            params.set('requiresPasswordChange', 'true');
            params.set('userId', loginData.userId);
            params.set('userType', loginData.userType);
          }
          const otpQuery = params.toString();
          router.push(
            otpQuery
              ? `/auth/otp/${loginData.sessionId}?${otpQuery}`
              : `/auth/otp/${loginData.sessionId}`
          );
        } catch (navError) {
          console.error('Navigation error:', navError);
        }
        return;
      }

      if (
        loginData.requiresPasswordChange &&
        loginData.userId &&
        loginData.userType
      ) {
        try {
          router.push(
            `/auth/change-password?userType=${loginData.userType}&userId=${loginData.userId}`
          );
        } catch (navError) {
          console.error('Navigation error:', navError);
        }
        return;
      }

      if (loginData.token && loginData.userType) {
        try {
          dispatch(clearUser());

          await setSessionCookie({
            token: loginData.token,
            role: loginData.userType,
          });
          showToast(responseMessage || 'Login successful', 'success');
          // Prefetch profile so loading page can use cached data and redirect faster
          dispatch(ProfileApi.endpoints.getMe.initiate(undefined));

          try {
            const loadingPath = redirectPath
              ? `/auth/loading?redirect=${encodeURIComponent(redirectPath)}`
              : '/auth/loading';
            router.replace(loadingPath);
          } catch (navError) {
            console.error('Navigation error:', navError);
            const loadingPath = redirectPath
              ? `/auth/loading?redirect=${encodeURIComponent(redirectPath)}`
              : '/auth/loading';
            router.push(loadingPath);
          }
        } catch (cookieError) {
          console.error('Session cookie error:', cookieError);
          showToast('Login successful but failed to save session', 'error');
        }
      } else {
        showToast('Login successful but no token received', 'error');
      }
    } catch (error: any) {
      let message = 'Login failed';

      if (error instanceof Error) {
        message = error.message;
      } else if (error?.data?.message) {
        message = error.data.message;
      } else if (error?.error) {
        message =
          typeof error.error === 'string' ? error.error : 'Login failed';
      } else if (typeof error === 'string') {
        message = error;
      } else if (error?.message) {
        message = error.message;
      }

      showToast(message, 'error');
    }
  };
  return (
    <div className=" w-full  font-montserrat montserrat">
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
            Welcome back!
          </h3>
          <p className="text-[#37445D] font-medium text-xl text-center md:text-left">
            Sign in to continue
          </p>
        </div>
        {pendingCalendarOAuth && (
          <div
            role="alert"
            className={`rounded-xl border px-4 py-3 text-sm leading-relaxed ${
              pendingCalendarOAuth.type === 'error'
                ? 'border-red-200 bg-red-50 text-red-900'
                : 'border-amber-200 bg-amber-50 text-amber-950'
            }`}
          >
            {pendingCalendarOAuth.message}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="w-full  space-y-6">
          <div className="grid grid-cols-1 gap-5 ">
            <div className="sm:col-span-1">
              <InputForm
                label="Email"
                name="email"
                placeholder="Enter your email "
                register={register}
                error={errors.email}
                type="text"
                icon={<EmailIcon />}
              />
            </div>
            <div>
              <PasswordInputForm
                label="Password"
                name="password"
                placeholder="Enter password"
                register={register}
                error={errors.password}
              />
            </div>
            <div className="mt-7">
              <button
                type="submit"
                className={`flex  items-center text-white bg-green-100  justify-center w-full px-4 py-3 text-sm font-medium text-white-100 transition rounded-xl shadow-theme-xs  disabled:opacity-50 disabled:cursor-not-allowed`}
                disabled={isLoading}
              >
                {isLoading ? <LoadingIcon width="20" height="20" /> : 'Sign in'}
              </button>
            </div>
          </div>
        </form>
        <div className="flex relative flex-col gap-3 font-montserrat montserrat text-[#0F1C24] text-[15px] font-bold items-center justify-center">
          <div className="flex items-center">
            <span>Don&apos;t have an account yet? </span>
            <div className="relative inline-block" ref={menuRef}>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setSignupMenuOpen(!signupMenuOpen);
                }}
                className="text-green-100 ml-1 flex items-center gap-1 hover:text-green-200 transition-colors font-bold"
              >
                Sign Up
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${
                    signupMenuOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {signupMenuOpen && (
                <div className="absolute bottom-full -left-20 mb-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-999">
                  <Link
                    href="/teenagers/signup"
                    className="block px-4 py-2 text-sm text-[#0F1C24] hover:bg-green-100 transition-colors font-montserrat montserrat font-bold"
                    onClick={() => setSignupMenuOpen(false)}
                  >
                    Teenager Sign Up
                  </Link>
                  <Link
                    href="/mentor/signup"
                    className="block px-4 py-2 text-sm text-[#0F1C24] hover:bg-green-100 transition-colors font-montserrat montserrat font-bold"
                    onClick={() => setSignupMenuOpen(false)}
                  >
                    Mentor Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
          <div className="text-center">
            <Link
              href="/auth/magic-link"
              className="text-green-100 hover:text-green-200 transition-colors font-bold"
            >
              Teenager? Sign in with Magic Link
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
