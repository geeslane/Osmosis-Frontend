'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { useGetMeQuery, ProfileApi } from '@/store/profile/profile.api';
import { setUser, clearUser } from '@/store/profile/profile.slice';
import { LoadingIcon } from '@/assets/icons';
import Image from 'next/image';
import useToastify from '@/hooks/useToastify';

export default function LoadingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const { showToast } = useToastify();
  
  // Clear old user data and invalidate cache when component mounts
  useEffect(() => {
    dispatch(clearUser());
    dispatch(ProfileApi.util.invalidateTags(['profile']));
  }, [dispatch]);
  
  const { data, error, isLoading, isSuccess, isError } = useGetMeQuery();

  useEffect(() => {
    if (isSuccess && data?.data?.data) {
      const apiData = data.data.data;
      // Transform API response to Redux User format
      const userData = {
        id: apiData.id,
        full_name: apiData.fullName,
        email: apiData.email,
        role: apiData.role,
        avatar: apiData.pictureUrl || undefined,
        dashboard: {
          ongoing_course: 0,
          completed_course: 0,
          hours_spent: 0,
          certificate: 0,
        },
        deleted_at: null,
        created_at: apiData.createdAt,
        updated_at: apiData.updatedAt,
      };
      dispatch(setUser(userData));
      
      // Get redirect parameter from URL or default to /dashboard/users
      const redirectPath = searchParams.get('redirect') || '/dashboard/users';
      
      // Navigate to the intended destination or default dashboard
      router.replace(redirectPath);
    }
  }, [isSuccess, data, dispatch, router, searchParams]);

  useEffect(() => {
    if (isError) {
      const errorMessage =
        error && 'data' in error
          ? (error.data as any)?.message || 'Failed to fetch user details'
          : 'Failed to fetch user details';
      
      showToast(errorMessage, 'error');
      
      // Middleware will handle redirect if needed
      // Trust middleware to redirect if user is not authenticated
    }
  }, [isError, error, showToast]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-6">
        <Image
          src={'/image/logo.png'}
          alt="Osmosis Logo"
          width={151}
          height={32}
          className="mb-4"
        />
        <div className="flex flex-col items-center gap-4">
          <LoadingIcon width="40" height="40" className="animate-spin text-green-100" />
          <p className="text-[#37445D] font-medium text-lg">
            Loading your account...
          </p>
        </div>
      </div>
    </div>
  );
}
