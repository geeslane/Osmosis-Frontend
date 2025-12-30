import {
  EmailIcon,
  LocationIcon,
  PhoneIcon,
  UserAddIcon,
} from '@/assets/icons';
import Image from 'next/image';
import React, { useState } from 'react';
import CallHistory from './CallHistory';

export default function MentorDetail({
  selectedAdmin,
}: {
  selectedAdmin: any;
}) {
  const [edit, setEdit] = useState(false);
  const statusStyles: Record<any['status'], string> = {
    Active: 'bg-green-50 text-green-600',
    Inactive: 'bg-[#FEF3F2] text-[#B42318]',
    Pending: 'bg-[#F2F4F7] text-[#282F2E]',
  };
  return (
    <div className=" w-full">
      {edit ? (
        <div>
          <div className="  w-full">
            <CallHistory />
          </div>
        </div>
      ) : (
        <div>
          <div className="flex gap-[37px]  flex-col">
            <div className="flex justify-between ">
              <h3 className="text-green-200 text-3xl font-bold">
                Mentor Details
              </h3>
              <button
                onClick={() => setEdit(true)}
                className="font-medium flex items-center justify-center px-8 rounded-xl gap-2 bg-[#DCFFAD91]"
              >
                <h3 className="hidden font-medium text-green-300 md:flex ">
                  View Call History
                </h3>
                <PhoneIcon color={'#002825'} />
              </button>
            </div>
            <div className="rounded-lg flex flex-col md:flex-row gap-10 border border-[#6CBB0180] px-10 md:px-[64px] py-8 space-y-2">
              <div className="w-[120px] h-[120px] rounded-full">
                <Image
                  src={selectedAdmin.image}
                  alt="Adminimage"
                  width={100}
                  height={100}
                  className="rounded-full w-full h-full object-contain mr-3"
                />
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
                      <p className="text-green-300 text-sm font-medium">
                        Email
                      </p>
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
                        {selectedAdmin.phone}
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
                    <p className="text-green-300 text-sm font-medium">
                      Occupation
                    </p>
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
                      Mentors are inspired by a mix of altruism and
                      self-interest, driven by the joy of seeing others grow,
                      paying forward the guidance they received, staying
                      relevant in their field, and gaining fulfillment from
                      sharing wisdom, making a real impact, and strengthening
                      their own leadership skills. Many feel a deep sense of
                      satisfaction in helping someone navigate challenges and
                      reach their potential, creating a positive ripple effect. {' '}
                    </p>
                  </div>
                </div>
                <div className="w-full  ">
                  <div className="flex flex-col  gap-4">
                    <p className="text-green-300 text-sm font-medium">
                      Mentor’s Bio{' '}
                    </p>
                    <p className="text-green-200  font-medium">
                      I have a passion for health and wellness, and educating
                      people on the benefits of taking control of their own
                      health. I would like to become an expert and throught
                      leader on marketing in this space, as well as continue
                      along my own personal journey towards optimal health,
                      sharing what I learn.
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
          </div>
        </div>
      )}
    </div>
  );
}
