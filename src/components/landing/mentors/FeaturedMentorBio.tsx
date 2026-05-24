import { LinkedinIcon } from '@/assets/icons';
import MentorBioBackLink from '@/components/landing/mentors/MentorBioBackLink';
import type { FeaturedMentor } from '@/data/featuredMentors';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
  mentor: FeaturedMentor;
};

export default function FeaturedMentorBio({ mentor }: Props) {
  if (mentor.imageOnly) {
    return (
      <article className="font-montserrat montserrat mx-auto w-full max-w-2xl px-4 py-12 md:py-20">
        <MentorBioBackLink />
        <div className="flex flex-col items-center">
          <div className="relative aspect-[4/5] w-full max-w-lg overflow-hidden rounded-2xl shadow-xl ring-1 ring-green-200/40">
            <Image
              src={encodeURI(mentor.image)}
              alt={mentor.name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 512px"
              className="object-cover"
            />
          </div>
        </div>
      </article>
    );
  }

  const meetHeading = mentor.tagline
    ? `Meet ${mentor.pageTitle} – ${mentor.tagline}`
    : `Meet ${mentor.pageTitle}`;

  return (
    <article className="font-montserrat montserrat mx-auto w-full max-w-6xl px-4 py-12 md:py-20">
      <MentorBioBackLink />

      <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-14">
        <aside className="mx-auto w-full shrink-0 lg:sticky lg:top-28 lg:mx-0 lg:w-[min(380px,38%)]">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl shadow-xl ring-1 ring-green-200/40">
            <Image
              src={encodeURI(mentor.image)}
              alt={mentor.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 380px"
              className="object-cover"
            />
          </div>
          {mentor.linkedInUrl && (
            <a
              href={mentor.linkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex w-full items-center justify-center gap-2.5 rounded-xl bg-green-100 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-95 [&_svg_path]:!fill-white"
            >
              <LinkedinIcon />
              View LinkedIn profile
            </a>
          )}
        </aside>

        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold leading-snug text-green-200 md:text-[2rem] md:leading-tight">
            {meetHeading}
          </h1>
          <p className="mt-4 text-lg font-medium text-green-100">{mentor.title}</p>

          <div className="mt-8 space-y-5 border-t border-green-200/25 pt-8 text-base leading-relaxed text-[#37445D] md:text-[1.05rem] md:leading-[1.75]">
            {mentor.paragraphs?.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
