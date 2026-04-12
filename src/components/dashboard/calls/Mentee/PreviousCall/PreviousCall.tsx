'use client';
import React, { useState } from 'react';
import PreviousCallTable from './PreviousCallTable';
import ViewCall from './ViewCall';
import type { PreviousCallRow } from '@/utils/mapCallApi';

export default function PreviousCall() {
  const [selectedCall, setSelectedCall] = useState<PreviousCallRow | null>(null);
  return (
    <div>
      {selectedCall ? (
        <ViewCall call={selectedCall} onBack={() => setSelectedCall(null)} />
      ) : (
        <PreviousCallTable onView={(row) => setSelectedCall(row)} />
      )}
    </div>
  );
}
