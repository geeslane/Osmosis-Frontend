'use client';

import {
  EmailIcon,
  LoadingIcon,
  LocationIcon,
  PhoneIcon,
  UserAddIcon,
} from '@/assets/icons';
import Image from 'next/image';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useGetTeenagerByIdQuery } from '@/store/users/users.api';
import ModulesTable from './ModulesTable';
import CallHistoryTable from './CallHistory';
import ProgressGauge from '@/components/ui/Progress/ProgressGauge';
import { Info } from '@/components/common/Details/Info';
import { Meta } from '@/components/common/Details/Meta';
import PageTitle from '@/components/PageTitle';
// types/mentee.ts
export type MenteeStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING';
export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export interface TeenagerDTO {
  id: string;
  teenagerFullName: string;
  teenagerEmail: string;
  teenagerPhoneNumber: string;
  parentFullName: string;
  parentEmail: string;
  parentPhoneNumber: string;
  pictureUrl: string;
  address: string;
  hobbies: string;
  gender: Gender;
  class: string;
  status: MenteeStatus;
  dateOfBirth: string;
  createdAt: string;
  updatedAt: string;
}
const statusStyles: Record<MenteeStatus, string> = {
  ACTIVE: 'bg-green-50 text-green-600',
  INACTIVE: 'bg-[#FEF3F2] text-[#B42318]',
  PENDING: 'bg-[#F2F4F7] text-[#282F2E]',
};

export default function Detail() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useGetTeenagerByIdQuery(id);
  const [viewCallHistory, setViewCallHistory] = useState(false);

  const mentee: TeenagerDTO | undefined = data?.data?.data;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoadingIcon
          width="40"
          height="40"
          className="animate-spin text-green-100"
        />
      </div>
    );
  }
  if (!mentee) return <div>No mentee found</div>;

  return (
    <div className="w-full max-w-[1092px]">
      <PageTitle title={mentee.teenagerFullName || 'Mentee'} />

      {viewCallHistory ? (
        <CallHistoryTable />
      ) : (
        <div className="flex flex-col gap-10">
          {/* Header */}
          <div className="flex justify-between">
            <h3 className="text-green-200 text-3xl font-bold">
              Mentee Details
            </h3>
            <button
              onClick={() => setViewCallHistory(true)}
              className="flex items-center gap-2 px-8 rounded-xl bg-[#DCFFAD91]"
            >
              <span className="hidden md:block font-medium text-green-300">
                View Call History
              </span>
              <PhoneIcon color="#002825" />
            </button>
          </div>

          {/* Profile Card */}
          <div className="flex items-center gap-2">
            <p className="text-green-300 text-sm font-medium">Status : </p>
            <span
              className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${
                statusStyles[mentee.status]
              }`}
            >
              {mentee.status}
            </span>
          </div>
          <div className="rounded-lg border border-[#6CBB0180] px-10 md:px-16 py-8 flex flex-col md:flex-row  gap-10">
            <div className="w-[120px] h-[120px] rounded-full">
              <Image
                src={mentee.pictureUrl}
                alt={mentee.teenagerFullName}
                width={120}
                height={120}
                className="rounded-full object-cover"
              />
            </div>
            <div className="flex flex-col w-full gap-[56px]">
              <div className="flex w-full  justify-between">
                <Info
                  icon={<UserAddIcon />}
                  label="Full Name"
                  value={mentee.teenagerFullName}
                />
                <Info
                  icon={<EmailIcon color="#6CBB01" />}
                  label="Email"
                  value={mentee.teenagerEmail}
                />
                <Info
                  icon={<PhoneIcon color="#6CBB01" />}
                  label="Phone Number"
                  value={mentee.teenagerPhoneNumber}
                />
                <Info
                  icon={<LocationIcon color="#6CBB01" />}
                  label="Address"
                  value={mentee.address}
                />
              </div>
              <div className="flex gap-10 md:flex-row flex-col ">
                <Meta
                  label="Date of Birth"
                  value={new Date(mentee.dateOfBirth).toLocaleDateString()}
                />
                <Meta label="Gender" value={mentee.gender} />
                <Meta label="Hobbies" value={mentee.hobbies} />
                <Meta label="Class" value={mentee.class} />
              </div>
              <div className="flex flex-col gap-6">
                <h3 className="text-2xl font-semibold text-green-300">
                  Parent Details
                </h3>
                <div className="flex gap-10 md:flex-row flex-col ">
                  <Meta label="Full Name " value={mentee.parentFullName} />
                  <Meta label="Email " value={mentee.parentEmail} />
                  <Meta
                    label="Phone Number "
                    value={mentee.parentPhoneNumber}
                  />
                </div>
              </div>
              <div className="max-w-[220px] border border-[#6CBB0180] rounded-lg  pt-4">
                <ProgressGauge percentage={25} />
              </div>
            </div>
          </div>

          {/* Modules & Progress */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full border border-[#6CBB0180] rounded-lg p-5">
              <h3 className="text-2xl text-green-300 font-semibold mb-4">
                Modules
              </h3>
              <ModulesTable />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
