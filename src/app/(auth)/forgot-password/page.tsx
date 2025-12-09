import ForgotPassword from '@/components/auth/ForgotPassword';
import { generateMetadata } from '@/utils/metadata';
import { Metadata } from 'next';

export const metadata: Metadata = generateMetadata({
  title: 'Osmosis | Forgot Password',
});

export default function forgetPassword() {
  return <ForgotPassword />;
}
