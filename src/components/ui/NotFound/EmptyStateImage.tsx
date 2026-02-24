'use client';

import Image from 'next/image';
import React, { useState } from 'react';

export const EMPTY_STATE_IMAGE = '/image/emp.png';

const FallbackSvg = ({ size = 200 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="mx-auto text-gray-300 shrink-0"
    aria-hidden
  >
    <rect width="200" height="200" rx="8" fill="currentColor" opacity="0.15" />
    <path
      d="M70 80h60v40H70V80zm0 0l20 20 20-20 20 20"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.4"
    />
    <text
      x="100"
      y="115"
      textAnchor="middle"
      fill="currentColor"
      opacity="0.5"
      fontSize="14"
    >
      No items
    </text>
  </svg>
);

type EmptyStateImageProps = {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  fallbackSize?: number;
};

export function EmptyStateImage({
  src = EMPTY_STATE_IMAGE,
  alt = 'Empty',
  width = 320,
  height = 320,
  fallbackSize = 200,
}: EmptyStateImageProps) {
  const [error, setError] = useState(false);

  if (error) {
    return <FallbackSvg size={fallbackSize} />;
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className="mx-auto shrink-0"
      onError={() => setError(true)}
      unoptimized
    />
  );
}
