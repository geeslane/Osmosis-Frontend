'use client';
import React, { useMemo, useState } from 'react';
import Button from '@/components/ui/button/Button';
import useToastify from '@/hooks/useToastify';
import {
  useCreateCallRequestMutation,
  useLiveSessionTopicsQuery,
  useMentorAvailableSlotsQuery,
  useMentorsForBookingQuery,
} from '@/store/dashboard/dashboard.api';
import { useRouter } from 'next/navigation';

function pickArray(payload: any): any[] {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  if (Array.isArray(payload?.data?.data?.data)) return payload.data.data.data;
  return [];
}

export default function CreateSchedule() {
  const router = useRouter();
  const { showToast } = useToastify();
  const [topic, setTopic] = useState('');
  const [mentorId, setMentorId] = useState('');
  const [date, setDate] = useState<string>(() => {
    const d = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${mm}-${dd}`;
  });
  const [slotId, setSlotId] = useState('');

  const { data: topicsData, isLoading: isLoadingTopics } =
    useLiveSessionTopicsQuery();
  const topics = useMemo(() => pickArray(topicsData), [topicsData]);

  const { data: mentorsData, isLoading: isLoadingMentors } =
    useMentorsForBookingQuery(
      { topic, status: 'ACTIVE', page: 1, limit: 50 },
      { skip: !topic }
    );
  const mentors = useMemo(() => pickArray(mentorsData), [mentorsData]);

  const { data: slotsData, isLoading: isLoadingSlots } =
    useMentorAvailableSlotsQuery(
      { mentorId, date },
      { skip: !mentorId || !date }
    );
  const slots = useMemo(() => pickArray(slotsData), [slotsData]);

  const [createRequest, { isLoading: isCreating }] =
    useCreateCallRequestMutation();

  const selectedSlot = useMemo(() => {
    return slots.find((s: any) => String(s?.id ?? s?._id ?? s?.slotId) === slotId);
  }, [slots, slotId]);

  return (
    <div className="mt-10 space-y-8">
      <h3 className="text-2xl md:text-[32px] font-bold text-green-200">
        Schedule a Call with Mentor
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[900px]">
        <div className="space-y-2">
          <label htmlFor="topic" className="text-green-300 font-medium">
            Select Topic
          </label>
          <div className="w-full text-[#98A2B3] rounded-md px-2 h-[36px] border border-green-300">
            <select
              id="topic"
              name="topic"
              value={topic}
              onChange={(e) => {
                setTopic(e.target.value);
                setMentorId('');
                setSlotId('');
              }}
              className="w-full text-sm focus:outline-none border-0 h-full bg-transparent"
            >
              <option value="" disabled>
                {isLoadingTopics ? 'Loading topics…' : 'Select Topic'}
              </option>
              {topics.map((t: any) => {
                const value = String(t?.value ?? t?.name ?? t);
                const label = String(t?.label ?? t?.name ?? t);
                return (
                  <option key={value} value={value}>
                    {label}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="date" className="text-green-300 font-medium">
            Select Date
          </label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setSlotId('');
            }}
            className="w-full rounded-md px-2 h-[36px] border border-green-300 text-sm focus:outline-none"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-green-300 font-medium">Available Mentors</label>
          <div className="rounded-lg border border-[#6CBB0180] p-4">
            {topic ? (
              isLoadingMentors ? (
                <p className="text-sm text-green-200/70">Loading mentors…</p>
              ) : mentors.length === 0 ? (
                <p className="text-sm text-green-200/70">
                  No mentors available for this topic.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {mentors.map((m: any) => {
                    const id = String(m?.id ?? m?._id ?? '');
                    const name =
                      m?.fullName ?? m?.mentorFullName ?? m?.name ?? 'Mentor';
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => {
                          setMentorId(id);
                          setSlotId('');
                        }}
                        className={`text-left rounded-lg border px-3 py-3 transition-colors ${
                          mentorId === id
                            ? 'border-green-200 bg-[#DCFFAD91]'
                            : 'border-green-100 hover:bg-[#DCFFAD91]/60'
                        }`}
                      >
                        <p className="text-green-200 font-semibold">{name}</p>
                        {m?.occupation && (
                          <p className="text-xs text-green-200/70">{m.occupation}</p>
                        )}
                      </button>
                    );
                  })}
                </div>
              )
            ) : (
              <p className="text-sm text-green-200/70">Choose a topic first.</p>
            )}
          </div>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-green-300 font-medium">Available Slots</label>
          <div className="rounded-lg border border-[#6CBB0180] p-4">
            {mentorId ? (
              isLoadingSlots ? (
                <p className="text-sm text-green-200/70">Loading slots…</p>
              ) : slots.length === 0 ? (
                <p className="text-sm text-green-200/70">
                  No available slots for this date.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {slots.map((s: any) => {
                    const id = String(s?.id ?? s?._id ?? s?.slotId ?? '');
                    const label =
                      s?.label ??
                      (s?.startTime && s?.endTime
                        ? `${s.startTime} - ${s.endTime}`
                        : s?.time ?? 'Slot');
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setSlotId(id)}
                        className={`rounded-full px-4 py-2 text-sm border transition-colors ${
                          slotId === id
                            ? 'border-green-200 bg-[#DCFFAD91] text-green-200'
                            : 'border-green-100 hover:bg-[#DCFFAD91]/60 text-green-200'
                        }`}
                      >
                        {String(label)}
                      </button>
                    );
                  })}
                </div>
              )
            ) : (
              <p className="text-sm text-green-200/70">Select a mentor first.</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          variant="primary"
          disabled={!topic || !mentorId || !slotId || isCreating}
          isLoading={isCreating}
          onClick={async () => {
            try {
              await createRequest({
                mentorId,
                topic,
                date,
                slot: selectedSlot ?? { id: slotId },
              }).unwrap();
              showToast('Call request submitted', 'success');
              router.push('/dashboard/calls/mentor?role=upcoming');
            } catch (err: any) {
              showToast(err?.data?.message || 'Failed to create call request', 'error');
            }
          }}
        >
          Request call
        </Button>
      </div>
    </div>
  );
}
