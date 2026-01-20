import { FormField } from '../FormField';

interface RefrigerantsBreakingGroundsSectionFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  errors?: Record<string, string>;
}

export const RefrigerantsBreakingGroundsSectionForm = ({
  formData,
  handleInputChange,
  errors = {}
}: RefrigerantsBreakingGroundsSectionFormProps) => {
  return (
    <div className="space-y-4">
      <FormField
        label="Title"
        name="title"
        value={formData.title || ''}
        onChange={(value) => handleInputChange('title', value)}
        error={errors.title}
      />

      <FormField
        label="Background Color"
        name="backgroundColor"
        value={formData.backgroundColor || '#1e5a8e'}
        onChange={(value) => handleInputChange('backgroundColor', value)}
        error={errors.backgroundColor}
        placeholder="#1e5a8e"
      />
    </div>
  );
};

