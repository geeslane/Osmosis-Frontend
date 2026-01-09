import { ArrowBackIcon } from '@/assets/icons';
import { TeenagerSignupForm } from '@/components/Auth/TeenagerSignUp';
import { generateMetadata } from '@/utils/metadata';
import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';

export const metadata: Metadata = generateMetadata({
  title: 'Osmosis | Teenagers Sign Up',
  description: 'Transform a Teen’s Life and Shape The Next Generation..',
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
      <div className="flex justify-centers items-center overflow-y-scroll no-scrollbar   max-h-[85%] h-full">
        <TeenagerSignupForm />
      </div>
    </div>
  );
}
