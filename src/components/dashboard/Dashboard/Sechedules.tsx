import { ArrowLeft, PersonalBranding, ProfessionalIcons } from '@/assets/icons';
import { Meta } from '@/components/common/Details/Meta';
import Button from '@/components/ui/button/Button';
import React from 'react';

export default function Sechedules() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 py-[56px] gap-4">
      <div className="border-green-100 space-y-4 border-[1.5px] p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-green-300 font-semibold text-2xl">
            Next Scheduled call
          </h3>
          <p className="flex gap-1 cursor-pointer items-center text-xs text-green-300 font-medium">
            View all <ArrowLeft />
          </p>
        </div>
        <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between">
          <div>
            <h3 className="text-sm text-green-300 font-medium">Mentor Name</h3>
            <h3 className="text-lg text-green-200 font-semibold">
              Emmanuel Adegbola
            </h3>
          </div>
          <Button className="bg-green-100 text-white font-semibold  px-3 py-2 flex items-center gap-1 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed">
            Join call
          </Button>
        </div>

        <div className="mt-10 grid grid-cols-2 md:grid-cols-3  gap-6">
          <Meta label={'Date'} value={'12 Dec., 2025'} />
          <Meta label={'Time'} value={'12:00 am'} />
          <Meta label={'Topic'} value={'Joy in Chaos'} />
        </div>
      </div>
      <div className="border-green-100 border-[1.5px] p-6 rounded-lg">
        <h3 className="text-green-200 font-semibold text-2xl">
          Live session reminders.{' '}
        </h3>
        <div className="space-y-[20px] pt-[20px]">
          <div className="flex justify-between items-center px-3">
            <div className="flex items-center gap-4">
              <ProfessionalIcons />
              <div>
                <h3 className="text-[#1C1D1D] font-medium">
                  Personal Leadership
                </h3>
                <h3 className="text-green-300">5:30pm | 12 Dec., 2025</h3>
              </div>
            </div>
            <Button className="bg-green-100 text-white font-semibold  px-6 py-2 flex items-center gap-1 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed">
              Join
            </Button>
          </div>
          <div className="flex justify-between items-center px-3">
            <div className="flex items-center gap-4">
              <PersonalBranding />
              <div>
                <h3 className="text-[#1C1D1D] font-medium">
                  Personal Branding
                </h3>
                <h3 className="text-green-300">5:30pm | 12 Dec., 2025</h3>
              </div>
            </div>
            <Button className="bg-green-100 text-white font-semibold  px-6 py-2 flex items-center gap-1 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed">
              Join
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
