import React, { createContext, useContext, useState, useCallback } from 'react';
import { FiCheck, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';
import { cn } from '../../../utils';


interface Toast {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  toast: (toast: Omit<Toast, 'id'>) => void;
  success: (toast: Omit<Toast, 'id' | 'type'>) => void;
  error: (toast: Omit<Toast, 'id' | 'type'>) => void;
  warning: (toast: Omit<Toast, 'id' | 'type'>) => void;
  info: (toast: Omit<Toast, 'id' | 'type'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const toast = {
  success: (props: Omit<Toast, 'id' | 'type'>) => {
    // This will be replaced by the actual implementation
    console.log('Toast success:', props);
  },
  error: (props: Omit<Toast, 'id' | 'type'>) => {
    console.log('Toast error:', props);
  },
  warning: (props: Omit<Toast, 'id' | 'type'>) => {
    console.log('Toast warning:', props);
  },
  info: (props: Omit<Toast, 'id' | 'type'>) => {
    console.log('Toast info:', props);
  },
};

const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const addToast = useCallback((toastData: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const toast: Toast = {
      id,
      ...toastData,
      duration: toastData.duration || 5000,
    };

    setToasts(prev => [...prev, toast]);

    if (toast.duration) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration);
    }
  }, [removeToast]);

  const contextValue: ToastContextType = {
    toasts,
    toast: addToast,
    success: (props) => addToast({ ...props, type: 'success' }),
    error: (props) => addToast({ ...props, type: 'error' }),
    warning: (props) => addToast({ ...props, type: 'warning' }),
    info: (props) => addToast({ ...props, type: 'info' }),
    removeToast,
  };

  // Update the global toast object
  toast.success = contextValue.success;
  toast.error = contextValue.error;
  toast.warning = contextValue.warning;
  toast.info = contextValue.info;

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <Toaster />
    </ToastContext.Provider>
  );
};

const Toaster: React.FC = () => {
  const { toasts, removeToast } = useToast();

  const getIcon = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return <FiCheck className="h-5 w-5" />;
      case 'error':
        return <FiAlertCircle className="h-5 w-5" />;
      case 'warning':
        return <FiAlertCircle className="h-5 w-5" />;
      case 'info':
        return <FiInfo className="h-5 w-5" />;
    }
  };

  const getBgColor = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
    }
  };

  const getTextColor = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return 'text-green-800';
      case 'error':
        return 'text-red-800';
      case 'warning':
        return 'text-yellow-800';
      case 'info':
        return 'text-blue-800';
    }
  };

  const getIconColor = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      case 'warning':
        return 'text-yellow-500';
      case 'info':
        return 'text-blue-500';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'w-80 md:w-96 rounded-lg border p-4 shadow-lg transition-all duration-300 animate-in slide-in-from-right',
            getBgColor(toast.type)
          )}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className={cn('mt-0.5', getIconColor(toast.type))}>
                {getIcon(toast.type)}
              </div>
              <div className="flex-1">
                <h4 className={cn('font-semibold', getTextColor(toast.type))}>
                  {toast.title}
                </h4>
                {toast.description && (
                  <p className={cn('mt-1 text-sm', getTextColor(toast.type))}>
                    {toast.description}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className={cn(
                'ml-4 rounded p-1 hover:bg-black/10 transition-colors',
                getTextColor(toast.type)
              )}
            >
              <FiX className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export { Toaster, ToastProvider };