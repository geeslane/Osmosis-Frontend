'use client';

import { DownloadWorkIcon } from '@/assets/icons';
import Image from 'next/image';
import React, { useState } from 'react';
import useDownloadFile from '@/hooks/useDownloadFile';

type WorkbookProps = {
  title?: string;
  workbookFile?: string;
};

export default function Workbook({ title, workbookFile }: WorkbookProps) {
  const { downloadFile } = useDownloadFile();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!workbookFile) return;
    setIsDownloading(true);
    try {
      await downloadFile(workbookFile, 'workbook');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="font-montserrat max-w-[639px] w-full min-w-0 montserrat space-y-10">
      {title && (
        <h3 className="text-green-200 font-bold text-xl md:text-[32px] break-words">
          {title}
        </h3>
      )}
      <div className="flex w-full mx-auto flex-col gap-6 items-center">
        <Image src={'/image/Gradient.png'} alt="" width={360} height={360} />
        {workbookFile ? (
          <button
            type="button"
            onClick={handleDownload}
            disabled={isDownloading}
            className="font-semibold flex items-center gap-2 text-green-100 text-xl hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <DownloadWorkIcon />
            {isDownloading ? 'Downloading…' : 'Download Workbook'}
          </button>
        ) : (
          <p className="text-green-200/70">No workbook file available.</p>
        )}
      </div>
    </div>
  );
}
