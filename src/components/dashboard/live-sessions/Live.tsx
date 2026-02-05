'use client';

import { AddsIcon, GoBackIcon, SearchIcon } from '@/assets/icons';
import Button from '@/components/ui/button/Button';
import Empty from '@/components/ui/NotFound/Empty';
import React, { useState } from 'react';
import AddLive from './AddLive';
import LiveTable from './LiveTable';

export default function Live() {
  const [hasLiveSession] = useState(true);
  const [addLiveSession, setAddLiveSession] = useState(false);
  const [search, setSearch] = useState('');

  return (
    <div className="mb-10 mt-5">
      {addLiveSession ? (
        <div className="space-y-9">
          <div
            onClick={() => setAddLiveSession(false)}
            className="flex cursor-pointer items-center gap-1"
          >
            <GoBackIcon />
            <h3 className="text-sm text-green-200 font-medium">Back</h3>{' '}
          </div>
          <h3 className="text-green-200 text-2xl font-bold">
            Add Live Session
          </h3>

          <div className="rounded-md max-w-[747px] px-4 md:px-[64px] border-2 border-[#6CBB0180] py-8 w-full">
            <AddLive />
          </div>
        </div>
      ) : (
        <div className=" border border-[#DCFFAD] rounded-lg px-2 md:px-6 py-5">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2 text-green-200 text-2xl font-semibold">
              Live Sessions
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
              <h3 className="hidden md:flex">Add Live Session</h3>
            </Button>
          </div>

          <div className="w-full flex items-center justify-center mt-6 mb-6">
            <div className="relative flex items-center py-3 rounded-lg gap-2 bg-[#DCFFAD91] px-2 w-full md:max-w-[60%]">
              <SearchIcon className="absolute left-3 text-gray-400 pointer-events-none" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by topic or speaker"
                className="w-full text-sm h-full pl-8 focus:outline-none bg-transparent"
              />
            </div>
          </div>

          {!hasLiveSession ? (
            <Empty
              title="No Live Session for now."
              description="Click Add Live Session to have a list."
              imageSrc="/image/emp.png"
              imageAlt="Empty chat"
              imageWidth={320}
              imageHeight={320}
            />
          ) : (
            <div className="mt-2">
              <LiveTable search={search} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
