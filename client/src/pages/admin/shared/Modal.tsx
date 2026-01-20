import { useEffect, type ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  footer?: ReactNode;
  showCloseButton?: boolean;
  twoColumn?: boolean; // Enable two-column layout for forms with many fields
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  footer,
  showCloseButton = true,
  twoColumn = false
}: ModalProps) => {
  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-3xl',
    lg: 'max-w-5xl',
    xl: 'max-w-7xl',
    full: 'max-w-[95vw]'
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-gray-900/50 backdrop-blur-md transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] animate-fadeIn"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-2 sm:p-4">
        <div
          className={`relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 w-full max-w-[95vw] sm:max-w-none ${sizeClasses[size]} transform transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] animate-slideUp`}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200/80 dark:border-gray-700/80 bg-gradient-to-r from-gray-50/80 to-white/80 dark:from-gray-800/80 dark:to-gray-800/80 backdrop-blur-sm rounded-t-3xl">
            <h3 id="modal-title" className="text-base font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Close modal"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            )}
          </div>

          {/* Content */}
          <div className={`p-5 sm:p-6 bg-white dark:bg-gray-800 max-h-[calc(100vh-140px)] overflow-y-auto custom-scrollbar ${twoColumn ? 'min-h-[50vh]' : 'min-h-[50vh]'}`}>
            {twoColumn ? (
              <div className="two-column-form-wrapper">
                {children}
              </div>
            ) : (
              children
            )}
          </div>

          {/* Footer */}
          {footer && (
            <div className="px-6 py-4 border-t border-gray-200/80 dark:border-gray-700/80 bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-b-3xl">
              {footer}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { 
            opacity: 0;
          }
          to { 
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(24px) scale(0.96);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes slideDown {
          from { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          to { 
            opacity: 0;
            transform: translateY(24px) scale(0.96);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .animate-slideUp {
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .animate-slideDown {
          animation: slideDown 0.3s cubic-bezier(0.4, 0, 1, 1);
        }
        /* Two-column form layout - applies grid to form's direct children */
        .two-column-form-wrapper form > div:first-child,
        .two-column-form-wrapper > div:first-child {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.625rem 1.5rem;
          align-items: start;
        }
        @media (min-width: 1024px) {
          .two-column-form-wrapper form > div:first-child,
          .two-column-form-wrapper > div:first-child {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.625rem 1.5rem;
            align-items: start;
          }
          /* Ensure labels align at the top */
          .two-column-form-wrapper form > div:first-child > div,
          .two-column-form-wrapper > div:first-child > div {
            display: flex;
            flex-direction: column;
          }
          /* Full-width items (textareas, image uploads, etc.) */
          .two-column-form-wrapper form > div:first-child > .col-span-full,
          .two-column-form-wrapper > div:first-child > .col-span-full {
            grid-column: 1 / -1;
          }
        }
        /* Custom scrollbar styling */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.3);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.5);
        }
      `}</style>
    </div>
  );
};

