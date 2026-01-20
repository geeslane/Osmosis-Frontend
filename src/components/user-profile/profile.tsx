'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useGetMeQuery } from '@/store/profile/profile.api';
import { setUser } from '@/store/profile/profile.slice';
import type { User } from '@/store/profile/profile.slice';

export default function Profile() {
  const dispatch = useDispatch();
  const { data, isLoading } = useGetMeQuery();
  
  useEffect(() => {
    // Only update Redux when data is available and not loading
    if (!isLoading && data?.data?.data) {
      const apiData = data.data.data;
      // Transform API response to Redux User format
      const userData: User = {
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
    }
  }, [data, dispatch, isLoading]);

  return null;
}
