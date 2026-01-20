import { FormField } from '../FormField';

interface CareersKnowMoreFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  errors?: Record<string, string>;
}

export const CareersKnowMoreForm = ({
  formData,
  handleInputChange,
  errors = {}
}: CareersKnowMoreFormProps) => {
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
        helpText="Internal path (e.g., /about-refex) or external URL"
      />
    </div>
  );
};

