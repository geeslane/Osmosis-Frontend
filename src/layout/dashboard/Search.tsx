'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchCoursesAndLessonsQuery } from '@/store/dashboard/dashboard.api';
import { SearchIcon, LoadingIcon } from '@/assets/icons';
import AlertMessage from '@/components/common/AlertMessage';

export default function SearchForm() {
  const router = useRouter();
  const inputWrapperRef = useRef<HTMLDivElement | null>(null);

  const [query, setQuery] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const { data, isFetching } = useSearchCoursesAndLessonsQuery(
    { query: searchTerm },
    { skip: searchTerm.trim().length < 2 }
  );

  const mergedResults = [
    ...(data?.data?.courses || []).map((item: any) => ({
      ...item,
      type: 'course',
    })),
    ...(data?.data?.lessons || []).map((item: any) => ({
      ...item,
      type: 'lesson',
      courseSlug: item.course_slug,
    })),
  ];

  const handleSelect = (item: any) => {
    if (item.type === 'course') {
      router.push(`/dashboard/my-courses/${item.slug}`);
    } else if (item.type === 'lesson') {
      router.push(`/dashboard/my-courses/${item.courseSlug}/lesson/${item.slug}`);
    }
    setShowDropdown(false);
    setQuery('');
    setSearchTerm('');
  };

  useEffect(() => {
    if (query.trim().length >= 2) {
      setSearchTerm(query.trim());
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputWrapperRef.current &&
        !inputWrapperRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full max-w-full" ref={inputWrapperRef}>
      {/* Search input */}
      <div className="flex items-center space-x-2 border border-gray-300 rounded-lg bg-white px-3 py-2 shadow-sm">
        <SearchIcon />
        <input
          type="text"
          placeholder="Search by course or lesson"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-transparent focus:outline-none text-sm text-gray-700 placeholder-gray-400"
        />
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute bg-white w-full mt-2 rounded-lg border border-gray-200 shadow-lg z-50 max-h-64 overflow-y-auto animate-fadeIn custom-scrollbar">
          {isFetching ? (
            <div className="flex justify-center items-center py-4">
              <LoadingIcon className="w-5 h-5 text-gray-500 animate-spin" />
            </div>
          ) : mergedResults.length > 0 ? (
            mergedResults.map((item, index) => (
              <div
                key={index}
                onClick={() => handleSelect(item)}
                className="cursor-pointer px-4 py-3 hover:bg-gray-300 transition-colors border-b last:border-b-0"
              >
                <p className="text-[14px] font-bold text-gray-800 font-lora">
                  {item.title.charAt(0).toUpperCase() + item.title.slice(1)}
                </p>

                <p className="text-[14px] text-gray-500 truncate font-cormorant">
                  {item.subtitle || item.description || 'No description available'}
                </p>
              </div>
            ))
          ) : (
            <div className="p-3">
              <AlertMessage type="info" message="No results found." />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
