'use client';

import { EmptyStateImage } from './EmptyStateImage';

type NoResultsProps = {
  title?: string;
  description?: string;
  /** Set to false to hide the empty-state image (text only). Default true. */
  showImage?: boolean;
};

export function NoResult({
  title = 'No results found',
  description = "We couldn't find anything matching your search.",
  showImage = true,
}: NoResultsProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {showImage && (
        <div className="mb-6">
          <EmptyStateImage
            width={240}
            height={240}
            fallbackSize={160}
            alt="No results"
          />
        </div>
      )}
      <h3 className="text-sm font-medium text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </div>
  );
}
