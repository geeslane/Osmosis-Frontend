
import ResendVerificationEmail from '@/components/auth/ResendEmailVerification';
import AlertMessage from '@/components/common/AlertMessage';
import { generateMetadata } from '@/utils/metadata';
import { Metadata } from 'next';

export const metadata: Metadata = generateMetadata({ title: 'FOJO | Verify Email' });
interface PageProps {
  searchParams: Promise<{ email?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const { email } = await searchParams;

  if (!email) {
    return (
      <div className="max-w-md mx-auto mt-10">
        <AlertMessage
          type="error"
          message='Email is required to resend verification link.'
        />
      </div>
    );
  }
  return <ResendVerificationEmail email={email} />;
}
