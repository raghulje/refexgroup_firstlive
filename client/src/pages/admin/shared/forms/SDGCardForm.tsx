import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';

interface SDGCardFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage?: (file: File, pageName?: string, sectionName?: string) => Promise<number | null>;
  uploadingImage?: boolean;
  errors?: Record<string, string>;
  pageName?: string;
  sectionName?: string;
}

export const SDGCardForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {},
  pageName = 'esg',
  sectionName = 'sdg-cards'
}: SDGCardFormProps) => {
  return (
    <div className="space-y-4">
      <FormField
        label="SDG Number"
        name="sdgNumber"
        type="number"
        value={formData.sdgNumber || ''}
        onChange={(value) => handleInputChange('sdgNumber', parseInt(value) || 0)}
        required
        error={errors.sdgNumber}
        helpText="The UN SDG number (e.g., 3, 4, 6, 7, etc.)"
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
        label="Contribution (Subtitle)"
        name="contribution"
        value={formData.contribution || ''}
        onChange={(value) => handleInputChange('contribution', value)}
        error={errors.contribution}
        helpText="Short subtitle like 'Our Action'"
      />

      <FormField
        label="Description"
        name="description"
        type="textarea"
        rows={4}
        value={formData.description || ''}
        onChange={(value) => handleInputChange('description', value)}
        required
        error={errors.description}
      />

      {uploadImage && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SDG Icon (Badge)
            </label>
            <ImageUpload
              label=""
              value={formData.icon || formData.iconId || ''}
              onChange={(mediaId: number | string) => {
                handleInputChange('icon', mediaId);
                handleInputChange('iconId', mediaId);
              }}
              onUpload={uploadImage}
              uploading={uploadingImage || false}
              fileType="icon"
              pageName={pageName}
              sectionName={sectionName}
              allowUrl={true}
              error={errors.iconId || errors.icon}
            />
            {errors.iconId && (
              <p className="mt-1 text-sm text-red-600">{errors.iconId}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              The SDG badge icon that appears at the bottom of the banner image
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Banner Image
            </label>
            <ImageUpload
              label=""
              value={formData.banner || formData.image || formData.bannerId || formData.imageId || ''}
              onChange={(mediaId: number | string) => {
                handleInputChange('banner', mediaId);
                handleInputChange('image', mediaId);
                handleInputChange('bannerId', mediaId);
                handleInputChange('imageId', mediaId);
              }}
              onUpload={uploadImage}
              uploading={uploadingImage || false}
              pageName={pageName}
              sectionName={sectionName}
              allowUrl={true}
              error={errors.bannerId || errors.imageId || errors.banner || errors.image}
            />
            {errors.bannerId && (
              <p className="mt-1 text-sm text-red-600">{errors.bannerId}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              The main banner image displayed on the left side of the card
            </p>
          </div>
        </>
      )}

      <FormField
        label="Background Color"
        name="color"
        type="text"
        value={formData.color || '#7cb342'}
        onChange={(value) => handleInputChange('color', value)}
        placeholder="#7cb342"
        error={errors.color}
        helpText="Background color for the SDG card (hex code)"
      />

      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Gradient Overlay (Optional)</h3>
        <p className="text-xs text-gray-500 mb-4">
          Customize the gradient overlay on the banner image. Leave empty to use default gradient based on background color.
        </p>
        
        <FormField
          label="Gradient Start Color"
          name="gradientColor"
          type="text"
          value={formData.gradientColor || ''}
          onChange={(value) => handleInputChange('gradientColor', value)}
          placeholder="#073838"
          error={errors.gradientColor}
          helpText="Starting color of the gradient overlay (hex code, e.g., #073838)"
        />

        <FormField
          label="Gradient Start Position (%)"
          name="gradientStartPosition"
          type="number"
          value={formData.gradientStartPosition || 64}
          onChange={(value) => handleInputChange('gradientStartPosition', parseFloat(value) || 64)}
          placeholder="64"
          error={errors.gradientStartPosition}
          helpText="Position where gradient starts (0-100, e.g., 64 for 64%)"
        />

        <FormField
          label="Gradient End Position (%)"
          name="gradientEndPosition"
          type="number"
          value={formData.gradientEndPosition || 100}
          onChange={(value) => handleInputChange('gradientEndPosition', parseFloat(value) || 100)}
          placeholder="100"
          error={errors.gradientEndPosition}
          helpText="Position where gradient ends (0-100, e.g., 100 for 100%)"
        />

        <FormField
          label="Gradient Direction (degrees)"
          name="gradientDirection"
          type="number"
          value={formData.gradientDirection || 270}
          onChange={(value) => handleInputChange('gradientDirection', parseFloat(value) || 270)}
          placeholder="270"
          error={errors.gradientDirection}
          helpText="Gradient direction in degrees (0 = top, 90 = right, 180 = bottom, 270 = left)"
        />
      </div>

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
        value={formData.isActive !== false}
        onChange={(value) => handleInputChange('isActive', value)}
      />
    </div>
  );
};

