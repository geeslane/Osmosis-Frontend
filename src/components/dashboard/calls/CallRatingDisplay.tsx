'use client';

import { StarIcon } from '@/assets/icons';
import { normalizeCallRating } from '@/utils/callRating';

type CallRatingDisplayProps = {
  rating?: number | null;
  /** When false, shows only the numeric rating (e.g. 3). */
  showStars?: boolean;
};

export function CallRatingDisplay({
  rating,
  showStars = true,
}: CallRatingDisplayProps) {
  const value = normalizeCallRating(rating);

  if (value == null) {
    return <span className="text-sm text-gray-400">—</span>;
  }

  if (!showStars) {
    return (
      <span className="text-sm font-semibold text-gray-700 tabular-nums">
        {value}
      </span>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5" title={`${value} out of 5`}>
      <div className="flex gap-0.5" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon
            key={i}
            className="w-4 h-4 shrink-0"
            fill={i < value ? '#F59E0B' : '#E5E7EB'}
          />
        ))}
      </div>
      <span className="text-sm font-semibold text-gray-700 tabular-nums">
        {value}
      </span>
    </div>
  );
}
