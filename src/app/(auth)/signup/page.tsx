import SignUpForm from '@/components/auth/SignUpForm';
import { generateMetadata } from '@/utils/metadata';
import { Metadata } from 'next';

export const metadata: Metadata = generateMetadata({
  title: 'Osmosis | Signup',
  url: '/signup',
  description: '',
});

export default function SignUp() {
  return <SignUpForm />;
}
