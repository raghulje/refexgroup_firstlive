import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';

interface IntroSectionContentFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage: (file: File) => Promise<string | null>;
  uploadingImage: boolean;
  errors?: Record<string, string>;
}

export const IntroSectionContentForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {}
}: IntroSectionContentFormProps) => {
  return (
    <div className="space-y-4">
      <ImageUpload
        label="Image"
        value={formData.image || ''}
        onChange={(mediaId) => handleInputChange('image', mediaId)}
        onUpload={uploadImage}
        uploading={uploadingImage}
        error={errors.image}
      />
      
      <ImageUpload
        label="Logo"
        value={formData.logo || ''}
        onChange={(mediaId) => handleInputChange('logo', mediaId)}
        onUpload={uploadImage}
        uploading={uploadingImage}
        error={errors.logo}
      />
      
      <FormField
        label="Heading"
        name="heading"
        value={formData.heading || ''}
        onChange={(value) => handleInputChange('heading', value)}
        required
        error={errors.heading}
        helpText="Main heading text"
      />
      
      <FormField
        label="Description"
        name="description"
        type="textarea"
        value={formData.description || ''}
        onChange={(value) => handleInputChange('description', value)}
        required
        error={errors.description}
        helpText="Description text content"
      />
    </div>
  );
};

