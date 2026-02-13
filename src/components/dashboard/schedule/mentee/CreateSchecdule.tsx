'use client';
import { EyeCloseIcon, EyeIcon, NewLinkedin } from '@/assets/icons';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

export default function CreateSchedule() {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="mt-10 space-y-8">
      <h3 className="text-2xl md:text-[32px] font-bold text-green-200">
        Schedule a Call with Mentor
      </h3>
      <div className="space-y-2">
        <label htmlFor="topic" className="text-green-300 font-medium">
          Select Topic
        </label>
        <div className="w-full text-[#98A2B3] border-1 rounded-md px-2 h-[36px] border-green-300">
          <select
            id="topic"
            name="topic"
            defaultValue=""
            className="w-full text-sm focus:outline-none border-0 h-full"
          >
            <option value="" disabled>
              Select Topics
            </option>
            <option value="react">React</option>
            <option value="nestjs">NestJS</option>
            <option value="typescript">TypeScript</option>
          </select>
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-green-300 font-medium">Available Mentors</h3>
        <div className="w-[191px] h-[270px] perspective">
          <div
            className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
              flipped ? 'rotate-y-180' : ''
            }`}
          >
            <div className="absolute w-full h-full backface-hidden rounded-2xl bg-green-200 text-white p-4 shadow-lg">
              <div className="relative">
                <Image
                  src="/AboutImage/1.png"
                  alt="Mentor"
                  width={100}
                  height={100}
                  className="rounded-xl w-full h-44 object-cover"
                />

                <button
                  onClick={() => setFlipped(true)}
                  className="absolute top-2 right-2 rounded-full"
                >
                  <EyeIcon />
                </button>
              </div>

              <h3 className="mt-1 text-xl font-semibold">Emmanuel Adegbola</h3>
            </div>
            <div className="absolute w-full h-full backface-hidden rotate-y-180 rounded-2xl bg-green-200 text-white p-4 shadow-lg">
              <div className="flex justify-between flex-col h-full">
                <div>
                  <h3 className=" font-semibold mb-2">Mentor&lsquo;s Bio</h3>

                  <p className="text-sm font-medium leading-relaxed">
                    I have a passion for health and wellness, and educating
                    people on the benefits of taking control of their own
                    health.
                  </p>
                </div>
                <Link
                  href="/"
                  className=" font-medium text-xs flex gap-2 items-center mb-2"
                >
                  <NewLinkedin />
                  View Linkedin
                </Link>
              </div>

              <button
                onClick={() => setFlipped(false)}
                className="absolute top-5 right-2  rounded-full"
              >
                <EyeCloseIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
