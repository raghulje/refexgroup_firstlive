import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';

interface AwardFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage: (file: File) => Promise<string | null>;
  uploadingImage: boolean;
  errors?: Record<string, string>;
}

export const AwardForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {}
}: AwardFormProps) => {
  return (
    <div className="space-y-4">
      <FormField
        label="Title"
        name="title"
        value={formData.title || ''}
        onChange={(value) => handleInputChange('title', value)}
        error={errors.title}
        helpText="HTML is supported (e.g., use <br /> for line breaks, <span> for styling)"
      />
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Image
        </label>
        <ImageUpload
          label=""
          value={formData.image || ''}
          onChange={(mediaId) => handleInputChange('image', mediaId)}
          onUpload={uploadImage}
          uploading={uploadingImage}
        />
        {errors.image && (
          <p className="mt-1 text-sm text-red-600">{errors.image}</p>
        )}
      </div>
      
      <FormField
        label="Type"
        name="type"
        type="select"
        value={formData.type || 'standard'}
        onChange={(value) => handleInputChange('type', value)}
        error={errors.type}
        options={[
          { value: 'standard', label: 'Standard' },
          { value: 'laurel', label: 'Laurel' },
          { value: 'certification', label: 'Certification' }
        ]}
        helpText="Award type determines display style"
      />
      
      {formData.type === 'laurel' && (
        <>
          <FormField
            label="Year"
            name="year"
            value={formData.year || ''}
            onChange={(value) => handleInputChange('year', value)}
            error={errors.year}
            helpText="Year the award was received"
          />
          <FormField
            label="Recipient"
            name="recipient"
            value={formData.recipient || ''}
            onChange={(value) => handleInputChange('recipient', value)}
            error={errors.recipient}
            helpText="Person or department who received the award"
          />
        </>
      )}
      
      <FormField
        label="Order Index"
        name="order"
        type="number"
        value={formData.order || 0}
        onChange={(value) => handleInputChange('order', parseInt(value) || 0)}
        error={errors.order}
        helpText="Display order (lower numbers appear first)"
      />
      
      <FormField
        label="Show Award Name"
        name="showAwardName"
        type="checkbox"
        value={formData.showAwardName === true || formData.showAwardName === undefined}
        onChange={(checked) => {
          // Explicitly set to boolean true or false
          handleInputChange('showAwardName', checked === true);
        }}
        error={errors.showAwardName}
        helpText="If unchecked, only the image will be displayed and it will expand to fill the space"
      />
      
      <FormField
        label="Active"
        name="isActive"
        type="checkbox"
        value={formData.isActive !== undefined ? formData.isActive : true}
        onChange={(value) => handleInputChange('isActive', value)}
        error={errors.isActive}
      />
    </div>
  );
};

