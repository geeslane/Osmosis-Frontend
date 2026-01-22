import {
  EmailIcon,
  LocationIcon,
  PhoneIcon,
  UserAddIcon,
} from '@/assets/icons';
import Image from 'next/image';
import React from 'react';

export default function AdminDetail({ selectedAdmin }: { selectedAdmin: any }) {
  const statusStyles: Record<any['status'], string> = {
    Active: 'bg-green-50 text-green-600',
    Inactive: 'bg-[#FEF3F2] text-[#B42318]',
    Pending: 'bg-[#F2F4F7] text-[#282F2E]',
  };
  return (
    <div className="max-w-[748px] w-full">
    
        <div className="flex gap-[37px]  flex-col">
          <div className="flex justify-between ">
            <h3 className="text-green-200 text-3xl font-bold">Admin Details</h3>
          </div>
          <div className="rounded-lg flex flex-col md:flex-row gap-10 border border-[#6CBB0180] px-10 md:px-[64px] py-8 space-y-2">
            <div className="w-[90px] h-[90px] rounded-full">
              <Image
                src={selectedAdmin.image}
                alt="Adminimage"
                width={100}
                height={100}
                className="rounded-full w-full h-full object-cover mr-3"
              />
            </div>
            <div className="space-y-6">
              <div className="flex gap-4">
                <UserAddIcon />
                <div className="flex flex-col gap-1">
                  <p className="text-green-300 text-sm font-medium">FullName</p>
                  <p className="text-green-300  font-medium">
                    {selectedAdmin.name}
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <EmailIcon color={'#6CBB01'} />
                <div className="flex flex-col gap-1">
                  <p className="text-green-300 text-sm font-medium">Email</p>
                  <p className="text-green-300  font-medium">
                    {selectedAdmin.email}
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
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
              <div className="flex gap-4">
                <LocationIcon color={'#6CBB01'} />
                <div className="flex flex-col gap-1">
                  <p className="text-green-300 text-sm font-medium">
                    Address/Location
                  </p>
                  <p className="text-green-300  font-medium">
                    {selectedAdmin.phone}
                  </p>
                </div>
              </div>
              <div className="ml-8">
                <p>
                  <strong className="text-green-300 font-medium text-sm">
                    Status:
                  </strong>{' '}
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      statusStyles[selectedAdmin.status]
                    }`}
                  >
                    {selectedAdmin.status}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
