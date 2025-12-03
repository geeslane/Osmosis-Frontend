'use client';

import { useGoogleLogin } from '@react-oauth/google';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSocialLoginMutation } from '@/store/auth/auth.api';
import useToastify from '@/hooks/useToastify';
import { fetchGoogleUserInfo } from '@/utils/helper';
import { GoogleIcon, LoadingIcon } from '@/assets/icons';
import { setSessionCookie } from '@/lib/session';

export default function GoogleAuth({ authType = 'signin' }) {
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/dashboard';
  const [socialLogin, { isLoading }] = useSocialLoginMutation();
  const { showToast } = useToastify();
  const router = useRouter();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const { name: full_name, email, picture: avatar } = await fetchGoogleUserInfo(tokenResponse.access_token);
        const payload = {
          provider: 'google',
          full_name,
          email,
          avatar
        };
        const res = await socialLogin(payload).unwrap();
        await setSessionCookie(res.data.token);
        const action = authType === 'signin' ? 'Login' : 'Signup';
        showToast(`${action} successful`, 'success');
        router.replace(redirectPath);
      } catch (error) {
        const message = error?.response?.data?.message || error?.message || 'Social login failed';
        showToast(message, 'error');
      }
    },
    onError: () => {
      showToast('Google login failed', 'error');
    },
  });

  return (
    <button
      type="button"
      onClick={() => login()}
      disabled={isLoading}
      className="flex w-full items-center justify-center gap-2 border border-[#E4E7EC] rounded-lg py-[14px] px-[18px] transition-colors bg-white"
    >
      {isLoading ? (
        <LoadingIcon className="w-5 h-5 text-gray-700" />
      ) : (
        <GoogleIcon />
      )}
    </button>
  );
}
