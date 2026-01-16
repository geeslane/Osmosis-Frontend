'use client';
import { EmailIcon, LoadingIcon } from '@/assets/icons';
import Image from 'next/image';
import React, { useRef, useState, useEffect } from 'react';
import PasswordInputForm from '../form/PasswordInputForm';
import InputForm from '../form/InputForm';
import { setSessionCookie } from '@/lib/session';
import { useLoginMutation } from '@/store/auth/auth.api';
import { useRouter, useSearchParams } from 'next/navigation';
import useToastify from '@/hooks/useToastify';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { SignInFormSchema } from '@/validation/schema';
import Link from 'next/link';

type SigninFormInputs = {
  email: string;
  password: string;
};
export default function SignInForm() {
  const { showToast } = useToastify();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/dashboard';
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

  // Close dropdown when clicking outside
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
            userType?: 'ADMIN' | 'MENTOR' | 'TEENAGER';
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
        showToast(responseMessage || 'OTP code has been sent to your email', 'success');
        try {
          router.push(`/auth/otp?sessionId=${loginData.sessionId}`);
        } catch (navError) {
          console.error('Navigation error:', navError);
        }
        return;
      }

      if (loginData.requiresPasswordChange && loginData.userId && loginData.userType) {
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
          await setSessionCookie({
            token: loginData.token,
            role: loginData.userType,
          });
          showToast(responseMessage || 'Login successful', 'success');

          try {
            router.replace(redirectPath || '/auth/loading');
          } catch (navError) {
            console.error('Navigation error:', navError);
            // Fallback to push if replace fails
            router.push(redirectPath || '/auth/loading');
          }
        } catch (cookieError) {
          console.error('Session cookie error:', cookieError);
          showToast('Login successful but failed to save session', 'error');
        }
      } else {
        showToast('Login successful but no token received', 'error');
      }
    } catch (error: any) {
      // Handle different error types
      let message = 'Login failed';
      
      if (error instanceof Error) {
        message = error.message;
      } else if (error?.data?.message) {
        message = error.data.message;
      } else if (error?.error) {
        message = typeof error.error === 'string' ? error.error : 'Login failed';
      } else if (typeof error === 'string') {
        message = error;
      } else if (error?.message) {
        message = error.message;
      }
      
      showToast(message, 'error');
    }
  };
  return (
    <div className=" w-full font-montserrat montserrat">
      <Image className='my-[40px] mx-auto md:mx-0' src={'/image/logo.png'} alt="" width={151} height={32} />
      <div className="flex flex-col mt-6 gap-7">
        <div>
          <h3 className="text-[32px] md:text-[40px] text-center md:text-left text-green-200 font-bold">
            Welcome back!
          </h3>
          <p className="text-[#37445D] font-medium text-xl text-center md:text-left">
            Sign in to continue
          </p>
        </div>
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
        <div className="flex flex-col gap-3 font-montserrat montserrat text-[#0F1C24] text-[15px] font-bold items-center justify-center">
          <div className="flex items-center">
            <span>Don&apos;t have an account yet?{' '}</span>
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
                <div className="absolute bottom-full left-0 mb-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-[9999]">
                  <Link
                    href="/teenagers/signup"
                    className="block px-4 py-2 text-sm text-[#0F1C24] hover:bg-green-50 transition-colors font-montserrat montserrat font-bold"
                    onClick={() => setSignupMenuOpen(false)}
                  >
                    Teenager Sign Up
                  </Link>
                  <Link
                    href="/mentor/signup"
                    className="block px-4 py-2 text-sm text-[#0F1C24] hover:bg-green-50 transition-colors font-montserrat montserrat font-bold"
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
