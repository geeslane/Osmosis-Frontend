'use client';
import { LoadingIcon } from '@/assets/icons';
import Link from 'next/link';
import InputForm from '../form/InputForm';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { SignInFormSchema } from '@/validation/schema';
import { useLoginMutation } from '@/store/auth/auth.api';
import useToastify from '@/hooks/useToastify';
import { useRouter, useSearchParams } from 'next/navigation';
import Label from '../form/Label';
import { setSessionCookie } from '@/lib/session';
import GoogleAuth from '../auth/socialauth/GoogleAuth';
import PasswordInputForm from '../form/PasswordInputForm';
import { Suspense } from 'react';
import Loading from '../common/Loading';

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
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SigninFormInputs>({
    resolver: yupResolver(SignInFormSchema),
  });

  const onSubmit = async (formData: SigninFormInputs) => {
    try {
      const apiData = {
        email: formData.email,
        password: formData.password,
      };
      const response = await UserSignIn(apiData).unwrap();
      const token = response?.data?.token;
      const userRole = (response?.data as { role?: string })?.role;
      await setSessionCookie({ token, role: userRole });
      showToast(response.message, 'success');
      router.replace(redirectPath);
    } catch (error: any) {
      if (error?.data?.errors) {
        Object.entries(error.data.errors).forEach(([field, messages]) =>
          setError(field as 'email' | 'password', {
            type: 'server',
            message: Array.isArray(messages) ? messages[0] : messages,
          })
        );
      }
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:mx-18 my-[40px] shadow-[1px_4px_40px_0px_#0000000D] rounded-[20px] px-2 md:px-8 py-10  w-full overflow-y-auto no-scrollbar">
      <div className="flex flex-col font-lora justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="ml-0 mb-1 font-lora font-bold text-black text-title-sm sm:text-title-md">
              Welcome Back!
            </h1>
            <p className="text-sm text-gray-500 font-normal font-lora">
              Continue your journey of discipleship
            </p>
          </div>
          <div>
            <div className="">
              <Suspense fallback={<Loading />}>
                <GoogleAuth authType="signin" />
              </Suspense>
            </div>
            <div className="relative py-3 sm:py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="p-2 text-gray-400 bg-white dark:bg-gray-900 sm:px-5 sm:py-2">
                  OR
                </span>
              </div>
            </div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full max-w-md space-y-6"
            >
              <div className="grid grid-cols-1 gap-3 ">
                <div className="sm:col-span-1">
                  <Label className="font-medium  text-gray-500">
                    Email Address
                  </Label>
                  <InputForm
                    name="email"
                    placeholder="Enter your email address"
                    register={register}
                    error={errors.email}
                    type="text"
                  />
                </div>
                <div>
                  <PasswordInputForm
                    name="password"
                    placeholder="Enter password"
                    register={register}
                    error={errors.password}
                    label="Password"
                  />
                  <Link
                    href="/forgot-password"
                    className="float-right mt-1 text-sm text-gray-500"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div>
                  <button
                    type="submit"
                    className="flex mt-4 items-center justify-center w-full px-4 py-3 text-sm font-lora font-medium text-white transition rounded-lg bg-black shadow-theme-xs  disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <LoadingIcon width="20" height="20" />
                    ) : (
                      'Sign In'
                    )}
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-4 font-lora flex items-center justify-center">
              <p className="text-sm font-normal text-center text-gray-500 dark:text-gray-400">
                Don`t have an account?
                <Link
                  href="/signup"
                  className="text-black hover:underline font-bold mx-1"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
