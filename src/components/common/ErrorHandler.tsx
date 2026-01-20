'use client';

import { useEffect } from 'react';

/**
 * Global error handler component to catch unhandled promise rejections
 * and prevent them from showing as "[object Event]" errors
 */
export default function ErrorHandler() {
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      event.preventDefault();

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
          try {
            errorMessage = JSON.stringify(reason);
            console.log(errorMessage)
          } catch {
            console.error('An error occurred');
          }
        }
      }

      if (process.env.NODE_ENV === 'development') {
        console.error('Unhandled promise rejection:', event.reason);
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return null;
}
