import { FormField } from '../FormField';

interface BusinessCTASectionFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  errors?: Record<string, string>;
}

export const BusinessCTASectionForm = ({
  formData,
  handleInputChange,
  errors = {}
}: BusinessCTASectionFormProps) => {
  return (
    <div className="space-y-4">
      <FormField
        label="Title"
        name="title"
        value={formData.title || ''}
        onChange={(value) => handleInputChange('title', value)}
        required
        error={errors.title}
      />
      
      <FormField
        label="Description"
        name="description"
        type="textarea"
        rows={3}
        value={formData.description || ''}
        onChange={(value) => handleInputChange('description', value)}
        error={errors.description}
      />
      
      <FormField
        label="Button Text"
        name="buttonText"
        value={formData.buttonText || ''}
        onChange={(value) => handleInputChange('buttonText', value)}
        error={errors.buttonText}
      />
      
      <FormField
        label="Button Link"
        name="buttonLink"
        value={formData.buttonLink || ''}
        onChange={(value) => handleInputChange('buttonLink', value)}
        error={errors.buttonLink}
        helpText="URL path (e.g., /contact)"
      />
    </div>
  );
};

