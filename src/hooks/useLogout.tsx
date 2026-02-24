'use client';

import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import useToastify from '@/hooks/useToastify';
import { useLogoutMutation } from '@/store/auth/auth.api';
import { AuthApi } from '@/store/auth/auth.api';
import { ProfileApi } from '@/store/profile/profile.api';
import { DashboardApi } from '@/store/dashboard/dashboard.api';
import { UsersApi } from '@/store/users/users.api';
import { clearSessionCookie } from '@/lib/session';
import { clearUser } from '@/store/profile/profile.slice';
import { persistor } from '@/store';

export function useLogoutHandler() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { showToast } = useToastify();

  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      showToast('You have been logged out successfully', 'success');
    } catch (error: any) {
      const message =
        error?.data?.message || error?.error || 'Logged out successfully';
      showToast(message, 'success');
    } finally {
      await clearSessionCookie();
      dispatch(clearUser());
      dispatch(AuthApi.util.resetApiState());
      dispatch(ProfileApi.util.resetApiState());
      dispatch(DashboardApi.util.resetApiState());
      dispatch(UsersApi.util.resetApiState());
      await persistor.purge();
      router.replace('/signin');
    }
  };

  return {
    handleLogout,
    isLoggingOut,
  };
}
