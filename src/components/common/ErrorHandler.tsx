'use client';

import { useEffect } from 'react';

/**
 * Global error handler component to catch unhandled promise rejections
 * and prevent them from showing as "[object Event]" errors
 */
export default function ErrorHandler() {
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      // Prevent the default browser error handling
      event.preventDefault();

      // Extract error message from various error types
      let errorMessage = 'An unexpected error occurred';
      
      if (event.reason) {
        const reason = event.reason;
        
        if (reason instanceof Error) {
          errorMessage = reason.message;
        } else if (typeof reason === 'string') {
          errorMessage = reason;
        } else if (reason?.message) {
          errorMessage = reason.message;
        } else if (reason?.data?.message) {
          errorMessage = reason.data.message;
        } else if (reason?.error) {
          errorMessage = typeof reason.error === 'string' ? reason.error : 'An error occurred';
        } else if (typeof reason === 'object') {
          // Try to stringify if it's an object
          try {
            errorMessage = JSON.stringify(reason);
          } catch {
            errorMessage = 'An error occurred';
          }
        }
      }

      // Log to console for debugging (only in development)
      if (process.env.NODE_ENV === 'development') {
        console.error('Unhandled promise rejection:', event.reason);
      }

      // You could also show a toast notification here if needed
      // But for now, we'll just prevent the error from breaking the app
    };

    // Add event listener for unhandled promise rejections
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Cleanup
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return null;
}
