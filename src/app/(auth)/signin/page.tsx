import SignInForm from '@/components/Auth/SignInForm';
import { generateMetadata } from '@/utils/metadata';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = generateMetadata({
  title: 'Osmosis | Signin',
  description: 'Osmosis',
  url: '/signin',
});
export default function page() {
  return (
    <div className="flex justify-centers items-center mx-5 md:mx-[133px] overflow-y-scroll no-scrollbar my-[100px] max-h-[80%] h-full">
      <SignInForm />
    </div>
  );
}
