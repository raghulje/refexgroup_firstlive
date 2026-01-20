import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';

interface CoreValueFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage: (file: File) => Promise<string | null>;
  uploadingImage: boolean;
  errors?: Record<string, string>;
}

export const CoreValueForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {}
}: CoreValueFormProps) => {
  return (
    <div className="space-y-4">
      <FormField
        label="Letter"
        name="letter"
        value={formData.letter || ''}
        onChange={(value) => handleInputChange('letter', value)}
        required
        error={errors.letter}
        helpText="Single letter for the core value (e.g., P, A, C, E)"
      />
      
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
        rows={4}
        value={formData.description || ''}
        onChange={(value) => handleInputChange('description', value)}
        error={errors.description}
      />
      
      <ImageUpload
        label="Icon"
        value={formData.icon || formData.iconId || ''}
        onChange={(value) => handleInputChange('icon', value)}
        onUpload={uploadImage}
        uploading={uploadingImage}
        error={errors.icon}
        fieldName="iconId"
      />
      
      <FormField
        label="Order Index"
        name="orderIndex"
        type="number"
        value={formData.orderIndex || 0}
        onChange={(value) => handleInputChange('orderIndex', parseInt(value) || 0)}
        error={errors.orderIndex}
      />
      
      <FormField
        label="Active"
        name="isActive"
        type="checkbox"
        value={formData.isActive !== undefined ? formData.isActive : true}
        onChange={(value) => handleInputChange('isActive', value)}
      />
    </div>
  );
};

