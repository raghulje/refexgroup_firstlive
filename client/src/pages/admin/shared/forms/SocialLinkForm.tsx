import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';

interface SocialLinkFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImageUtil?: (file: File) => Promise<string | null>;
  uploadingImage?: boolean;
  errors?: Record<string, string>;
}

export const SocialLinkForm = ({
  formData,
  handleInputChange,
  uploadImageUtil,
  uploadingImage = false,
  errors = {}
}: SocialLinkFormProps) => {
  return (
    <div className="space-y-4">
      <FormField
        label="Platform"
        name="platform"
        type="select"
        value={formData.platform || ''}
        onChange={(value) => handleInputChange('platform', value)}
        required
        error={errors.platform}
        options={[
          { value: '', label: 'Select platform' },
          { value: 'facebook', label: 'Facebook' },
          { value: 'twitter', label: 'Twitter' },
          { value: 'x', label: 'X (Twitter)' },
          { value: 'linkedin', label: 'LinkedIn' },
          { value: 'instagram', label: 'Instagram' },
          { value: 'youtube', label: 'YouTube' },
          { value: 'whatsapp', label: 'WhatsApp' },
          { value: 'other', label: 'Other' }
        ]}
      />
      
      <FormField
        label="URL"
        name="url"
        type="url"
        value={formData.url || ''}
        onChange={(value) => handleInputChange('url', value)}
        required
        error={errors.url}
        placeholder="https://..."
      />
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Icon
        </label>
        <ImageUpload
          value={formData.iconId || null}
          onChange={(mediaId) => handleInputChange('iconId', mediaId)}
          onUpload={uploadImageUtil}
          uploading={uploadingImage}
          allowUrl={true}
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Upload an icon image or select from media library
        </p>
      </div>
      
      <FormField
        label="Icon Class (Fallback)"
        name="iconClass"
        value={formData.iconClass || ''}
        onChange={(value) => handleInputChange('iconClass', value)}
        error={errors.iconClass}
        helpText="CSS class for icon (e.g., 'ri-facebook-line')"
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
        value={formData.isActive}
        onChange={(value) => handleInputChange('isActive', value)}
      />
    </div>
  );
};

