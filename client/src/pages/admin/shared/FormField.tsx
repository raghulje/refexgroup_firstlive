import type { ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'textarea' | 'number' | 'email' | 'url' | 'date' | 'select' | 'file' | 'checkbox' | 'color';
  value: any;
  onChange: (value: any) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  helpText?: string;
  options?: { value: string; label: string }[];
  rows?: number;
  accept?: string;
  children?: ReactNode;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
}

export const FormField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  helpText,
  options,
  rows = 4,
  accept,
  children,
  disabled = false,
  min,
  max,
  step
}: FormFieldProps) => {
  const baseInputClasses = `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 ${error
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
    : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
    } ${disabled
      ? 'bg-gray-50 dark:bg-gray-800 cursor-not-allowed opacity-60'
      : 'bg-gray-50/50 hover:bg-white focus:bg-white dark:bg-gray-800/50 dark:hover:bg-gray-800 dark:focus:bg-gray-800'
    } text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-sm`;

  return (
    <div className="mb-2.5 flex flex-col">
      <label htmlFor={name} className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1.5 h-5 flex items-center">
        {label}
        {required && <span className="text-red-500 dark:text-red-400 ml-1">*</span>}
      </label>

      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          rows={rows}
          disabled={disabled}
          className={`${baseInputClasses} resize-y`}
        />
      ) : type === 'select' ? (
        <div className="relative">
          <select
            id={name}
            name={name}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            required={required}
            className={`${baseInputClasses} appearance-none`}
            disabled={disabled}
          >
            <option value="">Select {label}</option>
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-400">
            <i className="ri-arrow-down-s-line text-lg"></i>
          </div>
        </div>
      ) : type === 'checkbox' ? (
        <label className="flex items-center p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer group">
          <input
            id={name}
            name={name}
            type="checkbox"
            checked={value || false}
            onChange={(e) => onChange(e.target.checked)}
            className="w-4 h-4 text-blue-600 dark:text-blue-500 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:bg-gray-700 transition-all"
          />
          <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
            {placeholder || label}
          </span>
        </label>
      ) : type === 'file' ? (
        <div className="relative group">
          <input
            id={name}
            name={name}
            type="file"
            accept={accept}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onChange(file);
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className={`p-2.5 border-2 border-dashed rounded-lg transition-all ${error
            ? 'border-red-300 bg-red-50 dark:bg-red-900/10'
            : 'border-gray-300 hover:border-blue-500 bg-gray-50 hover:bg-blue-50/50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700'
            }`}>
            <div className="flex items-center justify-center gap-2 text-center">
              <i className="ri-upload-cloud-2-line text-lg text-gray-400 group-hover:text-blue-500 transition-colors"></i>
              <span className="text-xs font-medium text-gray-600 dark:text-gray-300 group-hover:text-blue-600 transition-colors">
                {value && typeof value === 'string' ? 'File selected' : 'Click to upload'}
              </span>
            </div>
          </div>
          {value && typeof value === 'string' && (
            <div className="mt-2 relative inline-block">
              <img src={value} alt="Preview" className="w-20 h-20 object-cover rounded-lg shadow-sm border border-gray-200 dark:border-gray-700" />
            </div>
          )}
        </div>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          className={`${baseInputClasses}`}
        />
      )}

      {error && (
        <p className="mt-1 text-xs text-red-500 font-medium flex items-center gap-1">
          <i className="ri-error-warning-line text-xs"></i>
          {error}
        </p>
      )}
      {helpText && !error && (
        <p className="mt-1 text-xs text-gray-400">{helpText}</p>
      )}
      {children}
    </div>
  );
};

