import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';

interface GlobalSettingFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage: (file: File) => Promise<number | null>;
  uploadingImage: boolean;
  errors?: Record<string, string>;
}

export const GlobalSettingForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {}
}: GlobalSettingFormProps) => {
  return (
    <div className="space-y-4">
      <FormField
        label="Key"
        name="key"
        value={formData.key || ''}
        onChange={(value) => handleInputChange('key', value)}
        required
        error={errors.key}
        helpText="Unique identifier (e.g., 'site_name', 'logo')"
        disabled={!!formData.key && formData.id !== undefined}
      />
      
      <FormField
        label="Value"
        name="value"
        type="textarea"
        rows={4}
        value={formData.value || ''}
        onChange={(value) => handleInputChange('value', value)}
        required
        error={errors.value}
        helpText="Setting value (can be text, JSON, or URL)"
      />
      
      <FormField
        label="Type"
        name="type"
        type="select"
        value={formData.type || 'text'}
        onChange={(value) => handleInputChange('type', value)}
        required
        error={errors.type}
        options={[
          { value: 'text', label: 'Text' },
          { value: 'number', label: 'Number' },
          { value: 'boolean', label: 'Boolean' },
          { value: 'json', label: 'JSON' },
          { value: 'url', label: 'URL' },
          { value: 'image', label: 'Image' }
        ]}
      />
      
      {formData.type === 'image' && (
        <ImageUpload
          label="Image"
          value={formData.image || formData.imageId || ''}
          onChange={(value) => handleInputChange('image', value)}
          onUpload={uploadImage}
          uploading={uploadingImage}
          error={errors.image}
          fieldName="imageId"
        />
      )}
      
      <FormField
        label="Description"
        name="description"
        type="textarea"
        rows={2}
        value={formData.description || ''}
        onChange={(value) => handleInputChange('description', value)}
        error={errors.description}
      />
    </div>
  );
};

