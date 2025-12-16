import { MentorSignupForm } from '@/components/Auth/MentorSignUpForm';
import { generateMetadata } from '@/utils/metadata';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = generateMetadata({
  title: 'Osmosis | Mentor Sign Up',
  description: 'Transform a Teen’s Life and Shape The Next Generation..',
});
export default function page() {
  return (
    <div className="flex justify-centers items-center mx-5 md:mx-[133px] overflow-y-scroll no-scrollbar my-[80px]  max-h-[85%] h-full">
      <MentorSignupForm />
    </div>
  );
}
