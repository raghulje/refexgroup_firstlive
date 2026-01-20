import { FormField } from '../FormField';

interface ContactFormSectionFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  errors?: Record<string, string>;
}

export const ContactFormSectionForm = ({
  formData,
  handleInputChange,
  errors = {}
}: ContactFormSectionFormProps) => {
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
        label="Map URL"
        name="mapUrl"
        value={formData.mapUrl || ''}
        onChange={(value) => handleInputChange('mapUrl', value)}
        error={errors.mapUrl}
        helpText="Enter the Google Maps embed URL"
      />

      <FormField
        label="Contact Email"
        name="contactEmail"
        type="email"
        value={formData.contactEmail || ''}
        onChange={(value) => handleInputChange('contactEmail', value)}
        error={errors.contactEmail}
        helpText="Email address where contact form submissions will be sent"
        required
      />
    </div>
  );
};

