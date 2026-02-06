'use client';
import Button from '@/components/ui/button/Button';
import { ReactNode } from 'react';

type ActionModalProps = {
  isOpen: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  children?: ReactNode; 
};

export default function ActionModal({
  isOpen,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading = false,
  onConfirm,
  onCancel,
  children,
}: ActionModalProps) {
  if (!isOpen) return null;

  return (
    <div
      onClick={onCancel}
      className="fixed inset-0 z-999 flex items-center justify-center bg-black/10 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full mx-3 md:max-w-md rounded-lg bg-white border border-green-100 p-6"
      >
        <h3 className="text-lg font-semibold text-green-100 mb-2">{title}</h3>

        {description && (
          <p className="text-sm text-green-300 mb-4">{description}</p>
        )}

        {children && <div className="mb-6">{children}</div>}

        <div className="flex items-center justify-end gap-3">
          <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
            {cancelText}
          </Button>

          <Button variant="primary" onClick={onConfirm} isLoading={isLoading}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
