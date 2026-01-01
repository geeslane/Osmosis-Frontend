import HowMentorWorks from '@/components/landing/mentors/HowMentorWorks';
import LookLike from '@/components/landing/mentors/LookLike';
import MentorHero from '@/components/landing/mentors/MentorHero';
import Shape from '@/components/landing/mentors/Shape';
import WhatWeLookFor from '@/components/landing/mentors/WhatWeLookFor';
import WhyJoinUs from '@/components/landing/mentors/WhyJoinUs';
import Footer from '@/layout/home/Footer';
import Navbar from '@/layout/home/Navbar';
import { generateMetadata } from '@/utils/metadata';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = generateMetadata({
  title: 'Osmosis | Mentors',
  description: 'Transform a Teen’s Life and Shape The Next Generation..',
});

export default function page() {
  return (
    <div className="h-full w-full max-w-[1600px] mx-auto">
      <Navbar />
      <div className=" mt-18 z-10 h-full text-black">
        <MentorHero />
        <LookLike />
        <WhatWeLookFor />
        <HowMentorWorks />
        <WhyJoinUs />
        <Shape />
      </div>
      <Footer />
    </div>
  );
}
