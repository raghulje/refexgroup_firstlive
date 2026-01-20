import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';

interface LeaderFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage: (file: File) => Promise<string | null>;
  uploadingImage: boolean;
  errors?: Record<string, string>;
}

export const LeaderForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {}
}: LeaderFormProps) => {
  return (
    <div className="space-y-4">
      <FormField
        label="Name"
        name="name"
        value={formData.name}
        onChange={(value) => handleInputChange('name', value)}
        required
        error={errors.name}
      />
      
      <FormField
        label="Position"
        name="position"
        value={formData.position}
        onChange={(value) => handleInputChange('position', value)}
        required
        error={errors.position}
      />
      
      <FormField
        label="Bio"
        name="bio"
        type="textarea"
        rows={6}
        value={formData.bio}
        onChange={(value) => handleInputChange('bio', value)}
        error={errors.bio}
      />
      
      <FormField
        label="LinkedIn URL"
        name="linkedinUrl"
        type="text"
        value={formData.linkedinUrl || ''}
        onChange={(value) => handleInputChange('linkedinUrl', value)}
        error={errors.linkedinUrl}
        helpText="Enter the full LinkedIn profile URL (e.g., https://www.linkedin.com/in/username)"
      />
      
      <ImageUpload
        label="Image"
        value={formData.image || formData.imageId || ''}
        onChange={(value) => handleInputChange('image', value)}
        onUpload={uploadImage}
        uploading={uploadingImage}
        error={errors.image}
        fieldName="imageId"
      />
      
      <FormField
        label="Order Index"
        name="orderIndex"
        type="number"
        value={formData.orderIndex}
        onChange={(value) => handleInputChange('orderIndex', parseInt(value) || 0)}
        error={errors.orderIndex}
      />
      
      <FormField
        label="Active"
        name="isActive"
        type="checkbox"
        value={formData.isActive}
        onChange={(value) => handleInputChange('isActive', value)}
      />
    </div>
  );
};

