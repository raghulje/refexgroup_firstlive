import { ReactNode } from 'react';

interface TwoColumnFormProps {
  children: ReactNode;
}

/**
 * Wrapper component to display form fields in a two-column layout
 * Use this for forms with many fields to make them more compact
 */
export const TwoColumnForm = ({ children }: TwoColumnFormProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-2.5 items-start">
      {children}
    </div>
  );
};

