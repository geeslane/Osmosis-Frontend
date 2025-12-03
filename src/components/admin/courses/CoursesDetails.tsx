import { MenuCourse } from '@/assets/icons';
import Cards from '@/components/ui/cards/Cards';
import Image from 'next/image';
import React from 'react';
import courseImage from '../../../../public/images/course/foundations.jpg';

export default function CoursesDetails() {
  return (
    <div className="font-lora">
      <Cards>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Image
              src={courseImage}
              alt="courseimage"
              width={106}
              height={106}
              className="rounded-[12px]"
            />
            <div className="flex flex-col gap-4">
              <div>
                <h3 className="font-cormorant font-bold text-[22px]">
                  Foundation
                </h3>
                <p className="text-gray-500 text-sm">
                  Start your journey with core teachings on salvation, prayer,
                  and Scripture.
                </p>
              </div>
              <div>
                <span className="text-xs  bg-gray-300 text-gray-100 px-2 py-2 rounded-sm font-lora">
                  14 Lessons
                </span>
              </div>
            </div>
          </div>
          <MenuCourse />
        </div>
      </Cards>
    </div>
  );
}
