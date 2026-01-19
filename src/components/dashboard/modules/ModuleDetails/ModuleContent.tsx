'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import Note from './Note';

const NoteView: React.FC = () => (
  <div className=" ">
    <Note />
  </div>
);

/* const NoteView: React.FC = () => (
  <div className="mt-6 ">
    <Mentor />
  </div>
);

const NoteView: React.FC = () => (
  <div className="mt-6">
    <Mentee />
  </div>
); */

export default function ModuleContent() {
  const searchParams = useSearchParams();
  const content = searchParams.get('content') || 'Note';

  switch (content) {
    case 'Note':
      return <NoteView />;
    case 'mentee':
      return <NoteView />;
    case 'admins':
    default:
      return <NoteView />;
  }
}
