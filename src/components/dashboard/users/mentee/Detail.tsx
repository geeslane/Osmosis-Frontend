'use client';

import {
  CalendarIcon,
  CourseIcon,
  EmailIcon,
  GoBackIcon,
  HeartIcon,
  LoadingIcon,
  LocationIcon,
  PhoneIcon,
  UserAddIcon,
  UserIcon,
} from '@/assets/icons';
import Image from 'next/image';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGetTeenagerByIdQuery } from '@/store/users/users.api';
import ModulesTable from './ModulesTable';
import CallHistoryTable from './CallHistory';
import ProgressGauge from '@/components/ui/Progress/ProgressGauge';
import { Info } from '@/components/common/Details/Info';
import PageTitle from '@/components/PageTitle';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { formatDate, normalizeImageUrl } from '@/utils/helper';

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

const MENTEES_LIST_PATH = '/dashboard/users?role=mentee';

export default function Detail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data, isLoading } = useGetTeenagerByIdQuery(id);
  const [viewCallHistory, setViewCallHistory] = useState(false);
  const [imageError, setImageError] = useState(false);
  const user = useSelector((state: RootState) => state.profile.user);
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

  const pictureUrl =
    mentee.pictureUrl && !imageError
      ? normalizeImageUrl(mentee.pictureUrl)
      : null;
  const displayName = mentee.teenagerFullName?.trim() || 'Mentee';
  const dateOfBirthDisplay = mentee.dateOfBirth
    ? formatDate(mentee.dateOfBirth)
    : null;

  return (
    <div className="w-full max-w-[1092px]">
      <PageTitle title={displayName} />

      {viewCallHistory ? (
        <CallHistoryTable />
      ) : (
        <div className="flex flex-col gap-6 md:gap-8">
          {/* Back + Header row */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => router.push(MENTEES_LIST_PATH)}
              className="flex items-center gap-2 text-green-200 font-medium hover:opacity-80 transition-opacity shrink-0"
              type="button"
            >
              <GoBackIcon />
              <span className="text-sm">Back</span>
            </button>
            <div className="flex-1 flex flex-wrap items-center justify-between gap-4 min-w-0">
              <h3 className="text-green-200 text-2xl md:text-3xl font-bold">
                Mentee Details
              </h3>
              {['ADMIN', 'SUPERADMIN'].includes(
                user?.role?.toUpperCase() || ''
              ) && (
                <button
                  onClick={() => setViewCallHistory(true)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#DCFFAD91] hover:opacity-90 transition-opacity shrink-0"
                >
                  <span className="hidden md:block font-medium text-green-300">
                    View Call History
                  </span>
                  <PhoneIcon color="#002825" />
                </button>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center gap-2">
            <p className="text-green-300 text-sm font-medium">Status</p>
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                statusStyles[mentee.status]
              }`}
            >
              {mentee.status}
            </span>
          </div>

          {/* Profile Card: left = info (icons left of text), right = progress */}
          <div className="rounded-lg border border-[#6CBB0180] px-6 md:px-10 lg:px-16 py-8 flex flex-col lg:flex-row gap-8 lg:gap-10">
            <div className="flex-1 flex flex-col md:flex-row gap-8 md:gap-10 min-w-0">
              <div className="shrink-0 flex justify-center md:justify-start">
                <div className="relative w-[120px] h-[120px] rounded-full overflow-hidden bg-green-100/30 shrink-0">
                  {pictureUrl ? (
                    <Image
                      src={pictureUrl}
                      alt={displayName}
                      fill
                      sizes="120px"
                      className="object-cover rounded-full"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="absolute inset-0 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-green-200 text-2xl font-semibold">
                        {(mentee.teenagerFullName || mentee.teenagerEmail || 'M')
                          .trim()
                          .slice(0, 1)
                          .toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-6 md:gap-8 min-w-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                    wrapValue
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Info
                    icon={<CalendarIcon />}
                    label="Date of Birth"
                    value={dateOfBirthDisplay}
                  />
                  <Info
                    icon={<UserIcon width={20} height={20} />}
                    label="Gender"
                    value={mentee.gender}
                  />
                  <Info
                    icon={<HeartIcon />}
                    label="Hobbies"
                    value={mentee.hobbies}
                  />
                  <Info
                    icon={<CourseIcon width={20} height={20} />}
                    label="Class"
                    value={mentee.class}
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <h3 className="text-xl font-semibold text-green-300">
                    Parent Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Info
                      icon={<UserAddIcon />}
                      label="Full Name"
                      value={mentee.parentFullName}
                    />
                    <Info
                      icon={<EmailIcon color="#6CBB01" />}
                      label="Email"
                      value={mentee.parentEmail}
                    />
                    <Info
                      icon={<PhoneIcon color="#6CBB01" />}
                      label="Phone Number"
                      value={mentee.parentPhoneNumber}
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Progress: right-aligned, clearer card */}
            <div className="shrink-0 flex justify-center lg:justify-end">
              <div className="w-full max-w-[240px] rounded-xl border border-[#6CBB0180] bg-[#F7FDF2] p-6 flex flex-col items-center shadow-sm">
                <ProgressGauge percentage={25} />
              </div>
            </div>
          </div>

          {/* Modules */}
          <div className="rounded-lg border border-[#6CBB0180] p-5 md:p-6">
            <h3 className="text-xl md:text-2xl text-green-300 font-semibold mb-4">
              Modules
            </h3>
            <ModulesTable />
          </div>
        </div>
      )}
    </div>
  );
}
