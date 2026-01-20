import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';

interface AboutCareersCTASectionFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage: (file: File) => Promise<string | null>;
  uploadingImage: boolean;
  errors?: Record<string, string>;
}

export const AboutCareersCTASectionForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {}
}: AboutCareersCTASectionFormProps) => {
  return (
    <div className="space-y-4">
      <FormField
        label="Tagline"
        name="tagline"
        value={formData.tagline || ''}
        onChange={(value) => handleInputChange('tagline', value)}
        error={errors.tagline}
        helpText="Small uppercase text (e.g., 'Careers')"
      />
      
      <FormField
        label="Title"
        name="title"
        type="textarea"
        rows={2}
        value={formData.title || ''}
        onChange={(value) => handleInputChange('title', value)}
        error={errors.title}
        helpText="Main heading (supports line breaks)"
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
      
      <div className="grid grid-cols-2 gap-4">
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
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Background Image
        </label>
        <ImageUpload
          label=""
          value={formData.backgroundImage || formData.backgroundImageId || ''}
          onChange={(mediaId) => handleInputChange('backgroundImage', mediaId)}
          onUpload={uploadImage}
          uploading={uploadingImage}
          error={errors.backgroundImage}
        />
        {errors.backgroundImage && (
          <p className="mt-1 text-sm text-red-600">{errors.backgroundImage}</p>
        )}
      </div>
    </div>
  );
};

