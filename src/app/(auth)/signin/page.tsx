import SignInForm from '@/components/auth/SignInForm';
import Loading from '@/components/common/Loading';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { generateMetadata } from '@/utils/metadata';

export const metadata: Metadata = generateMetadata({
  title: 'Osmosis | Signin',
  description: 'Osmosis Signin Page',
  url: '/signin',
});

export default function SignIn() {
  return (
    <Suspense fallback={<Loading />}>
      <SignInForm />
    </Suspense>
  );
}
