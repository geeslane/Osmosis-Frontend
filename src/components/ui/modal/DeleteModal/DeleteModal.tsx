'use client';
import Button from '@/components/ui/button/Button';

type DeleteModalProps = {
  isOpen: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function DeleteModal({
  isOpen,
  title = 'Delete item',
  description = 'This action cannot be undone. Are you sure you want to proceed?',
  isLoading = false,
  onConfirm,
  onCancel,
}: DeleteModalProps) {
  return (
    <div>
      {isOpen && (
        <div className="fixed inset-0 h-screen overflow-x-hidden z-999 flex items-center justify-center bg-black/10 backdrop-blur-sm">
          <div className="w-full mx-3 md:max-w-md rounded-lg bg-white border border-green-100 p-6">
            <h3 className="text-lg font-semibold text-green-100 mb-2">
              {title}
            </h3>

            <p className="text-sm text-green-300 mb-6">{description}</p>
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
                onClick={onConfirm}
                isLoading={isLoading}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
