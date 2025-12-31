'use client';
import React from 'react';
import AlertMessage from './AlertMessage';
import { useNetworkError} from '@/hooks/useNetworkError';

interface NetworkErrorAlertProps {
  error: any;
  className?: string;
  showRetryButton?: boolean;
  onRetry?: () => void;
}

const NetworkErrorAlert: React.FC<NetworkErrorAlertProps> = ({
  error,
  className = '',
  showRetryButton = false,
  onRetry
}) => {
  const { networkError, getErrorType, getErrorMessage } = useNetworkError(error);

  if (!networkError) return null;

  const errorType = getErrorType(networkError.status);
  const errorMessage = getErrorMessage(networkError);

  return (
    <div className={className}>
      <AlertMessage
        type={errorType}
        message={errorMessage}
        className="mb-4"
      />
      {showRetryButton && onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default NetworkErrorAlert;
