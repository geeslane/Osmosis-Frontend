'use client';
import React, { useState } from 'react';
import PreviousCallTable from './PreviousCallTable';
import ViewCall from './ViewCall';

export default function PreviousCall() {
  const [view, setView] = useState(false);
  return (
    <div>
      {view ? (
        <ViewCall onBack={() => setView(false)} />
      ) : (
        <PreviousCallTable onView={() => setView(true)} />
      )}
    </div>
  );
}
