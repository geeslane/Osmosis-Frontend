import {
  CommitmentIcon,
  IntegrityIcon,
  LongArrowIcon,
  ProfessionalIcon,
  RadicalIcon,
} from '@/assets/icons';
import React from 'react';

export default function WhatWeLookFor() {
  return (
    <div className="bg-green-200 h-full mt-20 text-white flex flex-col gap-8 font-montserrat montserrat w-full py-[60px] px-6 md:p-[60px] lg:p-[120px]">
      <div className="flex flex-col gap-4">
        <h3 className="text-2xl md:text-[40px] font-bold text-white">
          What We Look For
        </h3>
        <h2 className="text-base font-semibold text-white md:text-2xl">
          We’re looking for mission-driven leaders who are passionate about
          young people.
        </h2>
        <LongArrowIcon />
      </div>
      <div className="grid gap-5 md:grid-cols-2 grid-cols-1 lg:grid-cols-4 ">
        <div className="space-y-3 h-full">
          <ProfessionalIcon />
          <div className="space-y-2">
            <h3 className="text-lg md:text-2xl font-semibold">
              Professional Excellence
            </h3>
            <p className="text-base md:text-xl">
              Minimum 5+ years of experience. You bring real-world insights that
              textbooks can&#39;t teach.
            </p>
          </div>
        </div>
        <div className="space-y-3 h-full">
          <RadicalIcon />
          <div className="space-y-2">
            <h3 className="text-lg md:text-2xl font-semibold">
              Radical Empathy{' '}
            </h3>
            <p className="text-base md:text-xl">
              The ability to listen without judgment. We don&#39;t dictate
              paths; we help teens discover their own.
            </p>
          </div>
        </div>

        <div className="space-y-3 h-full">
          <CommitmentIcon />
          <div className="space-y-2">
            <h3 className="text-lg md:text-2xl font-semibold">Commitment </h3>
            <p className="text-base md:text-xl">
              Consistency builds trust. We require 2-4 hours per month for
              sessions and check-ins.
            </p>
          </div>
        </div>
        <div className="space-y-3 h-full">
          <IntegrityIcon />
          <div className="space-y-2">
            <h3 className="text-lg md:text-2xl font-semibold">Integrity</h3>
            <p className="text-base md:text-xl">
              Working with minors is a privilege. Mentors must pass a background
              check and adhere to our code of conduct.{' '}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
