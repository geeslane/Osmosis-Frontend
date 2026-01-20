'use client';
import { useState, useEffect } from 'react';
import Button from '@/components/ui/button/Button';

type DeclineModalProps = {
  isOpen: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  defaultReason?: string;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
};

export default function DeclineModal({
  isOpen,
  title = 'Decline Request',
  description = 'Please provide a reason for declining this request.',
  isLoading = false,
  defaultReason = 'The request does not meet our current requirements.',
  onConfirm,
  onCancel,
}: DeclineModalProps) {
  const [reason, setReason] = useState(defaultReason);

  // Reset reason when modal opens
  useEffect(() => {
    if (isOpen) {
      setReason(defaultReason);
    }
  }, [isOpen, defaultReason]);

  const handleConfirm = () => {
    if (reason.trim()) {
      onConfirm(reason.trim());
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 h-screen overflow-x-hidden z-999 flex items-center justify-center bg-black/10 backdrop-blur-sm">
      <div className="w-full mx-3 md:max-w-md rounded-lg bg-white border border-green-100 p-6">
        <h3 className="text-lg font-semibold text-green-100 mb-2">
          {title}
        </h3>

        <p className="text-sm text-green-300 mb-4">{description}</p>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-green-300 mb-2">
            Reason for Rejection
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter reason for rejection..."
            className="w-full px-3 py-2 border border-[#D0D5DD] rounded-md text-sm text-green-200 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-transparent resize-none"
            rows={4}
            disabled={isLoading}
            required
          />
        </div>

        <div className="flex items-center justify-end gap-3">
          <Button
            variant="secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>

          <Button
            variant="primary"
            onClick={handleConfirm}
            isLoading={isLoading}
            disabled={!reason.trim()}
          >
            Decline
          </Button>
        </div>
      </div>
    </div>
  );
}
