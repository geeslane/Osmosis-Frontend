'use client';

import React, { useMemo } from 'react';
import { FieldError, Merge, FieldErrorsImpl } from 'react-hook-form';

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'));

type Meridian = 'AM' | 'PM';

export interface TimePickerProps {
  value?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  label?: string;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
  disabled?: boolean;
}

function parseTimeValue(value: string | undefined): {
  hour: number;
  minute: string;
  meridian: Meridian;
} {
  if (!value || typeof value !== 'string' || value.trim() === '') {
    return { hour: 12, minute: '00', meridian: 'AM' };
  }
  const trimmed = value.trim();
  const match = trimmed.match(/^(\d{1,2})\s*:\s*(\d{2})\s*(AM|PM)?$/i);
  if (match) {
    let hour24 = parseInt(match[1], 10);
    const minute = match[2].padStart(2, '0');
    const hasPm = (match[3] ?? '').toUpperCase() === 'PM';
    if (match[3] !== undefined) {
      if (hasPm && hour24 !== 12) hour24 += 12;
      if (!hasPm && hour24 === 12) hour24 = 0;
    }
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const meridian: Meridian = hour24 >= 12 ? 'PM' : 'AM';
    return { hour: hour12, minute, meridian };
  }
  const [h, m] = trimmed.split(':').map((s) => s.trim());
  const hNum = h ? Math.min(12, Math.max(1, parseInt(h, 10) || 12)) : 12;
  const mNum = m !== undefined ? Math.min(59, Math.max(0, parseInt(m, 10) || 0)) : 0;
  const minute = String(mNum).padStart(2, '0');
  return { hour: hNum, minute, meridian: 'AM' };
}

function formatOutput(hour: number, minute: string, meridian: Meridian): string {
  const h = String(hour).padStart(2, '0');
  const m = minute.padStart(2, '0');
  return `${h}:${m} ${meridian}`;
}

const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  onBlur,
  label = 'Time',
  error,
  disabled = false,
}) => {
  const { hour, minute, meridian } = useMemo(() => parseTimeValue(value), [value]);

  const handleHourChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const h = parseInt(e.target.value, 10);
    onChange(formatOutput(h, minute, meridian));
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const m = e.target.value;
    onChange(formatOutput(hour, m, meridian));
  };

  const handleMeridianChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const m = e.target.value as Meridian;
    onChange(formatOutput(hour, minute, m));
  };

  const baseSelectClass =
    'flex-1 min-w-0 text-sm bg-transparent focus:outline-none focus:ring-0 appearance-none cursor-pointer font-montserrat';
  const wrapperClass = `flex font-montserrat montserrat flex-col gap-1`;
  const containerClass = `flex items-center h-[56px] border rounded-lg overflow-hidden focus-within:border-green-300 focus-within:outline-none ${
    error ? 'border-red-500' : 'border-green-300'
  }`;

  return (
    <div className={wrapperClass}>
      {label && (
        <label className="text-green-300 font-medium">{label}</label>
      )}
      <div className={containerClass}>
        <div className="flex flex-1 items-center divide-x divide-green-300/50">
          <div className="relative flex-1 flex items-center min-w-0">
            <select
              value={hour}
              onChange={handleHourChange}
              onBlur={onBlur}
              disabled={disabled}
              aria-label="Hour"
              className={`${baseSelectClass} pl-3 pr-8 py-3`}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2386efac'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.5rem center',
                backgroundSize: '1.25rem',
              }}
            >
              {HOURS.map((h) => (
                <option key={h} value={h}>
                  {String(h).padStart(2, '0')}
                </option>
              ))}
            </select>
          </div>
          <div className="relative flex-1 flex items-center min-w-0">
            <select
              value={minute}
              onChange={handleMinuteChange}
              onBlur={onBlur}
              disabled={disabled}
              aria-label="Minute"
              className={`${baseSelectClass} pl-3 pr-8 py-3`}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2386efac'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.5rem center',
                backgroundSize: '1.25rem',
              }}
            >
              {MINUTES.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-shrink-0 w-[5.5rem]">
            <select
              value={meridian}
              onChange={handleMeridianChange}
              onBlur={onBlur}
              disabled={disabled}
              aria-label="AM/PM"
              className={`${baseSelectClass} w-full pl-3 pr-8 py-3 font-semibold text-green-300`}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2386efac'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.5rem center',
                backgroundSize: '1.25rem',
              }}
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>
        </div>
      </div>
      {typeof error?.message === 'string' && (
        <p className="text-red-500 text-xs mt-1">{error.message}</p>
      )}
    </div>
  );
};

export default TimePicker;
