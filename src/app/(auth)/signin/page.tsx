import { ArrowBackIcon } from '@/assets/icons';
import SignInForm from '@/components/Auth/SignInForm';
import { generateMetadata } from '@/utils/metadata';
import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';

export const metadata: Metadata = generateMetadata({
  title: 'Osmosis | Signin',
  description: 'Osmosis',
  url: '/signin',
});
export default function page() {
  return (
    <div className=" mx-5 md:mx-[133px] my-[20px] md:my-[40px]">
      <Link
        href={'/'}
        className="flex mb-5  items-center justify-end font-montserrat montserrat font-medium"
      >
        <ArrowBackIcon className="w-5 h-5" />
        Home
      </Link>
      <div className="flex flex-col gap-5 justify-center  overflow-y-scroll no-scrollbar  max-h-[80%] h-full">
        <SignInForm />
      </div>
    </div>
  );
}
