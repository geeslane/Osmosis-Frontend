// @/components/form/FileUpload.tsx
import { CVS } from '@/assets/icons';
import React, { useState } from 'react';
import { UseFormRegister, FieldError } from 'react-hook-form';

interface FileUploadProps {
  label: string;
  name: string;
  register: UseFormRegister<any>;
  error?: FieldError;
  accept?: string;
  maxSize?: number; // in MB
  labelClassName?: string;
  containerClassName?: string;
}

export default function FileUpload({
  label,
  name,
  register,
  error,
  accept = '.pdf',
  maxSize = 10,
  labelClassName,
  containerClassName,
}: FileUploadProps) {
  const [fileName, setFileName] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setFileName(file.name);
      // Create a new FileList-like object
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      const input = document.getElementById(name) as HTMLInputElement;
      if (input) {
        input.files = dataTransfer.files;
        // Trigger change event
        const event = new Event('change', { bubbles: true });
        input.dispatchEvent(event);
      }
    }
  };

  return (
    <div
      className={`flex flex-col font-montserrat montserrat gap-2 border-[#282F2E] rounded-lg border p-6 max-w-[448px] ${containerClassName ?? ''}`}
    >
      <label
        className={`text-base font-medium text-[#282F2E] ${labelClassName ?? ''}`}
      >
        {label}
      </label>

      <div
        className={`border-2 bg-[#DCFFAD91] border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? 'border-[#DCFFAD91] bg-[#DCFFAD91]'
            : error
              ? 'border-red-300 bg-red-50'
              : 'border-[#DCFFAD91] bg[#DCFFAD91]'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center gap-2">
          <CVS />

          <div>
            <p className=" text-green-300 font-medium">
              Drag & drop or click to choose files
            </p>
            <p className="text-xs text-green-300 font-medium mt-1">
              Max file size {maxSize}MB
            </p>
          </div>

          <input
            id={name}
            type="file"
            accept={accept}
            className="hidden"
            {...register(name, {
              onChange: handleFileChange,
            })}
          />

          <label
            htmlFor={name}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
          >
            Choose File
          </label>

          {fileName && (
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-700">
              <svg
                className="w-5 h-5 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">{fileName}</span>
            </div>
          )}
        </div>
      </div>

      {error && <span className="text-sm text-red-600">{error.message}</span>}
    </div>
  );
}
