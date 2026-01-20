import { useEffect, useState } from 'react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationToastProps {
  message: string;
  type: NotificationType;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export const NotificationToast = ({
  message,
  type,
  isVisible,
  onClose,
  duration = 3000
}: NotificationToastProps) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const typeStyles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  const icons = {
    success: 'ri-checkbox-circle-line',
    error: 'ri-error-warning-line',
    warning: 'ri-alert-line',
    info: 'ri-information-line'
  };

  return (
    <div className="fixed bottom-4 right-4 z-[9999] animate-slideInRight">
      <div className={`flex items-start gap-3 px-5 py-3.5 rounded-xl border shadow-2xl ${typeStyles[type]} min-w-[320px] max-w-md backdrop-blur-sm`}>
        <i className={`${icons[type]} text-xl flex-shrink-0 mt-0.5`}></i>
        <div className="flex-1">
          {message.includes('\n') ? (
            <div className="space-y-1 text-sm">
              {message.split('\n').map((line, index) => (
                <p key={index} className={index === 0 ? 'font-medium' : 'text-xs'}>{line}</p>
              ))}
            </div>
          ) : (
            <p className="text-sm font-medium leading-relaxed">{message}</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-current opacity-70 hover:opacity-100 transition-opacity flex-shrink-0 p-1 rounded hover:bg-black/5"
          aria-label="Close notification"
        >
          <i className="ri-close-line text-base"></i>
        </button>
      </div>
      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(calc(100% + 1rem));
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slideInRight {
          animation: slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
};

// Hook for managing notifications
export const useNotification = () => {
  const [notification, setNotification] = useState<{
    message: string;
    type: NotificationType;
    isVisible: boolean;
  }>({
    message: '',
    type: 'info',
    isVisible: false
  });

  const showNotification = (message: string, type: NotificationType = 'info') => {
    setNotification({ message, type, isVisible: true });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  };

  return {
    notification,
    showNotification,
    hideNotification
  };
};

