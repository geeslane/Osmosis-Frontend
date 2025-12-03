'use client';
import React, { useState } from 'react';
import InputForm from '../form/InputForm';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import useToastify from '@/hooks/useToastify';
import { ResetPasswordSchema } from '@/validation/schema';
import Label from '../form/Label';
import { useRouter } from 'next/navigation';
import { useResetPasswordMutation } from '@/store/auth/auth.api';
import { EyeCloseIcon, LoadingIcon, EyeIcon } from '@/assets/icons';
import AlertMessage from '../common/AlertMessage';

interface ResetPasswordFormProps {
  email: string;
  token: string;
}
type FormInputs = {
  password: string;
  password_confirmation: string;
};

export default function ResetPassword({
  token,
  email,
}: ResetPasswordFormProps) {
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirm: false,
  });
  const router = useRouter();
  const [alert, setAlert] = useState<{
    type: 'success' | 'error';
    message: string;
    id?: number;
  } | null>(null);

  const [resetUser, { isLoading }] = useResetPasswordMutation();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormInputs>({
    resolver: yupResolver(ResetPasswordSchema),
  });

  const { showToast } = useToastify();
  const togglePasswordVisibility = (field: 'password' | 'confirm') => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };
  const showAlert = (alertObj: {
    type: 'success' | 'error';
    message: string;
  }) => {
    setAlert({ ...alertObj, id: Date.now() });
  };
  const onSubmit = async (formData: FormInputs) => {
    try {
      const apiData = {
        email: email,
        token: token,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
      };
      const response = await resetUser(apiData).unwrap();
      router.push('/signin');
      showToast(response.message, 'success');
    } catch (error: any) {
      if (error?.data?.status === false && error?.data?.message) {
        showAlert({
          type: 'error',
          message: error.data.message,
        });
      } else if (error?.data?.errors) {
        Object.entries(error.data.errors).forEach(([field, messages]) =>
          setError(field as 'password' | 'password_confirmation', {
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
        showAlert({
          type: 'error',
          message: 'An unexpected error occurred.',
        });
      }
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:mx-18 my-[40px] shadow-[1px_4px_40px_0px_#0000000D] rounded-[20px] px-2 md:px-8 py-10  w-full overflow-y-auto no-scrollbar">
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
              Reset Your Password{' '}
            </h1>
            <p className="text-sm text-gray-500 ">
              Enter a new password below to reset your account.
            </p>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 max-w-md mx-auto mt-10"
          >
            <div className="grid grid-cols-1 gap-3 ">
              {/* <!-- password --> */}
              <div className="sm:col-span-1">
                <Label className="font-medium  text-gray-500">Password</Label>
                <div className="relative ">
                  <InputForm
                    name="password"
                    placeholder="Enter password"
                    register={register}
                    error={errors.password}
                    type={showPassword.password ? 'text' : 'password'}
                  />
                  <span
                    onClick={() => togglePasswordVisibility('password')}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-8"
                  >
                    {showPassword.password ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                    )}
                  </span>
                </div>
              </div>
              <div className="sm:col-span-1">
                <Label className="font-medium  text-gray-500">
                  Confirm Paswword
                </Label>
                <div className="relative ">
                  <InputForm
                    name="password_confirmation"
                    placeholder="Enter password"
                    register={register}
                    error={errors.password_confirmation}
                    type={showPassword.confirm ? 'text' : 'password'}
                  />
                  <span
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-8"
                  >
                    {showPassword.confirm ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                    )}
                  </span>
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="flex mt-6 items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-black shadow-theme-xs  disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? <LoadingIcon /> : ' Submit'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
