'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useGetMeQuery } from '@/store/profile/profile.api';
import { setUser } from '@/store/profile/profile.slice';

export default function Profile() {
  const dispatch = useDispatch();
  const { data, refetch } = useGetMeQuery();
  useEffect(() => {
    refetch();
    if (data?.data) {
      dispatch(setUser(data.data));
    }
  }, [data, dispatch, refetch]);

  return null;
}
