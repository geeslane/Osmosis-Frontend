import Navbar from '../layout/home/Navbar';
import React from 'react';
import Footer from '../layout/home/Footer';
import { Metadata } from 'next';
import { generateMetadata } from '@/utils/metadata';
import HomeHero from '@/components/landing/home/HomeHero';
import Lead from '@/components/landing/home/Lead';
import Navigating from '@/components/landing/home/Navigating';
import Clarity from '@/components/landing/home/Clarity';
import Transformation from '@/components/landing/home/Transformation';
import Program from '@/components/landing/home/Program';
import HowItWorks from '@/components/landing/home/HowItWorks';
import Future from '@/components/landing/home/Future';
import Investment from '@/components/landing/home/Investment';
import Mentor from '@/components/landing/home/Mentor';
import StillExploring from '@/components/landing/home/StillExploring';

export const metadata: Metadata = generateMetadata({
  title: 'Osmosis | Home',
  description: 'Osmosis',
  url: '/',
});

export default function Page() {
  return (
    <div className="h-full w-full max-w-[1600px] mx-auto">
      <Navbar />
      <div className=" mt-18 z-10 h-full">
        <HomeHero />
        <Lead />
        <Navigating />
        <Clarity />
        <Transformation />
        <Program />
        <HowItWorks />
        <Future />
        <Investment />
        <Mentor />
        <StillExploring />
      </div>
      <Footer />
    </div>
  );
}
