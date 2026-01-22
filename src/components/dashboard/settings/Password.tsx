'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from '@/components/ui/button/Button';
import { changePasswordSchema } from '@/validation/schema';
import PasswordInputForm from '@/components/form/PasswordInputForm';

type ChangePasswordFormValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function Password() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormValues>({
    resolver: yupResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordFormValues) => {
    console.log('Change Password Payload:', data);
    // call API here
  };

  return (
    <div className="flex flex-col gap-9">
      <div className="rounded-md max-w-[747px] px-4 md:px-[64px] border-2 border-[#6CBB0180] py-8 w-full">
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-6">
          <PasswordInputForm
            name="currentPassword"
            label="Current Password"
            placeholder="Enter current password"
            register={register}
            error={errors.currentPassword}
          />

          <PasswordInputForm
            name="newPassword"
            label="New Password"
            placeholder="Enter new password"
            register={register}
            error={errors.newPassword}
          />

          <PasswordInputForm
            name="confirmPassword"
            label="Confirm New Password"
            placeholder="Confirm new password"
            register={register}
            error={errors.confirmPassword}
          />

          <div className="pt-4">
            <Button
              type="submit"
              variant="primary"
              fullWidth
              className="py-4 font-medium"
            >
              {isSubmitting ? 'Updating...' : 'Update Password'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
