'use client';

import {
  MENTOR_BIO_RETURN,
  resolveMentorBioReturn,
} from '@/data/featuredMentors';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

export default function MentorBioBackLink() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from');
  const resolved = resolveMentorBioReturn(from);

  const className =
    'mb-8 inline-flex text-sm font-medium text-green-200 hover:text-green-100';

  if (resolved) {
    return (
      <Link href={resolved.href} className={className}>
        {resolved.label}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        if (typeof window !== 'undefined' && window.history.length > 1) {
          router.back();
          return;
        }
        router.push(MENTOR_BIO_RETURN.home.href);
      }}
      className={`${className} border-0 bg-transparent p-0 cursor-pointer`}
    >
      ← Back
    </button>
  );
}
