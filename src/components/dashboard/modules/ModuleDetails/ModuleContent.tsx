'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import Note from './Note';
import Workbook from './Workbook';

const NoteView: React.FC = () => (
  <div className=" w-full ">
    <Note />
  </div>
);

const WorkbookView: React.FC = () => (
  <div className="w-full">
    <Workbook />
  </div>
);


export default function ModuleContent() {
  const searchParams = useSearchParams();
  const content = searchParams.get('content') || 'Note';

  switch (content) {
    case 'Note':
      return <NoteView />;
    case 'Workbook':
      return <WorkbookView />;
    case 'admins':
    default:
      return <NoteView />;
  }
}
