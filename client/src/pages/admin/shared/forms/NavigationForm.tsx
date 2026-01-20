import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';

interface NavigationFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage?: (file: File) => Promise<number | null>;
  uploadingImage?: boolean;
  errors?: Record<string, string>;
}

export const NavigationForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {}
}: NavigationFormProps) => {
  return (
    <div className="space-y-4">
      <FormField
        label="Label"
        name="label"
        value={formData.label || ''}
        onChange={(value) => handleInputChange('label', value)}
        required
        error={errors.label}
      />
      
      <FormField
        label="Link Type"
        name="linkType"
        type="select"
        value={formData.linkType || 'internal'}
        onChange={(value) => handleInputChange('linkType', value)}
        required
        error={errors.linkType}
        options={[
          { value: 'internal', label: 'Internal Link' },
          { value: 'external', label: 'External Link' },
          { value: 'dropdown', label: 'Dropdown Menu' }
        ]}
        helpText="Select 'Dropdown Menu' if this item has submenu items"
      />
      
      <FormField
        label="URL/Path"
        name="linkUrl"
        value={formData.linkUrl || ''}
        onChange={(value) => handleInputChange('linkUrl', value)}
        error={errors.linkUrl}
        helpText="URL path (e.g., '/about', '/contact') or external URL"
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

      {/* Mega Menu Settings (for special dropdowns like About Refex and Business) */}
      {formData.linkType === 'dropdown' && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Mega Menu Settings</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            These settings are used for special full-width dropdown menus (e.g., "About Refex", "Business")
          </p>
          
          <FormField
            label="Mega Menu Title"
            name="megaMenuTitle"
            value={formData.megaMenuTitle || ''}
            onChange={(value) => handleInputChange('megaMenuTitle', value)}
            error={errors.megaMenuTitle}
            helpText="Title shown in the mega menu (e.g., 'About Refex Group')"
          />
          
          <FormField
            label="Description"
            name="description"
            type="textarea"
            rows={3}
            value={formData.description || ''}
            onChange={(value) => handleInputChange('description', value)}
            error={errors.description}
            helpText="Description shown in the mega menu"
          />

          {uploadImage && (
            <ImageUpload
              label="Mega Menu Image"
              value={formData.megaMenuMediaId || ''}
              onChange={(mediaId) => handleInputChange('megaMenuMediaId', mediaId)}
              onUpload={uploadImage}
              uploading={uploadingImage || false}
              helpText="Image shown in the mega menu dropdown"
            />
          )}
        </div>
      )}
    </div>
  );
};

