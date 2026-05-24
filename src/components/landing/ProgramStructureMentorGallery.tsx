'use client';

import {
  FEATURED_MENTORS,
  mentorBioPath,
  type FeaturedMentor,
  type MentorBioReturnKey,
} from '@/data/featuredMentors';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

function MentorPhotoLink({
  mentor,
  returnFrom,
  width,
  height,
  sizes,
  className = '',
}: {
  mentor: FeaturedMentor;
  returnFrom: MentorBioReturnKey;
  width: number;
  height: number;
  sizes: string;
  className?: string;
}) {
  return (
    <Link
      href={mentorBioPath(mentor.slug, returnFrom)}
      className={`block overflow-hidden rounded-xl transition-all duration-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-200 ${className}`}
      title={`View ${mentor.name}'s bio`}
    >
      <Image
        src={encodeURI(mentor.image)}
        alt={mentor.name}
        width={width}
        height={height}
        sizes={sizes}
        className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.02]"
      />
    </Link>
  );
}

export default function ProgramStructureMentorGallery({
  returnFrom,
}: {
  returnFrom: MentorBioReturnKey;
}) {
  const [order, setOrder] = useState<FeaturedMentor[]>(() => [
    ...FEATURED_MENTORS,
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setOrder((prev) => {
        const copy = [...prev];
        const last = copy.pop();
        if (!last) return prev;
        copy.unshift(last);
        return copy;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const [top, middle, hero] = order;

  return (
    <div className="flex flex-1 justify-center mx-auto items-center gap-3">
      <div className="flex flex-col gap-2 rounded-xl">
        <MentorPhotoLink
          mentor={top}
          returnFrom={returnFrom}
          width={330}
          height={334}
          sizes="(max-width: 768px) 165px, 165px"
        />
        <MentorPhotoLink
          mentor={middle}
          returnFrom={returnFrom}
          width={330}
          height={334}
          sizes="(max-width: 768px) 165px, 165px"
        />
      </div>

      <div className="relative flex h-full justify-center">
        <div className="absolute inset-0 z-0 m-auto ml-8 h-[200px] rounded-xl bg-[#CFE8AF] md:h-[270px] md:w-[268px]" />
        <div className="relative z-10 mr-3 mt-10 flex flex-col gap-3 md:mr-0 md:mt-24">
          <MentorPhotoLink
            mentor={hero}
            returnFrom={returnFrom}
            width={530}
            height={534}
            sizes="(max-width: 768px) 265px, 265px"
          />
        </div>
      </div>
    </div>
  );
}
