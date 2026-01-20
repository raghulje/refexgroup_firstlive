import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';

interface CareersLifeRefexianFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage?: (file: File) => Promise<number | null>;
  uploadingImage?: boolean;
  errors?: Record<string, string>;
}

export const CareersLifeRefexianForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {}
}: CareersLifeRefexianFormProps) => {
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

      {uploadImage && (
        <>
        <ImageUpload
            label="Content Image"
          value={formData.image || ''}
          onChange={(mediaId) => handleInputChange('image', mediaId)}
          onUpload={uploadImage}
          uploading={uploadingImage || false}
          pageName="careers"
          sectionName="life-refexian"
          allowUrl={true}
        />
          <ImageUpload
            label="Background Image"
            value={formData.backgroundImage || ''}
            onChange={(mediaId) => handleInputChange('backgroundImage', mediaId)}
            onUpload={uploadImage}
            uploading={uploadingImage || false}
            pageName="careers"
            sectionName="life-refexian"
            allowUrl={true}
          />
          <FormField
            label="Background Color (fallback if no background image)"
            name="backgroundColor"
            value={formData.backgroundColor || '#ff7f50'}
            onChange={(value) => handleInputChange('backgroundColor', value)}
            error={errors.backgroundColor}
            placeholder="#ff7f50"
          />
        </>
      )}
    </div>
  );
};

