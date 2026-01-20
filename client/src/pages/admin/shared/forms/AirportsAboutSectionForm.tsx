import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';

interface AirportsAboutSectionFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage?: (file: File) => Promise<number | null>;
  uploadingImage?: boolean;
  errors?: Record<string, string>;
}

export const AirportsAboutSectionForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {}
}: AirportsAboutSectionFormProps) => {
  return (
    <div className="space-y-4">
      <FormField
        label="Badge Text"
        name="badge"
        value={formData.badge || ''}
        onChange={(value) => handleInputChange('badge', value)}
        error={errors.badge}
        helpText="Small label above heading (e.g. About Us)"
      />

      <FormField
        label="Heading"
        name="heading"
        value={formData.heading || ''}
        onChange={(value) => handleInputChange('heading', value)}
        required
        error={errors.heading}
      />

      <FormField
        label="Description"
        name="description"
        type="textarea"
        rows={5}
        value={formData.description || ''}
        onChange={(value) => handleInputChange('description', value)}
        error={errors.description}
      />

      <FormField
        label="Image Caption"
        name="imageCaption"
        value={formData.imageCaption || ''}
        onChange={(value) => handleInputChange('imageCaption', value)}
        error={errors.imageCaption}
        helpText="Text shown over the image (e.g. Premier Retail Concessions...)"
      />

      {uploadImage && (
        <ImageUpload
          label="Right Side Image"
          value={formData.image || ''}
          onChange={(mediaId) => handleInputChange('image', mediaId)}
          onUpload={uploadImage}
          uploading={uploadingImage || false}
        />
      )}
    </div>
  );
};


