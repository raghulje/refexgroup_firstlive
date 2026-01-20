import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';

interface GalleryWelcomeSectionFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage?: (file: File) => Promise<number | null>;
  uploadingImage?: boolean;
  errors?: Record<string, string>;
}

export const GalleryWelcomeSectionForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {}
}: GalleryWelcomeSectionFormProps) => {
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
        rows={5}
        value={formData.description || ''}
        onChange={(value) => handleInputChange('description', value)}
        error={errors.description}
      />

      <ImageUpload
        label="Image"
        value={formData.image || ''}
        onChange={(mediaId) => handleInputChange('image', mediaId)}
        onUpload={uploadImage}
        uploading={uploadingImage || false}
        pageName="gallery"
        sectionName="welcome"
        allowUrl={true}
      />
    </div>
  );
};

