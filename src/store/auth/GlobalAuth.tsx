'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useToastify from '@/hooks/useToastify';
import { useDispatch } from 'react-redux';
//import { setUser } from '@/store/profile/profile.slice';
import { clearSessionCookie } from '@/lib/session';

export default function GlobalAuthHandler() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { showToast } = useToastify();

  useEffect(() => {
    const handleUnauthorized = async () => {
      await clearSessionCookie();
      //dispatch();
      /*  setUser({
          id: 0,
          full_name: '',
          email: '',
        }) */
      showToast('Session expired. Please log in again.', 'error');
      router.push('/');
    };
    window.addEventListener('unauthorized', handleUnauthorized);
    return () => window.removeEventListener('unauthorized', handleUnauthorized);
  }, [dispatch, router, showToast]);
  return null;
}
