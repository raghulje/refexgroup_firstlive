import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';

interface TestimonialFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage: (file: File) => Promise<string | null>;
  uploadingImage: boolean;
  errors?: Record<string, string>;
}

export const TestimonialForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {}
}: TestimonialFormProps) => {
  return (
    <div className="space-y-2.5">
      <FormField
        label="Author Name"
        name="authorName"
        value={formData.authorName}
        onChange={(value) => handleInputChange('authorName', value)}
        required
        error={errors.authorName}
      />
      
      <FormField
        label="Author Position"
        name="authorPosition"
        value={formData.authorPosition}
        onChange={(value) => handleInputChange('authorPosition', value)}
        error={errors.authorPosition}
      />
      
      <FormField
        label="Content"
        name="content"
        type="textarea"
        rows={6}
        value={formData.content}
        onChange={(value) => handleInputChange('content', value)}
        required
        error={errors.content}
      />
      
      <ImageUpload
        label="Author Image"
        value={formData.authorImage || formData.authorImageId || ''}
        onChange={(value) => handleInputChange('authorImage', value)}
        onUpload={uploadImage}
        uploading={uploadingImage}
        error={errors.authorImage}
        fieldName="authorImageId"
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

