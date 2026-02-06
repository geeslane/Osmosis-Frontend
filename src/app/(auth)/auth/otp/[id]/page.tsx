import OtpPage from '@/components/Auth/OTP';
import { generateMetadata } from '@/utils/metadata';
import { Metadata } from 'next';
import React from 'react';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}
export const metadata: Metadata = generateMetadata({
  title: 'Osmosis | Verify OTP',
  description:
    'Securely verify your one-time password to complete authentication and continue to your account.',
});

export default async function Page({ params }: PageProps) {
  const { id: userId } = await params;

  return (
    <div className="h-full">
      <OtpPage sessionId={userId} />
    </div>
  );
}
