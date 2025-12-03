'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useToastify from '@/hooks/useToastify';
import { useDispatch } from 'react-redux';
import { setUser } from '@/store/profile/profile.slice';
import { clearSessionCookie } from '@/lib/session';

export default function GlobalAuthHandler() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { showToast } = useToastify();

  useEffect(() => {
    const handleUnauthorized = async () => {
      await clearSessionCookie();
      dispatch(
        setUser({
          id: 0,
          full_name: '',
          email: '',
          provider: '',
          role: '',
          dashboard: {
            ongoing_course: 0,
            completed_course: 0,
            hours_spent: 0,
            certificate: 0,
          },
          deleted_at: null,
          created_at: '',
          updated_at: '',
        })
      );
      showToast('Session expired. Please log in again.', 'error');
      router.push('/');
    };
    window.addEventListener('unauthorized', handleUnauthorized);
    return () => window.removeEventListener('unauthorized', handleUnauthorized);
  }, [dispatch, router, showToast]);
  return null;
}
