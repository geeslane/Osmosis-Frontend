import AboutHero from '@/components/landing/about/AboutHero';
import Benefits from '@/components/landing/about/Benefits';
import Impact from '@/components/landing/about/Impact';
import Process from '@/components/landing/about/Process';
import Ready from '@/components/landing/about/Ready';
import Structure from '@/components/landing/about/Structure';
import Team from '@/components/landing/about/Team';
import VisionAndMisson from '@/components/landing/about/VisionAndMisson';
import Why from '@/components/landing/about/Why';
import Footer from '@/layout/home/Footer';
import Navbar from '@/layout/home/Navbar';
import { generateMetadata } from '@/utils/metadata';
import { Metadata } from 'next';

export const metadata: Metadata = generateMetadata({
  title: 'Osmosis | About',
  description:
    'About Osmosis -  Osmosis is the launching pad for teenagers to absorb the clarity, confidence, and self-leadership skills to thrive in a complex world.',
  url: '/about',
});

export default function AboutPage() {
  return (
    <div className="h-full w-full max-w-[1600px] mx-auto">
      <Navbar />
      <div className=" mt-18 z-10 h-full">
        <AboutHero />
        <VisionAndMisson />
        <Benefits />
        <Process />
        <Structure />
        <Impact />
        <Ready />
        <Why />
        <Team />
        <Footer />
      </div>
    </div>
  );
}
