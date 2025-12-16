'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { UploadFileIcon } from '@/assets/icons';

export interface FileUploadProps {
  label?: string;
  accept?: string;
  maxSizeMB?: number;
  widthHint?: string;
  onFileSelect: (file: File | null) => void;
  disabled?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  label = 'Picture',
  accept = 'image/png,image/jpeg',
  maxSizeMB = 5,
  widthHint = '800×400px',
  onFileSelect,
  disabled = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (file: File | null) => {
    if (!file) {
      onFileSelect(null);
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File must be less than ${maxSizeMB}MB`);
      return;
    }

    setError(null);
    setPreview(URL.createObjectURL(file));
    onFileSelect(file);
  };

  return (
    <div className="flex flex-col gap-2 font-montserrat">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      {preview ? (
        <Image
          src={preview}
          alt="Preview"
          width={200}
          height={100}
          className="rounded-md object-cover"
        />
      ) : (
        <>
          <div
            onClick={() => inputRef.current?.click()}
            className={`flex flex-col items-center justify-center gap-2 cursor-pointer rounded-lg border border-dashed border-[#C2E6F2] bg-[#F1F9FC] px-6 py-10 text-center transition  ${
              disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <UploadFileIcon />
            <p className="text-sm text-[#2699BF] font-medium">
              Click to upload or drag and drop
            </p>

            <p className="text-xs text-gray-500">
              {accept.replace(/image\//g, '').toUpperCase()} · {widthHint}
            </p>
          </div>
        </>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        disabled={disabled}
        hidden
        onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
      />

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default FileUpload;
