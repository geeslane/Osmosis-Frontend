import FeaturedMentorBio from '@/components/landing/mentors/FeaturedMentorBio';
import {
  getFeaturedMentorBySlug,
  getFeaturedMentorSlugs,
} from '@/data/featuredMentors';
import Footer from '@/layout/home/Footer';
import Navbar from '@/layout/home/Navbar';
import { generateMetadata as buildMetadata } from '@/utils/metadata';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getFeaturedMentorSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const mentor = getFeaturedMentorBySlug(slug);
  if (!mentor) {
    return buildMetadata({ title: 'Osmosis | Mentor', description: 'Mentor profile' });
  }
  return buildMetadata({
    title: `Osmosis | ${mentor.pageTitle}`,
    description: mentor.tagline ?? mentor.title,
    url: `/mentors/${slug}`,
  });
}

export default async function FeaturedMentorBioPage({ params }: PageProps) {
  const { slug } = await params;
  const mentor = getFeaturedMentorBySlug(slug);
  if (!mentor) notFound();

  return (
    <div className="min-h-screen w-full">
      <Navbar />
      <div className="mt-18 z-10">
        <FeaturedMentorBio mentor={mentor} />
      </div>
      <Footer />
    </div>
  );
}
