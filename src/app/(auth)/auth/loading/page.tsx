'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { useGetMeQuery } from '@/store/profile/profile.api';
import { setUser, clearUser } from '@/store/profile/profile.slice';
import { LoadingIcon } from '@/assets/icons';
import Image from 'next/image';
import useToastify from '@/hooks/useToastify';

export default function LoadingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const { showToast } = useToastify();
  
  useEffect(() => {
    dispatch(clearUser());
    // Don't invalidate so we can use prefetched getMe from OTP/sign-in and avoid double fetch
  }, [dispatch]);

  const { data, error, isSuccess, isError } = useGetMeQuery();

  useEffect(() => {
    if (isSuccess && data?.data?.data) {
      const apiData = data.data.data;
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
      
      const redirectPath = searchParams.get('redirect') || '/dashboard';
      
      router.replace(redirectPath);
    }
  }, [isSuccess, data, dispatch, router, searchParams]);

  useEffect(() => {
    if (isError) {
      let errorMessage = 'Failed to fetch user details';
      if (error && typeof error === 'object' && error !== null && 'data' in error) {
        errorMessage =
          (error as any).data?.message || 'Failed to fetch user details';
      }
      showToast(errorMessage, 'error');
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
