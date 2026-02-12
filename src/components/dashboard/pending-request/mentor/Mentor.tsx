'use client';

import { GoBackIcon, LoadingIcon } from '@/assets/icons';
import Empty from '@/components/ui/NotFound/Empty';
import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import MentorTable from './MentorTable';
import MentorDetail from '@/components/common/Details/MentorDetails';
import {
  useGetMentorRequestsQuery,
  useUpdateMentorRequestStatusMutation,
} from '@/store/users/users.api';
import Button from '@/components/ui/button/Button';
import useToastify from '@/hooks/useToastify';
import DeclineModal from '@/components/ui/modal/DeclineModal/DeclineModal';

type MentorPending = {
  id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
  status: string;
  image?: string;
  dateOfBirth: string;
  gender: string;
  occupation: string;
  inspiration: string;
  bio: string;
  linkedinUrl: string;
};

function mapMentorRequestFromApi(apiRequest: any): MentorPending {
  const statusMap: Record<string, string> = {
    PENDING: 'Pending',
    APPROVED: 'Active',
    REJECTED: 'Inactive',
  };
  return {
    id: apiRequest.id,
    name: apiRequest.fullName || '',
    email: apiRequest.email || '',
    address: apiRequest.address || '',
    phone: apiRequest.phoneNumber || '',
    status: statusMap[apiRequest.status] || 'Pending',
    image: apiRequest.pictureUrl || undefined,
    dateOfBirth: apiRequest.dateOfBirth || 'N/A',
    gender: apiRequest.gender || 'N/A',
    occupation: apiRequest.occupation || 'N/A',
    inspiration: apiRequest.inspiration || 'N/A',
    bio: apiRequest.bio || 'N/A',
    linkedinUrl: apiRequest.linkedinUrl || 'N/A',
  };
}

export default function Mentor() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const view = searchParams.get('viewmentor') || 'listmentor';
  const selectedId = searchParams.get('id');

  // Fetch pending mentor requests
  const {
    data: requestsResponse,
    isLoading: isLoadingRequests,
    refetch: refetchRequests,
  } = useGetMentorRequestsQuery({ page: 1, limit: 100, status: 'PENDING' });

  const { showToast } = useToastify();

  const [isProcessing, setIsProcessing] = useState(false);
  const [declineModalOpen, setDeclineModalOpen] = useState(false);
  const [updateRequestStatus] = useUpdateMentorRequestStatusMutation();

  type MentorRequestStatus = 'APPROVED' | 'REJECTED';

  const handleUpdateStatus = async (
    status: MentorRequestStatus,
    reasonForRejection?: string
  ) => {
    if (!selectedDetails?.id) return;
    if (status === 'REJECTED' && !reasonForRejection?.trim()) {
      showToast('Please provide a reason for declining.', 'error');
      return;
    }
    setIsProcessing(true);
    try {
      await updateRequestStatus({
        id: selectedDetails.id,
        data: {
          status,
          ...(status === 'REJECTED' ? { reasonForRejection } : {}),
        },
      }).unwrap();

      showToast(
        status === 'APPROVED'
          ? 'Mentor request approved successfully.'
          : 'Mentor request declined successfully.',
        'success'
      );
      setDeclineModalOpen(false);
      refetchRequests();
      handleBack();
    } catch (error: any) {
      const message = error?.data?.message || 'Failed to update mentor request';
      showToast(message, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const mentorData = requestsResponse?.data?.map(mapMentorRequestFromApi) || [];
  const selectedDetails = selectedId
    ? mentorData.find((a: MentorPending) => a.id === selectedId)
    : null;

  const setParam = (newView: string, id?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('viewmentor', newView);
    if (id) params.set('id', id);
    else params.delete('id');
    router.replace(`?${params.toString()}`);
  };

  const handleBack = () => setParam('listmentor');
  const handleDeclineConfirm = () => {
    setDeclineModalOpen(true);
  };
  if (isLoadingRequests && view === 'listmentor') {
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

  return (
    <div className=" w-full max-w-full">
      {view === 'addmentor' && (
        <div className="max-w-[745px]">
          <div className="flex flex-col gap-8 py-4">
            <div
              onClick={handleBack}
              className="flex  w-20  cursor-pointer  items-center gap-1"
            >
              <GoBackIcon />
              <h3 className="text-sm text-green-200 font-medium">Back</h3>
            </div>
            <h3 className="text-green-200 text-2xl font-bold">Add Mentor</h3>
            <div className="rounded-md border px-4 md:px-[64px] border-green-400 py-5 w-full">
              Add Mentor Incoming Design
            </div>
          </div>
        </div>
      )}

      {view === 'viewmentor' && selectedDetails && (
        <div className="w-full ">
          <div className="flex flex-col gap-8 py-4">
            <div
              onClick={handleBack}
              className="flex cursor-pointer w-20  items-center gap-1"
            >
              <GoBackIcon />
              <h3 className="text-sm text-green-200 font-medium">Back</h3>
            </div>
            <MentorDetail selectedDetails={selectedDetails} />
            <div className="rounded-lg flex max-w-[506px] flex-col  gap-4 border border-[#6CBB0180] px-8  py-8 ">
              <h3 className="text-green-300 font-medium">Request</h3>
              <div className="flex flex-row gap-4">
                <Button
                  onClick={() => handleUpdateStatus('APPROVED')}
                  isLoading={isProcessing}
                  className="bg-green-200 text-white font-semibold  px-8 py-2 flex items-center gap-1 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Accept
                </Button>
                <Button
                  onClick={handleDeclineConfirm}
                  className="bg-red-100 text-white font-semibold  px-8 py-2 flex items-center gap-1 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Decline
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      <DeclineModal
        isOpen={declineModalOpen}
        onConfirm={(reason) => handleUpdateStatus('REJECTED', reason)}
        onCancel={() => setDeclineModalOpen(false)}
        isLoading={isProcessing}
      />

      {view === 'listmentor' && (
        <div className="rounded-md border border-green-400 py-3">
          <div className="flex justify-between px-4 items-center">
            <div className="flex items-center gap-2 text-green-200 text-2xl font-semibold">
              Pending Mentors List
              <span className="bg-[#DCFFAD91] w-[24px] h-[24px] flex justify-center items-center rounded-full text-green-100 text-xs">
                {mentorData.length}
              </span>
            </div>
          </div>

          {mentorData.length === 0 ? (
            <div className="max-w-[400px] mx-auto my-[65px]">
              <Empty
                title="No Mentor for now."
                description="Check Back Later"
              />
            </div>
          ) : (
            <MentorTable
              data={mentorData}
              onAddAdmin={() => setParam('addmentor')}
              onViewAdmin={(admin) => setParam('viewmentor', admin.id)}
              onRefetch={refetchRequests}
            />
          )}
        </div>
      )}
    </div>
  );
}
