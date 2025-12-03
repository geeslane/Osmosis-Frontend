'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import InputForm from '../../../components/form/InputForm';
import { AccountInfoSchema } from '@/validation/schema';
import { useUpdateUserProfileMutation } from '@/store/profile/profile.api';
import useToastify from '@/hooks/useToastify';
import { LoadingIcon } from '@/assets/icons';
import Image from 'next/image';
import SwitchRow from '../../../components/dashboard/profile/SwitchRow';
import { switchConfigs } from '@/utils/data';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface AccountFormData {
  full_name: string;
  email: string;
  provider?: string;
}

const Account = () => {
  const { showToast } = useToastify();
  const user = useSelector((state: RootState) => state.profile.user);
  const [updateProfile, { isLoading }] = useUpdateUserProfileMutation();
  const [activeSection, setActiveSection] = useState('personal');

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<AccountFormData>({
    resolver: yupResolver(AccountInfoSchema),
  });

  const watchProvider = watch('provider');

  useEffect(() => {
    if (user) {
      reset({
        full_name: user.full_name || '',
        email: user.email || '',
        provider: user.provider || '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (formData: AccountFormData) => {
    try {
      const response = await updateProfile(formData).unwrap();
      showToast(response.message, 'success');
    } catch (error: any) {
      if (error?.data?.errors) {
        Object.entries(error.data.errors).forEach(([field, messages]) =>
          setError(field as keyof AccountFormData, {
            type: 'server',
            message: Array.isArray(messages) ? messages[0] : messages,
          })
        );
      } else {
        showToast('Something went wrong', 'error');
      }
    }
  };

  const handleUnlinkGoogle = () => {
    setValue('provider', '');
    showToast(
      "Google account unlinked locally. Click 'Update Changes' to save.",
      'info'
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col md:flex-row gap-16"
    >
      <div className="w-full md:w-1/4 space-y-4 text-sm text-black">
        {switchConfigs.account.map((section) => (
          <SwitchRow
            key={section.key}
            label={section.label}
            description={section.description}
            active={activeSection === section.key}
            onClick={() => setActiveSection(section.key)}
          />
        ))}
      </div>

      <div className="max-w-100 md:w-3/4 space-y-6 font-open-sans">
        {activeSection === 'personal' && (
          <>
            <InputForm
              label="Full Name"
              name="full_name"
              register={register}
              error={errors.full_name}
            />

            <InputForm
              label="Email Address"
              name="email"
              type="email"
              register={register}
              error={errors.email}
            />

            <input type="hidden" {...register('provider')} />

            {(watchProvider || user?.provider)?.toLowerCase() === 'google' && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Linked Account
                </label>
                <div className="flex items-center justify-between border border-gray-200 px-4 py-3 rounded-md">
                  <div className="flex items-center gap-3">
                    <Image
                      src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                      alt="Google"
                      width={20}
                      height={20}
                      className="w-5 h-5"
                    />
                    <div className="flex flex-col text-left">
                      <span className="text-sm text-black">
                        {user?.full_name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {user?.email}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleUnlinkGoogle}
                    className="text-red-500 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="bg-black md: w-full w-auto text-white py-3 px-6 rounded-md text-sm font-medium hover:bg-gray-800 transition"
              disabled={isLoading}
            >
              {isLoading ? <LoadingIcon /> : "Update Changes"}
            </button>

          </>
        )}
      </div>
    </form>
  );
};

export default Account;
