'use client';

import Image from 'next/image';
import Link from 'next/link';

interface EmptyStateProps {
  title: string;
  subtitle: string;
  icon: any;
  buttonText?: string;
  href?: string;
}

export default function NoResource({
  title,
  subtitle,
  icon,
  buttonText = 'Get Started',
  href = '/dashboard/explore-courses',
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20">
      <Image
        src={icon}
        alt="Empty state icon"
        className="mb-4"
        width={80}
        height={80}
      />
      <h2 className="text-sm text-gray-400 font-semibold mb-1">{title}</h2>
      <p className="text-xs text-gray-400 mb-4">{subtitle}</p>

      {buttonText && href && (
        <Link
          href={href}
          className="px-10 py-3 bg-black text-white text-xs rounded-lg hover:bg-gray-800"
        >
          {buttonText} →
        </Link>
      )}
    </div>
  );
}
