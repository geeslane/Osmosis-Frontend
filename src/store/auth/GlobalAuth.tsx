'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import useToastify from '@/hooks/useToastify';
import { clearSessionCookie } from '@/lib/session';

export default function GlobalAuthHandler() {
  const router = useRouter();
  const pathname = usePathname();
  const { showToast } = useToastify();

  useEffect(() => {
    if (pathname.startsWith('/auth/otp') || pathname.startsWith('/signin'))
      return;

    const handleUnauthorized = async () => {
      await clearSessionCookie();
      showToast('Session expired. Please log in again.', 'error');
      router.push('/signin');
    };

    window.addEventListener('unauthorized', handleUnauthorized);

    return () => window.removeEventListener('unauthorized', handleUnauthorized);
  }, [pathname, router, showToast]);

  return null;
}
