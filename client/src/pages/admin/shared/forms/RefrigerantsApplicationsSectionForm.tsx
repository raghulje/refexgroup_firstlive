import { FormField } from '../FormField';

interface RefrigerantsApplicationsSectionFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  errors?: Record<string, string>;
}

export const RefrigerantsApplicationsSectionForm = ({
  formData,
  handleInputChange,
  errors = {}
}: RefrigerantsApplicationsSectionFormProps) => {
  return (
    <div className="space-y-4">
      <FormField
        label="Heading"
        name="heading"
        value={formData.heading || ''}
        onChange={(value) => handleInputChange('heading', value)}
        error={errors.heading}
      />

      <FormField
        label="Description"
        name="description"
        type="textarea"
        rows={6}
        value={formData.description || ''}
        onChange={(value) => handleInputChange('description', value)}
        error={errors.description}
      />
    </div>
  );
};

