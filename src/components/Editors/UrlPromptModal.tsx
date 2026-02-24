'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Button from '@/components/ui/button/Button';
import { useUploadFileMutation } from '@/store/dashboard/dashboard.api';

export type UrlPromptType = 'link' | 'image' | 'youtube';

type UrlPromptModalProps = {
  isOpen: boolean;
  type: UrlPromptType;
  initialValue?: string;
  onConfirm: (url: string) => void;
  onCancel: () => void;
  /** For type "link": when true, allow submitting empty to remove the link */
  allowEmpty?: boolean;
};

const CONFIG: Record<
  UrlPromptType,
  { title: string; placeholder: string; submitLabel: string; hint?: string }
> = {
  link: {
    title: 'Insert link',
    placeholder: 'https://example.com',
    submitLabel: 'Insert link',
    hint: 'Paste or type the URL for the link.',
  },
  image: {
    title: 'Insert image',
    placeholder: 'https://your-cdn.com/image.jpg',
    submitLabel: 'Insert image',
    hint: 'Upload from your device or paste an image URL.',
  },
  youtube: {
    title: 'Embed YouTube video',
    placeholder: 'https://www.youtube.com/watch?v=...',
    submitLabel: 'Embed video',
    hint: 'Paste a YouTube or youtu.be link. The video will be embedded at the cursor.',
  },
};

const IMAGE_ACCEPT = 'image/jpeg,image/png,image/gif,image/webp,image/svg+xml';
const MAX_IMAGE_MB = 5;

