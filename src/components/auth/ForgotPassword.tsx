'use client';
import { useState, useEffect, useRef } from 'react';
import InputForm from '../form/InputForm';
import Label from '../form/Label';
import { useForgetPasswordMutation } from '@/store/auth/auth.api';
import { useForm } from 'react-hook-form';
import { ForgetPassordFormSchema } from '@/validation/schema';
import { yupResolver } from '@hookform/resolvers/yup';
import Link from 'next/link';
import { LoadingIcon } from '@/assets/icons';
import AlertMessage from '../common/AlertMessage';

type ForgotPasswordFormInputs = {
  email: string;
};

export default function ForgetPassword() {
  const [forgetUser, { isLoading }] = useForgetPasswordMutation();
  const [cooldown, setCooldown] = useState(0);
  const cooldownRef = useRef<NodeJS.Timeout | null>(null);
  const [alert, setAlert] = useState<{
    type: 'success' | 'error';
    message: string;
    id?: number;
  } | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ForgotPasswordFormInputs>({
    resolver: yupResolver(ForgetPassordFormSchema),
  });

  // Removed hydration and cooldown restore from localStorage
  // useEffect(() => {
  //   const cooldownEnd = localStorage.getItem('forgetPasswordCooldownEnd');
  //   if (cooldownEnd) {
  //     const end = parseInt(cooldownEnd, 10);
  //     const now = Math.floor(Date.now() / 1000);
  //     const remaining = end - now;
  //     if (remaining > 0) {
  //       setCooldown(remaining);
  //     } else {
  //       localStorage.removeItem('forgetPasswordCooldownEnd');
  //     }
  //   }
  // }, []);

  useEffect(() => {
    if (cooldown === 0) return;

    cooldownRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(cooldownRef.current!);
          // localStorage.removeItem('forgetPasswordCooldownEnd');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
  }, [cooldown]);

  const showAlert = (alertObj: {
    type: 'success' | 'error';
    message: string;
  }) => {
    setAlert({ ...alertObj, id: Date.now() });
  };

  const onSubmit = async (formData: ForgotPasswordFormInputs) => {
    try {
      const response = await forgetUser({ email: formData.email }).unwrap();

      showAlert({
        type: 'success',
        message:
          response.message ||
          'Please check your email, a reset link has been sent.',
      });

      const cooldownSeconds = 300;
      // const cooldownEnd = Math.floor(Date.now() / 1000) + cooldownSeconds;
      // localStorage.setItem('forgetPasswordCooldownEnd', cooldownEnd.toString());
      setCooldown(cooldownSeconds);
    } catch (error: any) {
      if (error?.data?.errors) {
        Object.entries(error.data.errors).forEach(([field, messages]) =>
          setError(field as 'email', {
            type: 'server',
            message: Array.isArray(messages) ? messages[0] : messages,
          })
        );
        const firstErrorMsg = Object.values(error.data.errors)[0];
        showAlert({
          type: 'error',
          message: Array.isArray(firstErrorMsg)
            ? firstErrorMsg[0]
            : firstErrorMsg,
        });
      } else {
        showAlert({ type: 'error', message: 'An unexpected error occurred.' });
      }
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:mx-18 my-[40px] shadow-[1px_4px_40px_0px_#0000000D] rounded-[20px] px-2 md:px-8 py-10 w-full overflow-y-auto no-scrollbar">
      <div className="flex flex-col font-lora justify-center flex-1 w-full max-w-md mx-auto">
        {alert && (
          <AlertMessage
            key={alert.id}
            type={alert.type}
            message={alert.message}
            className="mb-4"
          />
        )}
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-black text-title-sm sm:text-title-md">
              Forgot Your Password?
            </h1>
            <p className="text-sm text-gray-500">
              We&apos;ll send you a link to reset it.
            </p>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-md space-y-6"
          >
            <div className="grid grid-cols-1 gap-3">
              <div className="sm:col-span-1">
                <Label className="font-medium text-gray-500">
                  Email Address
                </Label>
                <InputForm
                  name="email"
                  placeholder="Enter your email"
                  register={register}
                  error={errors.email}
                  type="email"
                  disabled={cooldown > 0}
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="flex mt-6 items-center justify-center w-full px-4 py-3 text-base font-bold text-white transition rounded-lg bg-black shadow-theme-xs disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading || cooldown > 0}
              >
                {isLoading ? (
                  <LoadingIcon />
                ) : cooldown > 0 ? (
                  `Resend in ${Math.floor(cooldown / 60)}:${(cooldown % 60)
                    .toString()
                    .padStart(2, '0')}`
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </div>
            <div className="mt-4 font-lora flex gap-1 items-center justify-center">
              <p className="text-sm font-normal text-center text-gray-500 dark:text-gray-400 ">
                Back to{' '}
                <Link
                  href="/signup"
                  className="text-black hover:underline font-bold"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
