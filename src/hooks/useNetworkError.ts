import { useMemo } from 'react';

export interface NetworkError {
  status?: number;
  data?: any;
  message?: string;
}

export const useNetworkError = (error: any) => {
  const networkError = useMemo(() => {
    if (!error) return null;

    // Handle RTK Query errors
    if (error.status) {
      return {
        status: error.status,
        data: error.data,
        message: error.data?.message || 'An error occurred while fetching data'
      };
    }

    // Handle Axios errors
    if (error.response) {
      return {
        status: error.response.status,
        data: error.response.data,
        message: error.response.data?.message || 'Network request failed'
      };
    }

    // Handle network errors (no internet, timeout, etc.)
    if (error.request) {
      return {
        status: 0,
        data: null,
        message: 'No internet connection. Please check your network and try again.'
      };
    }

    // Handle other errors
    return {
      status: undefined,
      data: null,
      message: error.message || 'An unexpected error occurred'
    };
  }, [error]);

  const getErrorType = (status?: number): 'error' | 'warning' | 'info' => {
    if (!status) return 'error';
    
    if (status >= 500) return 'error';      // Server errors
    if (status >= 400) return 'warning';    // Client errors
    if (status >= 300) return 'info';       // Redirects
    return 'info';
  };

  const getErrorMessage = (error: NetworkError): string => {
    if (!error) return 'An error occurred';

    // Custom messages based on status codes
    switch (error.status) {
      case 0:
        return 'No internet connection. Please check your network and try again.';
      case 400:
        return 'Bad request. Please check your input and try again.';
      case 401:
        return 'You are not authorized to access this resource. Please log in again.';
      case 403:
        return 'Access forbidden. You don\'t have permission to view this content.';
      case 404:
        return 'The requested resource was not found.';
      case 408:
        return 'Request timeout. Please try again.';
      case 429:
        return 'Too many requests. Please wait a moment and try again.';
      case 500:
        return 'Internal server error. Please try again later.';
      case 502:
        return 'Bad gateway. Please try again later.';
      case 503:
        return 'Service unavailable. Please try again later.';
      case 504:
        return 'Gateway timeout. Please try again later.';
      default:
        return error.message || 'An error occurred while processing your request.';
    }
  };

  return {
    networkError,
    getErrorType,
    getErrorMessage,
    hasError: !!networkError
  };
};
