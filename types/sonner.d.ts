declare module 'sonner' {
  export interface ToastOptions {
    description?: string;
    action?: {
      label: string;
      onClick: () => void;
    };
    cancel?: {
      label: string;
      onClick?: () => void;
    };
    duration?: number;
    id?: string | number;
    onDismiss?: (toast: any) => void;
    onAutoClose?: (toast: any) => void;
  }

  export interface Toast {
    (message: string, options?: ToastOptions): string | number;
    success: (message: string, options?: ToastOptions) => string | number;
    error: (message: string, options?: ToastOptions) => string | number;
    info: (message: string, options?: ToastOptions) => string | number;
    warning: (message: string, options?: ToastOptions) => string | number;
    loading: (message: string, options?: ToastOptions) => string | number;
    promise: <T>(
      promise: Promise<T>,
      options: {
        loading?: string;
        success?: string | ((data: T) => string);
        error?: string | ((error: any) => string);
      }
    ) => Promise<T>;
    custom: (jsx: React.ReactNode, options?: ToastOptions) => string | number;
    dismiss: (id?: string | number) => void;
    message: (message: string, options?: ToastOptions) => string | number;
  }

  const toast: Toast;
  export default toast;
  export { toast };
}

