'use client';

import { AddsIcon, GoBackIcon } from '@/assets/icons';
import Button from '@/components/ui/button/Button';
import Empty from '@/components/ui/NotFound/Empty';
import React, { useState } from 'react';
import AddModule from './AddModule';
import ModuleList from './ModuleList';

export default function Modules() {
  const [hasLiveSession] = useState(true);
  const [addLiveSession, setAddLiveSession] = useState(false);

  return (
    <div className="my-10">
      {addLiveSession ? (
        <div className="space-y-9">
          <div className="flex cursor-pointer items-center gap-1">
            <GoBackIcon />
            <h3 className="text-sm text-green-200 font-medium">Back</h3>{' '}
          </div>
          <h3 className="text-green-200 text-2xl font-bold">Add Module</h3>

          <div className="rounded-md max-w-[747px] px-4 md:px-[64px] border-2 border-[#6CBB0180] py-8 w-full">
            <AddModule />
          </div>
        </div>
      ) : (
        <div className=" border border-[#DCFFAD] rounded-lg px-2 md:px-6 py-5">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2 text-green-200 text-2xl font-semibold">
              Module
              <span className="bg-[#DCFFAD91] w-[59px] h-[24px] flex justify-center items-center rounded-full text-green-100 text-xs">
                0 items
              </span>
            </div>

            <Button
              variant="primary"
              className="font-medium flex gap-1"
              onClick={() => setAddLiveSession(true)}
            >
              <AddsIcon />
              <h3 className="hidden md:flex">Add Module</h3>
            </Button>
          </div>

          {!hasLiveSession ? (
            <Empty
              title="No Module for now."
              description="Click Add Module to have a list."
              imageSrc="/image/emp.png"
              imageAlt="Empty chat"
              imageWidth={320}
              imageHeight={320}
            />
          ) : (
            <div className="mt-6">
              <ModuleList />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
