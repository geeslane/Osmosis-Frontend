'use client';

import React from 'react';
import { CalendarIcon, GoogleIcon } from '@/assets/icons';
import Button from '@/components/ui/button/Button';
import { GOOGLE_CALENDAR_COPY } from '@/utils/googleCalendarAvailability';

type Props = {
  googleCalendarConnected: boolean;
  googleCalendarSynced: boolean;
  onConnect: () => void;
  onSync: () => void;
  isAuthUrlLoading?: boolean;
  isSyncing?: boolean;
};

export default function GoogleCalendarAvailabilityPanel({
  googleCalendarConnected,
  googleCalendarSynced,
  onConnect,
  onSync,
  isAuthUrlLoading = false,
  isSyncing = false,
}: Props) {
  const wrapperClass =
    'space-y-4 rounded-xl border border-green-200/60 bg-white p-6 shadow-sm';

  if (!googleCalendarConnected) {
    return (
      <div className={wrapperClass}>
        <h3 className="text-base font-semibold text-green-200">Google Calendar</h3>
        <p className="text-sm text-gray-600">{GOOGLE_CALENDAR_COPY.disconnected}</p>
        <Button
          type="button"
          variant="secondary"
          onClick={onConnect}
          isLoading={isAuthUrlLoading}
          leftIcon={<GoogleIcon />}
          className="flex w-fit items-center gap-2"
        >
          Connect Google Calendar
        </Button>
      </div>
    );
  }

  if (!googleCalendarSynced) {
    return (
      <div className={wrapperClass}>
        <h3 className="text-base font-semibold text-green-200">Google Calendar</h3>
        <p className="text-sm text-gray-600">{GOOGLE_CALENDAR_COPY.finishSetup}</p>
        <Button
          type="button"
          variant="secondary"
          onClick={onSync}
          isLoading={isSyncing}
          leftIcon={<GoogleIcon />}
          className="flex w-fit items-center gap-2"
        >
          Verify Google Calendar
        </Button>
      </div>
    );
  }

  return (
    <div className={wrapperClass}>
      <div className="flex items-start gap-2 text-green-200">
        <CalendarIcon />
        <div>
          <p className="text-base font-semibold">{GOOGLE_CALENDAR_COPY.connectedTitle}</p>
          <p className="mt-1 text-sm text-gray-600">{GOOGLE_CALENDAR_COPY.connectedSubtitle}</p>
        </div>
      </div>
      <Button
        type="button"
        variant="secondary"
        onClick={onSync}
        isLoading={isSyncing}
        leftIcon={<GoogleIcon />}
        className="flex w-fit items-center gap-2"
      >
        Re-sync calendar
      </Button>
    </div>
  );
}
