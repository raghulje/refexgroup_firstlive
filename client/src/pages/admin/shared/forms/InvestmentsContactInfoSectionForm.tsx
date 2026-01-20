import { FormField } from '../FormField';

interface InvestmentsContactInfoSectionFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  errors?: Record<string, string>;
}

export const InvestmentsContactInfoSectionForm = ({
  formData,
  handleInputChange,
  errors = {}
}: InvestmentsContactInfoSectionFormProps) => {
  return (
    <div className="space-y-4">
      <FormField
        label="Text"
        name="text"
        value={formData.text || ''}
        onChange={(value) => handleInputChange('text', value)}
        required
        error={errors.text}
        helpText="Contact information text"
      />
      
      <FormField
        label="Email"
        name="email"
        type="email"
        value={formData.email || ''}
        onChange={(value) => handleInputChange('email', value)}
        required
        error={errors.email}
        helpText="Contact email address"
      />
    </div>
  );
};

