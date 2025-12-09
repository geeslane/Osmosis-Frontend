import ContactHero from '@/components/landing/contact/ContactHero';
import GetInTouch from '@/components/landing/contact/GetInTouch';
import Footer from '@/layout/home/Footer';
import Navbar from '@/layout/home/Navbar';
import { generateMetadata } from '@/utils/metadata';
import { Metadata } from 'next';

export const metadata: Metadata = generateMetadata({
  title: 'Osmosis | Contact',
  description:
    "Get in touch with Osmosis -The Future is Coming. Let's Help Them Design It.",
});

export default function AboutPage() {
  return (
    <div className="h-full w-full max-w-[1600px] mx-auto">
      <Navbar />
      <div className=" mt-18 z-10 h-full">
        <ContactHero />
        <GetInTouch />
      </div>
      <Footer />
    </div>
  );
}
