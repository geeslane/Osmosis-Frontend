import { toast, ToastOptions, Id } from 'react-toastify';
import { useCallback, useRef } from 'react';
import 'react-toastify/dist/ReactToastify.css';

type ToastType = 'success' | 'error' | 'info' | 'warning' | 'default';

interface UseToastifyReturn {
  showToast: (message: string, type?: ToastType, options?: ToastOptions) => Id;
  dismiss: () => void;
}

const useToastify = (): UseToastifyReturn => {
  const activeToastIdRef = useRef<Id | null>(null);

  const dismissActiveToast = useCallback((): void => {
    if (activeToastIdRef.current !== null) {
      toast.dismiss(activeToastIdRef.current);
      activeToastIdRef.current = null;
    }
  }, []);

  const showToast = useCallback(
    (
      message: string,
      type: ToastType = 'default',
      options: ToastOptions = {}
    ): Id => {
      const toastOptions: ToastOptions = {
        position: 'top-right',
        autoClose: 4000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        ...options,
      };

      dismissActiveToast();

      const toastHandlers: Record<
        ToastType,
        (msg: string, opts?: ToastOptions) => Id
      > = {
        success: toast.success,
        error: toast.error,
        info: toast.info,
        warning: toast.warning,
        default: toast,
      };

      const toastHandler = toastHandlers[type];
      const toastId = toastHandler(message, toastOptions);
      activeToastIdRef.current = toastId;
      return toastId;
    },
    [dismissActiveToast]
  );

  const dismiss = useCallback((): void => {
    dismissActiveToast();
  }, [dismissActiveToast]);

  return {
    showToast,
    dismiss,
  };
};

export default useToastify;
