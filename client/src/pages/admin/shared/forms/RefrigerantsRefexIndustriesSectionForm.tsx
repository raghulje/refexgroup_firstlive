import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';

interface RefrigerantsRefexIndustriesSectionFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage?: (file: File) => Promise<number | null>;
  uploadingImage?: boolean;
  errors?: Record<string, string>;
}

export const RefrigerantsRefexIndustriesSectionForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {}
}: RefrigerantsRefexIndustriesSectionFormProps) => {
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
        label="Description"
        name="description"
        type="textarea"
        rows={4}
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
      />

      {uploadImage && (
        <ImageUpload
          label="Background Image"
          value={formData.backgroundImage || ''}
          onChange={(mediaId) => handleInputChange('backgroundImage', mediaId)}
          onUpload={uploadImage}
          uploading={uploadingImage || false}
        />
      )}

      <FormField
        label="Gradient Overlay"
        name="gradientOverlay"
        value={formData.gradientOverlay || 'linear-gradient(185deg, #2A78B247 0%, #1e5a8e 71%)'}
        onChange={(value) => handleInputChange('gradientOverlay', value)}
        error={errors.gradientOverlay}
        placeholder="linear-gradient(185deg, #2A78B247 0%, #1e5a8e 71%)"
      />
    </div>
  );
};

