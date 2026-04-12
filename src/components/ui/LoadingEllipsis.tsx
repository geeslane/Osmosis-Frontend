'use client';

import { motion } from 'framer-motion';

type LoadingEllipsisProps = {
  className?: string;
};

/** Three-dot loading indicator with a sequential pulse (ellipsis-style). */
export default function LoadingEllipsis({ className = '' }: LoadingEllipsisProps) {
  return (
    <span
      className={`inline-flex items-center justify-center gap-1.5 min-h-[1.25em] text-[#101828] ${className}`}
      role="status"
      aria-label="Loading"
    >
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="inline-block h-2 w-2 rounded-full bg-current"
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{
            duration: 1.1,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.22,
          }}
        />
      ))}
    </span>
  );
}
