import { useState } from 'react';

interface ExportButtonProps {
  onExport: (format: 'csv' | 'pdf' | 'excel') => void;
  label?: string;
  disabled?: boolean;
}

export const ExportButton = ({ onExport, label = 'Export', disabled = false }: ExportButtonProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleExport = async (format: 'csv' | 'pdf' | 'excel') => {
    try {
      setExporting(true);
      await onExport(format);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export. Please try again.');
    } finally {
      setExporting(false);
      setShowMenu(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        disabled={disabled || exporting}
        className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 disabled:opacity-50 flex items-center gap-2"
      >
        {exporting ? (
          <>
            <i className="ri-loader-4-line animate-spin"></i>
            Exporting...
          </>
        ) : (
          <>
            <i className="ri-download-line"></i>
            {label}
          </>
        )}
        <i className={`ri-arrow-down-s-line transition-transform ${showMenu ? 'rotate-180' : ''}`}></i>
      </button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          ></div>
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
            <button
              onClick={() => handleExport('csv')}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300"
            >
              <i className="ri-file-text-line"></i>
              Export as CSV
            </button>
            <button
              onClick={() => handleExport('excel')}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300"
            >
              <i className="ri-file-excel-line"></i>
              Export as Excel
            </button>
            <button
              onClick={() => handleExport('pdf')}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300"
            >
              <i className="ri-file-pdf-line"></i>
              Export as PDF
            </button>
          </div>
        </>
      )}
    </div>
  );
};

