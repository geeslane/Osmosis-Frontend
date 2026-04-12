'use client';
import {
  CalendarIcon,
  CourseIcon,
  EmailIcon,
  HeartIcon,
  LinkedinIcon,
  LocationIcon,
  NoteIcon,
  PhoneIcon,
  UserAddIcon,
  UserIcon,
} from '@/assets/icons';
import { Info } from '@/components/common/Details/Info';
import Image from 'next/image';
import { useState } from 'react';
import { formatDate, normalizeImageUrl } from '@/utils/helper';

export default function MentorDetail({
  selectedDetails,
}: {
  selectedDetails: any;
  className?: string;
}) {
  const [imageError, setImageError] = useState(false);
  const statusStyles: Record<string, string> = {
    Active: 'bg-green-50 text-green-600',
    Inactive: 'bg-[#FEF3F2] text-[#B42318]',
    Pending: 'bg-[#F2F4F7] text-[#282F2E]',
  };
  return (
    <div className="w-full">
      <div className="rounded-lg flex flex-col md:flex-row gap-6 md:gap-8 border border-[#6CBB0180] px-6 md:px-10 lg:px-16 py-6">
        <div className="shrink-0 flex justify-center md:justify-start">
          <div className="relative w-[120px] h-[120px] rounded-full overflow-hidden bg-green-100/30 shrink-0">
            {(selectedDetails?.image || selectedDetails?.pictureUrl) &&
            !imageError ? (
              <Image
                src={
                  normalizeImageUrl(
                    selectedDetails?.image || selectedDetails?.pictureUrl
                  ) || '/image/Avatar.png'
                }
                alt="Mentor"
                fill
                sizes="120px"
                className="object-cover rounded-full"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="absolute inset-0 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-200 text-2xl font-semibold">
                  {(selectedDetails?.name || selectedDetails?.email || 'U')
                    .split(' ')
                    .map((word: string) => word[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-6 min-w-0">
          {/* Status */}
          <div className="flex items-center gap-2">
            <p className="text-green-300 text-sm font-medium">Status</p>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                statusStyles[selectedDetails?.status] ||
                'bg-[#F2F4F7] text-[#282F2E]'
              }`}
            >
              {selectedDetails?.status}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Info
              icon={<UserAddIcon />}
              label="Full Name"
              value={selectedDetails?.name || selectedDetails?.fullName}
            />
            <Info
              icon={<EmailIcon color="#6CBB01" />}
              label="Email"
              value={selectedDetails?.email}
            />
            <Info
              icon={<PhoneIcon color="#6CBB01" />}
              label="Phone Number"
              value={selectedDetails?.phone || selectedDetails?.phoneNumber}
            />
            <Info
              icon={<LocationIcon color="#6CBB01" />}
              label="Address / Location"
              value={selectedDetails?.address}
              wrapValue
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Info
              icon={<CalendarIcon />}
              label="Date of Birth"
              value={formatDate(selectedDetails?.dateOfBirth) || undefined}
            />
            <Info
              icon={<UserIcon width={20} height={20} />}
              label="Gender"
              value={selectedDetails?.gender}
            />
            <Info
              icon={<CourseIcon width={20} height={20} />}
              label="Occupation"
              value={selectedDetails?.occupation}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Info
              icon={<CourseIcon width={20} height={20} />}
              label="Mentorship Topics of Interest"
              value={
                selectedDetails?.topics ||
                selectedDetails?.topicsOfInterest ||
                (Array.isArray(selectedDetails?.mentorshipTopics)
                  ? selectedDetails.mentorshipTopics.join(', ')
                  : selectedDetails?.mentorshipTopics)
              }
            />
            <div className="flex items-start gap-3 min-w-0">
              <span className="shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-[#DCFFAD91] text-[#6CBB01] [&_svg]:w-5 [&_svg]:h-5">
                <LinkedinIcon />
              </span>
              <div className="min-w-0 space-y-0.5 flex-1">
                <p className="text-green-300 text-sm font-medium">
                  LinkedIn URL
                </p>
                {selectedDetails?.linkedinUrl ? (
                  <a
                    href={selectedDetails?.linkedinUrl}
                    className="text-green-200 font-medium break-all hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {selectedDetails?.linkedinUrl}
                  </a>
                ) : (
                  <p className="text-green-200 font-medium">—</p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Info
              icon={<HeartIcon />}
              label="What inspires you to be a teens mentor?"
              value={selectedDetails?.inspiration}
              wrapValue
            />
            <Info
              icon={<NoteIcon />}
              label="Mentor's Bio"
              value={selectedDetails?.bio}
              wrapValue
            />
          </div>
        </div>
      </div>
    </div>
  );
}
