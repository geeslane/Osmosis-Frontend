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
    <div className=" w-full">
      <div className="flex flex-col-reverse md:flex-row w-full gap-5 items-center justify-between">
        <div className="md:max-w-[333px] w-full">
          <h3 className="text-[rgba(0,40,37,1)] font-bold text-2xl md:text-[40px]">
            Good morning, {truncateText(user?.full_name, 10)},
          </h3>
          <h2 className="text-lg md:text-2xl font-medium text-green-300">
            How are you doing today?!
          </h2>
        </div>
        <div className="flex  w-full justify-end items-center gap-3">
          <div className="h-[100px] w-[100px] rounded-full">
            <Image
              src={avatarSrc}
              alt={user?.full_name || 'User'}
              width={100}
              height={100}
              className="rounded-full  w-full h-full object-cover"
            />
          </div>
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