export default function UrlPromptModal({
  isOpen,
  type,
  initialValue = '',
  onConfirm,
  onCancel,
  allowEmpty = false,
}: UrlPromptModalProps) {
  const [value, setValue] = useState(initialValue);
  const [imageTab, setImageTab] = useState<'upload' | 'url'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();
  const config = CONFIG[type];
  const canSubmitUrl = allowEmpty || value.trim().length > 0;
  const isImageType = type === 'image';

  useEffect(() => {
    if (isOpen) {
      setValue(initialValue);
      setImageTab('upload');
      setSelectedFile(null);
      setUploadError(null);
    }
  }, [isOpen, initialValue]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadError(null);
    if (!file) {
      setSelectedFile(null);
      return;
    }
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      setUploadError(`Image must be under ${MAX_IMAGE_MB} MB`);
      setSelectedFile(null);
      e.target.value = '';
      return;
    }
    if (!file.type.startsWith('image/')) {
      setUploadError('Please choose an image file (e.g. JPEG, PNG, WebP)');
      setSelectedFile(null);
      e.target.value = '';
      return;
    }
    setSelectedFile(file);
    e.target.value = '';
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
    setUploadError(null);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      setUploadError(`Image must be under ${MAX_IMAGE_MB} MB`);
      return;
    }
    if (!file.type.startsWith('image/')) {
      setUploadError('Please drop an image file (e.g. JPEG, PNG, WebP)');
      return;
    }
    setSelectedFile(file);
  };

  const handleUploadAndInsert = async (e?: React.FormEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (!selectedFile) return;
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      const res = await uploadFile({
        formData,
        folder: 'uploads',
        resourceType: 'image',
      }).unwrap();
      const url =
        (res as { url?: string })?.url ??
        (res as { data?: { url?: string } })?.data?.url;
      if (url) {
        onConfirm(url);
        setSelectedFile(null);
      } else {
        setUploadError('Upload succeeded but no URL returned.');
      }
    } catch (err: any) {
      const message =
        err?.data?.message || err?.message || 'Upload failed. Try again.';
      setUploadError(message);
    }
  };

  if (!isOpen) return null;

  const renderBody = () => {
    if (isImageType) {
      return (
        <div className="p-6 space-y-4">
          {/* Tabs */}
          <div className="flex rounded-lg bg-gray-100 p-1">
            <button
              type="button"
              onClick={() => setImageTab('upload')}
              className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                imageTab === 'upload'
                  ? 'bg-white text-[#282F2E] shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Upload from device
            </button>
            <button
              type="button"
              onClick={() => setImageTab('url')}
              className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                imageTab === 'url'
                  ? 'bg-white text-[#282F2E] shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Use URL
            </button>
          </div>

          {imageTab === 'upload' ? (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Choose an image
              </label>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
                  isDragging
                    ? 'border-green-300 bg-green-50/50'
                    : 'border-gray-200 bg-gray-50/50 hover:border-gray-300'
                }`}
              >
                <input
                  type="file"
                  accept={IMAGE_ACCEPT}
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
                  aria-label="Choose image file"
                />
                {selectedFile ? (
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-sm font-medium text-[#282F2E]">
                      {selectedFile.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedFile(null);
                      }}
                      className="text-sm text-green-200 hover:text-green-300 underline"
                    >
                      Choose a different file
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="mx-auto w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-200 mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-600">
                      Drag and drop an image here, or click to browse
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      JPEG, PNG, WebP, GIF, SVG · max {MAX_IMAGE_MB} MB
                    </p>
                  </>
                )}
              </div>
              {uploadError && (
                <p className="text-sm text-red-600" role="alert">
                  {uploadError}
                </p>
              )}
              <div className="flex items-center justify-end gap-3">
                <Button type="button" variant="secondary" onClick={onCancel}>
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  disabled={!selectedFile || isUploading}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleUploadAndInsert(e);
                  }}
                >
                  {isUploading ? 'Uploading…' : 'Upload & insert'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <label htmlFor="url-input" className="block text-sm font-medium text-gray-700">
                Image URL
              </label>
              <input
                id="url-input"
                type="url"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (value.trim()) {
                      onConfirm(value.trim());
                      setValue('');
                    }
                  }
                }}
                placeholder={config.placeholder}
                className="w-full rounded-lg border border-gray-200 bg-gray-50/80 px-4 py-3 text-[#282F2E] placeholder:text-gray-400 focus:border-green-300 focus:outline-none focus:ring-2 focus:ring-green-200/40 transition-colors"
                autoFocus
                autoComplete="url"
              />
              <div className="flex items-center justify-end gap-3">
                <Button type="button" variant="secondary" onClick={onCancel}>
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  disabled={!value.trim()}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (value.trim()) {
                      onConfirm(value.trim());
                      setValue('');
                    }
                  }}
                >
                  {config.submitLabel}
                </Button>
              </div>
            </div>
          )}
        </div>
      );
    }

    // Link / YouTube: single URL input (no form – prevents parent form submit)
    const submitUrl = (e?: React.FormEvent) => {
      e?.preventDefault();
      e?.stopPropagation();
      if (!canSubmitUrl) return;
      onConfirm(value.trim());
      setValue('');
    };
    return (
      <div className="p-6">
        <label htmlFor="url-input" className="sr-only">
          URL
        </label>
        <input
          id="url-input"
          type="url"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              submitUrl();
            }
          }}
          placeholder={config.placeholder}
          className="w-full rounded-lg border border-gray-200 bg-gray-50/80 px-4 py-3 text-[#282F2E] placeholder:text-gray-400 focus:border-green-300 focus:outline-none focus:ring-2 focus:ring-green-200/40 transition-colors"
          autoFocus
          autoComplete="url"
        />

        <div className="flex items-center justify-between gap-3 mt-5">
          <div>
            {type === 'link' && initialValue ? (
              <Button
                type="button"
                variant="secondary"
                className="!text-red-600 hover:!bg-red-50"
                onClick={() => {
                  onConfirm('');
                  setValue('');
                }}
              >
                Remove link
              </Button>
            ) : null}
          </div>
          <div className="flex items-center gap-3">
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              disabled={!canSubmitUrl}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                submitUrl();
              }}
            >
              {config.submitLabel}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/20 backdrop-blur-[2px] p-4"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="url-modal-title"
    >
      <div
        className="w-full max-w-md rounded-xl bg-white shadow-xl border border-green-200/60 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-[#DCFFAD]/40 to-[#F8FAFC] px-6 py-4 border-b border-green-100">
          <h3
            id="url-modal-title"
            className="text-lg font-semibold text-[#282F2E]"
          >
            {config.title}
          </h3>
          {config.hint && (
            <p className="text-sm text-gray-500 mt-1">{config.hint}</p>
          )}
        </div>

        {renderBody()}
      </div>
    </div>
  );

  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : null;
}
