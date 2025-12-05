import FAQ from '@/components/landing/FAQ/FAQ';
import Footer from '@/layout/home/Footer';
import Navbar from '@/layout/home/Navbar';
import { generateMetadata } from '@/utils/metadata';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = generateMetadata({
  title: 'Osmosis | FAQ',
  description: 'Questions we get the most',
});
export default function page() {
  return (
    <div className="h-full w-full max-w-[1600px] mx-auto">
      <Navbar />
      <div className=" mt-18 z-10 h-full">
        <FAQ />
      </div>
      <Footer />
    </div>
  );
}
