import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';

interface CapitalCTASectionFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage?: (file: File) => Promise<number | null>;
  uploadingImage?: boolean;
  errors?: Record<string, string>;
}

export const CapitalCTASectionForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {}
}: CapitalCTASectionFormProps) => {
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
        helpText="Full URL (e.g. https://refexcapital.com/)"
      />

      {uploadImage && (
        <ImageUpload
          label="Image (Logo)"
          value={formData.image || ''}
          onChange={(mediaId) => handleInputChange('image', mediaId)}
          onUpload={uploadImage}
          uploading={uploadingImage || false}
        />
      )}
    </div>
  );
};

