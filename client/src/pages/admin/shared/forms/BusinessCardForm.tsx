import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';

interface BusinessCardFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage: (file: File) => Promise<string | null>;
  uploadingImage: boolean;
  errors?: Record<string, string>;
}

export const BusinessCardForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {}
}: BusinessCardFormProps) => {
  return (
    <div className="space-y-4">
      <FormField
        label="Title"
        name="title"
        value={formData.title}
        onChange={(value) => handleInputChange('title', value)}
        required
        error={errors.title}
      />
      
      <FormField
        label="Description"
        name="description"
        type="textarea"
        rows={4}
        value={formData.description}
        onChange={(value) => handleInputChange('description', value)}
        error={errors.description}
      />
      
      <FormField
        label="Link"
        name="link"
        type="url"
        value={formData.link}
        onChange={(value) => handleInputChange('link', value)}
        error={errors.link}
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

