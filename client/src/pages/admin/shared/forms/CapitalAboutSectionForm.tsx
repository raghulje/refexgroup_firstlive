import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';

interface CapitalAboutSectionFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage?: (file: File) => Promise<number | null>;
  uploadingImage?: boolean;
  errors?: Record<string, string>;
}

export const CapitalAboutSectionForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {}
}: CapitalAboutSectionFormProps) => {
  return (
    <div className="space-y-4">
      <FormField
        label="Title Line 1"
        name="title1"
        value={formData.title1 || ''}
        onChange={(value) => handleInputChange('title1', value)}
        required
        error={errors.title1}
        helpText="First line of title (e.g., 'Know')"
      />

      <FormField
        label="Title Line 2"
        name="title2"
        value={formData.title2 || ''}
        onChange={(value) => handleInputChange('title2', value)}
        required
        error={errors.title2}
        helpText="Second line of title (e.g., 'About Us')"
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

      {uploadImage && (
        <>
          <ImageUpload
            label="Logo"
            value={formData.logo || ''}
            onChange={(mediaId) => handleInputChange('logo', mediaId)}
            onUpload={uploadImage}
            uploading={uploadingImage || false}
          />

          <ImageUpload
            label="Image"
            value={formData.image || ''}
            onChange={(mediaId) => handleInputChange('image', mediaId)}
            onUpload={uploadImage}
            uploading={uploadingImage || false}
          />
        </>
      )}
    </div>
  );
};

