'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from '@/components/ui/button/Button';
import { changePasswordSchema } from '@/validation/schema';
import PasswordInputForm from '@/components/form/PasswordInputForm';
import { useChangePasswordMutation } from '@/store/auth/auth.api';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import useToastify from '@/hooks/useToastify';

type ChangePasswordFormValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function Password() {
  const { showToast } = useToastify();
  const user = useSelector((state: RootState) => state.profile.user);
  const [changePassword, { isLoading: isChanging }] = useChangePasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ChangePasswordFormValues>({
    resolver: yupResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordFormValues) => {
    const id = user?.id != null ? String(user.id) : '';
    if (!id) {
      showToast('You must be signed in to change your password.', 'error');
      return;
    }
    try {
      await changePassword({
        id,
        data: {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        },
      }).unwrap();
      showToast('Password updated successfully.', 'success');
      reset();
    } catch (error: unknown) {
      let message = 'Failed to update password';
      if (error && typeof error === 'object' && 'data' in error) {
        const d = (error as { data?: { message?: string } }).data?.message;
        if (d) message = String(d);
      }
      if (message.toLowerCase().includes('current')) {
        message = 'Current password is incorrect';
      }
      showToast(message, 'error');
    }
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
              disabled={isSubmitting || isChanging}
            >
              {isSubmitting || isChanging ? 'Updating…' : 'Update Password'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
