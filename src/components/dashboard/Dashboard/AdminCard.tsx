import { EyeIcon } from '@/assets/icons';
import React from 'react';

export default function AdminCard({ count, title, color }: any) {
  return (
    <div className={`flex-col ${color} z-99 flex rounded-[15px] p-[18px]`}>
      <div className="flex justify-between w-full items-center text-white">
        <h3 className="text-[56px] font-extrabold">{count}</h3>
        <div className="flex items-center ">
          <EyeIcon />
          <h3 className="text-sm mb-1">View</h3>
        </div>
      </div>
      <h3 className="text-white font-semibold text-2xl">{title}</h3>
    </div>
  );
}
