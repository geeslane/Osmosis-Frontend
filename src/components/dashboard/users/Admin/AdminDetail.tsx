'use client';
import {
  EmailIcon,
  GoBackIcon,
  LoadingIcon,
  LocationIcon,
  PhoneIcon,
  UserAddIcon,
} from '@/assets/icons';
import { DetailRow } from '@/components/common/Details/DetailRow';
import PageTitle from '@/components/PageTitle';
import { useGetAdminByIdQuery } from '@/store/users/users.api';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';

export default function AdminDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data, isLoading, isError } = useGetAdminByIdQuery(id);

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
  if (isError || !data?.data?.data) return <p>Failed to load admin</p>;

  const admin = data.data.data;

  /*  const statusStyles: Record<any['status'], string> = {
    Active: 'bg-green-50 text-green-600',
    Inactive: 'bg-[#FEF3F2] text-[#B42318]',
    Pending: 'bg-[#F2F4F7] text-[#282F2E]',
  }; */
  return (
    <div className="max-w-[748px] py-4 flex flex-col gap-8 w-full">
      <div
        onClick={() => router.push('/dashboard/users?role=admins')}
        className="flex cursor-pointer items-center gap-1"
      >
        <GoBackIcon />
        <h3 className="text-sm text-green-200 font-medium">Back</h3>
      </div>
      <PageTitle title={admin.role} />
      <div className="flex gap-[37px] flex-col">
        <h3 className="text-green-200 text-3xl font-bold">Admin Details</h3>

        <div className="rounded-lg flex flex-col md:flex-row gap-10 border border-[#6CBB0180] px-10 md:px-[64px] py-8">
          <div className="w-[90px] h-[90px] rounded-full">
            {admin.pictureUrl ? (
              <Image
                src={admin.pictureUrl}
                alt={admin.fullName}
                width={90}
                height={90}
                className="rounded-full w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-green-100 flex items-center justify-center text-white font-bold text-2xl">
                {admin.fullName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <DetailRow
              icon={<UserAddIcon />}
              label="Full Name"
              value={admin.fullName}
            />
            <DetailRow
              icon={<EmailIcon color="#6CBB01" />}
              label="Email"
              value={admin.email}
            />
            <DetailRow
              icon={<PhoneIcon color="#6CBB01" />}
              label="Phone Number"
              value={admin.phoneNumber}
            />
            <DetailRow
              icon={<LocationIcon color="#6CBB01" />}
              label="Address"
              value={admin.address}
            />

            <div className="ml-8">
              <p className="text-green-300 font-medium text-sm">
                Role:{' '}
                <span className="rounded-full px-3 py-1 text-xs bg-green-50 text-green-600">
                  {admin.role}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Small reusable row */
