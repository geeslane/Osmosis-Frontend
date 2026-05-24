import { ArrowUpIcon } from '@/assets/icons';
import { FEATURED_MENTORS, mentorBioPath } from '@/data/featuredMentors';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function Mentor() {
  return (
    <section id="mentors" className="scroll-mt-24">
      <div className="w-full font-montserrat montserrat flex flex-col justify-center items-center gap-8 py-12 md:py-20 px-8 md:px-8 lg:px-16">
        <h3 className="text-green-200 max-w-[1000px] text-center text-[26px] leading-8 md:leading-18 md:text-[72px] font-bold">
          Our Mentors
        </h3>
        <div>
          <p className="max-w-[754px] mx-auto text-center md:text-xl text-green-200">
            Behind every confident teen is a mentor who believes in them. Our
            mentors are skilled professionals and passionate individuals who
            guide teenagers with empathy, accountability, and experience.
          </p>
          <div className="mt-6 flex justify-center">
            <Link
              href="/mentor/signup"
              className="md:px-6 justify-center max-w-[380px] px-4 flex items-center gap-1 py-2 border-0 rounded-xl text-white font-semibold transition-colors bg-green-100"
            >
              Become a Mentor
              <ArrowUpIcon />
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:mx-[64px]">
            {FEATURED_MENTORS.map((mentor) => {
              const bioHref = mentor.linkFromHome
                ? mentorBioPath(mentor.slug, 'home')
                : null;

              const card = (
                <>
                  <div
                    className={`relative aspect-square w-full max-w-[280px] overflow-hidden rounded-xl ${
                      bioHref
                        ? 'ring-0 transition-all duration-300 group-hover:ring-2 group-hover:ring-green-200/80 group-hover:shadow-lg'
                        : ''
                    }`}
                  >
                    <Image
                      src={encodeURI(mentor.image)}
                      alt={mentor.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 280px"
                      className="object-cover transition-all duration-700 group-hover:scale-[1.02]"
                    />
                  </div>
                  <div className="flex flex-col items-center text-center px-2">
                    <h3 className="text-green-100 font-bold md:text-xl">
                      {mentor.name}
                    </h3>
                    <p className="text-green-200 text-sm font-medium mt-1">
                      {mentor.title}
                    </p>
                    {bioHref && (
                      <p className="mt-2 text-xs font-medium text-green-100/90">
                        View bio →
                      </p>
                    )}
                  </div>
                </>
              );

              if (bioHref) {
                return (
                  <Link
                    key={mentor.slug}
                    href={bioHref}
                    className="group flex w-full flex-col items-center justify-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-200 rounded-xl"
                  >
                    {card}
                  </Link>
                );
              }

              return (
                <div
                  key={mentor.slug}
                  className="flex w-full flex-col items-center justify-center gap-3"
                >
                  {card}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
