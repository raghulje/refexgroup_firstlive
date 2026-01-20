import { FormField } from '../FormField';

interface CareersMainContentFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  errors?: Record<string, string>;
}

export const CareersMainContentForm = ({
  formData,
  handleInputChange,
  errors = {}
}: CareersMainContentFormProps) => {
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
        label="Paragraph 1"
        name="paragraph1"
        type="textarea"
        rows={4}
        value={formData.paragraph1 || ''}
        onChange={(value) => handleInputChange('paragraph1', value)}
        error={errors.paragraph1}
      />

      <FormField
        label="Paragraph 2"
        name="paragraph2"
        type="textarea"
        rows={4}
        value={formData.paragraph2 || ''}
        onChange={(value) => handleInputChange('paragraph2', value)}
        error={errors.paragraph2}
      />
    </div>
  );
};

