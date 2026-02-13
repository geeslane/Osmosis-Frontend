'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { truncateText } from '@/utils/helper';
import Image from 'next/image';
import { Star } from '@/assets/icons';

export default function WelcomeNote() {
  const user = useSelector((state: RootState) => state.profile.user);

  const avatarSrc = user?.avatar || '/image/default-avatar.png';

  return (
    <div className="">
      <div className="flex items-center justify-between">
        {/* LEFT */}
        <div className="max-w-[250px] md:max-w-[333px] w-full">
          <h3 className="text-[rgba(0,40,37,1)] font-bold text-2xl md:text-[40px]">
            Good morning, {truncateText(user?.full_name, 10)},
          </h3>

          <h2 className="text-lg md:text-2xl font-medium text-green-300">
            How are you doing today?!
          </h2>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          <Image
            src={avatarSrc}
            alt={user?.full_name || 'User'}
            width={48}
            height={48}
            className="rounded-full object-cover"
          />
          <div>
            <h2 className="text-[#1D2026] font-medium text-lg ">
              {user?.full_name || ''}
            </h2>
            <h3 className="flex items-center gap-1 text-sm font-medium text-[#1D2026]">
              <Star /> 5.0 <span className="text-[#6E7485]">(914)</span>
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
