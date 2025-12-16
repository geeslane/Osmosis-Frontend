'use client';
import { EmailIcon, LoadingIcon } from '@/assets/icons';
import Image from 'next/image';
import React from 'react';
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
  const {
    register,
    handleSubmit,
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
      const message = error?.data.message || error?.error || '';
      showToast(message, 'error');
    }
  };
  return (
    <div className=" w-full font-montserrat montserrat">
      <Image src={'/image/logo.png'} alt="" width={151} height={32} />
      <div className="flex flex-col mt-6 gap-7">
        <div>
          <h3 className="text-[40px] text-green-200 font-bold">
            Welcome back!
          </h3>
          <p className="text-[#37445D] font-medium text-xl">
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
        <Link
          href={'/teenagers/signup'}
          className="flex dm-sans text-[#0F1C24] text-[15px] font-medium items-center justify-center"
        >
          Already have an account?{' '}
          <span className="text-green-100 ml-1">Signup</span>
        </Link>
      </div>
    </div>
  );
}
