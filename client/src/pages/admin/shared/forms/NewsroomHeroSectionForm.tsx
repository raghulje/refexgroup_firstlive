import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';
import { ImagePositionControl } from '../ImagePositionControl';

interface NewsroomHeroSectionFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage?: (file: File, pageName?: string, sectionName?: string) => Promise<number | null>;
  uploadingImage?: boolean;
  errors?: Record<string, string>;
  pageName?: string;
  sectionName?: string;
}

export const NewsroomHeroSectionForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {},
  pageName = 'newsroom',
  sectionName = 'hero'
}: NewsroomHeroSectionFormProps) => {
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
        rows={3}
        value={formData.description || ''}
        onChange={(value) => handleInputChange('description', value)}
        error={errors.description}
      />

      {uploadImage && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Background Image
          </label>
          <ImageUpload
            label=""
            value={formData.backgroundImage || formData.backgroundImageId || ''}
            onChange={(mediaId: number | string) => handleInputChange('backgroundImage', mediaId)}
            onUpload={uploadImage}
            uploading={uploadingImage || false}
            pageName={pageName}
            sectionName={sectionName}
            allowUrl={true}
            error={errors.backgroundImage}
          />
          {errors.backgroundImage && (
            <p className="mt-1 text-sm text-red-600">{errors.backgroundImage}</p>
          )}
          
          {/* Image Position Control */}
          {(formData.backgroundImage || formData.backgroundImageId) && (
            <div className="mt-4">
              <ImagePositionControl
                label="Background Image Position"
                positionX={formData.backgroundPositionX || formData.backgroundImagePositionX || '50'}
                positionY={formData.backgroundPositionY || formData.backgroundImagePositionY || '50'}
                onChangeX={(value) => {
                  handleInputChange('backgroundPositionX', value);
                  handleInputChange('backgroundImagePositionX', value);
                }}
                onChangeY={(value) => {
                  handleInputChange('backgroundPositionY', value);
                  handleInputChange('backgroundImagePositionY', value);
                }}
                imageMediaId={formData.backgroundImage || formData.backgroundImageId}
                helpText="Adjust X and Y position (0-100%) to control which part of the image is visible"
              />
            </div>
          )}
        </div>
      )}

      {/* Overlay Controls */}
      <div className="border-t pt-4 mt-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Overlay Settings</h3>
        
        <FormField
          label="Overlay Opacity (%)"
          name="overlayOpacity"
          type="number"
          value={formData.overlayOpacity !== undefined ? formData.overlayOpacity : 0}
          onChange={(value) => handleInputChange('overlayOpacity', value)}
          error={errors.overlayOpacity}
          helpText="Opacity of the dark overlay on the background image (0-100). Default: 0"
          min={0}
          max={100}
        />

        <FormField
          label="Blur Overlay (px)"
          name="blurOverlay"
          type="number"
          value={formData.blurOverlay !== undefined ? formData.blurOverlay : 0}
          onChange={(value) => handleInputChange('blurOverlay', value)}
          error={errors.blurOverlay}
          helpText="Blur effect applied to the background image (0-20px). Default: 0"
          min={0}
          max={20}
        />

        <FormField
          label="Gradient Overlay"
          name="gradientOverlay"
          value={formData.gradientOverlay || ''}
          onChange={(value) => handleInputChange('gradientOverlay', value)}
          error={errors.gradientOverlay}
          helpText="CSS gradient overlay (e.g., linear-gradient(185deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)). Leave empty for no gradient."
          placeholder="linear-gradient(185deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)"
        />

        <FormField
          label="Overlay Color"
          name="overlayColor"
          type="color"
          value={formData.overlayColor || '#000000'}
          onChange={(value) => handleInputChange('overlayColor', value)}
          error={errors.overlayColor}
          helpText="Color for the overlay (used with opacity). Default: black"
        />
      </div>
    </div>
  );
};

