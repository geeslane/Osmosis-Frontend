'use client';

import {
  EmailIcon,
  LocationIcon,
  PhoneIcon,
  UserAddIcon,
} from '@/assets/icons';
import Button from '@/components/ui/button/Button';
import Image from 'next/image';
import { useUpdateMentorRequestStatusMutation } from '@/store/users/users.api';
import useToastify from '@/hooks/useToastify';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { normalizeImageUrl } from '@/utils/helper';
import DeclineModal from '@/components/ui/modal/DeclineModal/DeclineModal';

export default function MentorDetail({
  selectedAdmin,
  onRefetch,
}: {
  selectedAdmin: any;
  onRefetch?: () => void;
}) {
  const { showToast } = useToastify();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const [declineModalOpen, setDeclineModalOpen] = useState(false);
  const [updateRequestStatus] = useUpdateMentorRequestStatusMutation();

  const navigateBackToList = () => {
    // Preserve the role tab parameter when navigating back
    const role = searchParams.get('role') || 'mentor';
    const params = new URLSearchParams();
    params.set('role', role);
    params.set('viewmentor', 'listmentor');
    router.replace(`/dashboard/pending-requests?${params.toString()}`);
  };

  const handleAccept = async () => {
    if (!selectedAdmin?.id) return;
    setIsProcessing(true);
    try {
      await updateRequestStatus({
        id: selectedAdmin.id,
        data: { status: 'APPROVED' },
      }).unwrap();
      showToast('Mentor request approved. They have been added to Osmosis and can be found in the Users section.', 'success');
      // Refetch the list to update the UI
      onRefetch?.();
      navigateBackToList();
    } catch (error: any) {
      const message = error?.data?.message || 'Failed to approve request';
      showToast(message, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeclineClick = () => {
    setDeclineModalOpen(true);
  };

  const handleDeclineConfirm = async (reason: string) => {
    if (!selectedAdmin?.id) return;
    setIsProcessing(true);
    setDeclineModalOpen(false);
    try {
      await updateRequestStatus({
        id: selectedAdmin.id,
        data: { status: 'REJECTED', reasonForRejection: reason },
      }).unwrap();
      showToast('Mentor request declined successfully', 'success');
      // Refetch the list to update the UI
      onRefetch?.();
      navigateBackToList();
    } catch (error: any) {
      const message = error?.data?.message || 'Failed to decline request';
      showToast(message, 'error');
    } finally {
      setIsProcessing(false);
    }
  };
  const statusStyles: Record<any['status'], string> = {
    Active: 'bg-green-50 text-green-600',
    Inactive: 'bg-[#FEF3F2] text-[#B42318]',
    Pending: 'bg-[#F2F4F7] text-[#282F2E]',
  };
  return (
    <div className=" w-full">
      <div className="flex gap-[37px]  flex-col">
        <div className="flex justify-between ">
          <h3 className="text-green-200 text-3xl font-bold">Mentor Details</h3>
        </div>
        <div className="rounded-lg flex flex-col md:flex-row gap-10 border border-[#6CBB0180] px-10 md:px-[64px] py-8 space-y-2">
          <div className="relative w-[140px] h-[120px] rounded-full overflow-hidden">
            {selectedAdmin.image ? (
              <Image
                src={normalizeImageUrl(selectedAdmin.image) || '/image/Avatar.png'}
                alt="Mentor image"
                fill
                className="object-cover rounded-full"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-white text-2xl font-semibold">
                  {(selectedAdmin.name || selectedAdmin.email || 'U')
                    .split(' ')
                    .map((word: string) => word[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)}
                </span>
              </div>
            )}
          </div>
          <div className="w-full space-y-20 ">
            <div className="flex flex-col md:flex-row md:gap-10 w-full space-y-6">
              <div className="flex flex-col  gap-4">
                <UserAddIcon />
                <div className="flex flex-col -mt-1 gap-1">
                  <p className="text-green-300 text-sm font-medium">
                    Full Name
                  </p>
                  <p className="text-green-200  font-medium">
                    {selectedAdmin.name}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <EmailIcon color={'#6CBB01'} />
                <div className="flex flex-col gap-1">
                  <p className="text-green-300 text-sm font-medium">Email</p>
                  <p className="text-green-300  font-medium  truncate">
                    {selectedAdmin.email}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <PhoneIcon color={'#6CBB01'} />
                <div className="flex flex-col gap-1">
                  <p className="text-green-300 text-sm font-medium">
                    Phone Number
                  </p>
                  <p className="text-green-300  font-medium">
                    {selectedAdmin.phone}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <LocationIcon color={'#6CBB01'} />
                <div className="flex flex-col gap-1">
                  <p className="text-green-300 text-sm font-medium">
                    Address/Location
                  </p>
                  <p className="text-green-300  font-medium">
                    {selectedAdmin.address || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:gap-10 space-y-6 ">
              <div className="flex flex-col gap-4">
                <p className="text-green-300 text-sm font-medium">
                  Date of Birth
                </p>
                <p className="text-green-200  font-medium">
                  30th October, 1980
                </p>
              </div>

              <div className="flex flex-col  gap-4">
                <p className="text-green-300 text-sm font-medium">Gender</p>
                <p className="text-green-200  font-medium">Male</p>
              </div>
              <div className="flex flex-col  gap-4">
                <p className="text-green-300 text-sm font-medium">Occupation</p>
                <p className="text-green-200  font-medium">Builder</p>
              </div>
              <div className="flex flex-col  gap-4">
                <p className="text-green-300 font-medium text-sm">Status</p>{' '}
                <span
                  className={`rounded-full max-w-[100px] px-3 py-1 text-xs font-medium ${
                    statusStyles[selectedAdmin.status]
                  }`}
                >
                  {selectedAdmin.status}
                </span>
              </div>
            </div>
            <div className="w-full  ">
              <div className="flex flex-col  gap-4">
                <p className="text-green-300 text-sm font-medium">
                  What inspire you to be a teens mentor?
                </p>
                <p className="text-green-200  font-medium">
                  Mentors are inspired by a mix of altruism and self-interest,
                  driven by the joy of seeing others grow, paying forward the
                  guidance they received, staying relevant in their field, and
                  gaining fulfillment from sharing wisdom, making a real impact,
                  and strengthening their own leadership skills. Many feel a
                  deep sense of satisfaction in helping someone navigate
                  challenges and reach their potential, creating a positive
                  ripple effect. {' '}
                </p>
              </div>
            </div>
            <div className="w-full  ">
              <div className="flex flex-col  gap-4">
                <p className="text-green-300 text-sm font-medium">
                  Mentor’s Bio{' '}
                </p>
                <p className="text-green-200  font-medium">
                  I have a passion for health and wellness, and educating people
                  on the benefits of taking control of their own health. I would
                  like to become an expert and throught leader on marketing in
                  this space, as well as continue along my own personal journey
                  towards optimal health, sharing what I learn.
                </p>
              </div>
            </div>
            <div className="w-full space-y-6 ">
              <div className="flex flex-col  gap-4">
                <p className="text-green-300 text-sm font-medium">
                  Mentorship Topics of Interest{' '}
                </p>
                <p className="text-green-200  font-medium">
                  Career and Development
                </p>
              </div>
              <div className="flex w-full flex-col  gap-4">
                <p className="text-green-300 text-sm font-medium">
                  LinkedIn URL{' '}
                </p>
                <a
                  href="#"
                  className="text-green-200 break-all  font-medium w-[200px] md:w-full h-full  "
                >
                  https://www.linkedin.com/in/emmanuel-adegbola/{' '}
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-lg flex max-w-[506px] flex-col  gap-4 border border-[#6CBB0180] px-8  py-8 ">
          <h3 className="text-green-300 font-medium">Request</h3>
          <div className="flex flex-row gap-4">
            <Button
              onClick={handleAccept}
              disabled={isProcessing}
              className="bg-green-200 text-white font-semibold  px-8 py-2 flex items-center gap-1 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Accept
            </Button>
            <Button
              onClick={handleDeclineClick}
              disabled={isProcessing}
              className="bg-red-100 text-white font-semibold  px-8 py-2 flex items-center gap-1 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Decline
            </Button>
          </div>
        </div>
      </div>
      <DeclineModal
        isOpen={declineModalOpen}
        onConfirm={handleDeclineConfirm}
        onCancel={() => setDeclineModalOpen(false)}
        isLoading={isProcessing}
      />
    </div>
  );
}
