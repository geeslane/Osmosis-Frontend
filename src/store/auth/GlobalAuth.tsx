'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import useToastify from '@/hooks/useToastify';
import { useDispatch } from 'react-redux';
import { clearSessionCookie } from '@/lib/session';

export default function GlobalAuthHandler() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { showToast } = useToastify();

  useEffect(() => {
    // ⛔ Do nothing on OTP page
    if (pathname.startsWith('/auth/otp')) return;

    const handleUnauthorized = async () => {
      await clearSessionCookie();
      showToast('Session expired. Please log in again.', 'error');
      router.push('/');
    };

    window.addEventListener('unauthorized', handleUnauthorized);

    return () => window.removeEventListener('unauthorized', handleUnauthorized);
  }, [pathname, router, showToast, dispatch]);

  return null;
}
