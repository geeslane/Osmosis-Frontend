import { ArrowLeftIcon, ArrowRightIcon } from '@/assets/icons';
import React from 'react';

type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  onPageChange,
}) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center w-full border-t border-[#EAECF0] px-6 justify-between pt-4">
      <button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="rounded-lg flex items-center border-[#D0D5DD] gap-2 border px-2 font-medium py-2 text-green-300 text-sm disabled:opacity-50"
      >
        <ArrowLeftIcon /> Previous
      </button>

      <div className="flex items-center gap-2">
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`h-8 w-8 font-medium  text-sm ${
              page === p
                ? 'bg-[#DCFFAD91] text-green-200 rounded-lg'
                : ' hover:bg-gray-50 '
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <button
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className="rounded-lg flex items-center border-[#D0D5DD] gap-2 border px-2 font-medium py-2 text-green-300 text-sm disabled:opacity-50"
      >
        Next
        <ArrowRightIcon />
      </button>
    </div>
  );
};
