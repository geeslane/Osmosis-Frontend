'use client';

import PageTitle from '@/components/PageTitle';
import { useGetProgramConfigQuery, useUpdateProgramConfigMutation, type ProgramConfig } from '@/store/dashboard/dashboard.api';
import useToastify from '@/hooks/useToastify';
import { useState, useEffect } from 'react';

function parseDate(s: string): Date | null {
  if (!s || s.length < 10) return null;
  const d = new Date(s.slice(0, 10));
  return Number.isNaN(d.getTime()) ? null : d;
}

function daysBetween(start: Date, end: Date): number {
  const ms = end.getTime() - start.getTime();
  return Math.max(0, Math.ceil(ms / (24 * 60 * 60 * 1000)));
}

export default function ProgramScheduleContent() {
  const { data: configData, isLoading } = useGetProgramConfigQuery();
  const [updateConfig, { isLoading: isSaving }] = useUpdateProgramConfigMutation();
  const { showToast } = useToastify();

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [numberOfModules, setNumberOfModules] = useState(8);

  const config = configData ?? null;

  useEffect(() => {
    if (config) {
      setStartDate(config.startDate?.slice(0, 10) ?? '');
      setEndDate(config.endDate?.slice(0, 10) ?? '');
      setNumberOfModules(config.numberOfModules ?? 8);
    }
  }, [config]);

  const start = parseDate(startDate);
  const end = parseDate(endDate);
  const durationDays = start && end && end >= start ? daysBetween(start, end) : 0;
  const daysPerModule = numberOfModules > 0 && durationDays > 0
    ? Math.round(durationDays / numberOfModules)
    : 0;
  const isValid = startDate.length >= 10 && endDate.length >= 10 && numberOfModules >= 1 && durationDays > 0;

  const handleSave = async () => {
    if (!isValid) {
      showToast('Please set valid start date, end date, and number of modules.', 'error');
      return;
    }
    if (durationDays <= 0) {
      showToast('End date must be after start date.', 'error');
      return;
    }
    try {
      await updateConfig({
        startDate: startDate.slice(0, 10),
        endDate: endDate.slice(0, 10),
        numberOfModules,
      }).unwrap();
      showToast('Program Schedule saved.', 'success');
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message ?? 'Failed to save Program Schedule.';
      showToast(msg, 'error');
    }
  };

  if (isLoading) {
    return (
      <div>
        <PageTitle title="Program Schedule" />
        <div className="mt-6 flex items-center justify-center py-12 text-gray-500">Loading…</div>
      </div>
    );
  }

  return (
    <div>
      <PageTitle title="Program Schedule" />
      <p className="mt-2 text-sm text-gray-600">
        Set the program start and end dates and number of modules. Each module’s period is calculated as program duration ÷ number of modules.
      </p>

      <div className="mt-8 max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Program start date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-green-200 focus:ring-2 focus:ring-green-200/50"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Program end date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-green-200 focus:ring-2 focus:ring-green-200/50"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Number of modules</label>
            <input
              type="number"
              min={1}
              max={52}
              value={numberOfModules}
              onChange={(e) => setNumberOfModules(Math.max(1, parseInt(e.target.value, 10) || 1))}
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-green-200 focus:ring-2 focus:ring-green-200/50"
            />
          </div>

          {durationDays > 0 && (
            <div className="rounded-xl bg-green-50 border border-green-200/60 p-4">
              <p className="text-sm font-medium text-green-800">
                Program duration: <strong>{durationDays}</strong> days.
              </p>
              <p className="text-sm text-green-700 mt-1">
                Each module period is <strong>{daysPerModule}</strong> days. Good to go?
              </p>
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={!isValid || isSaving}
              className="rounded-xl bg-green-200 text-white px-6 py-2.5 text-sm font-medium disabled:opacity-50 hover:opacity-95"
            >
              {isSaving ? 'Saving…' : 'Save Program Schedule'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
