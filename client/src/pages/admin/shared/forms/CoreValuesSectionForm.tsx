import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';
import { ImagePositionControl } from '../ImagePositionControl';

interface CoreValuesSectionFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage?: (file: File, pageName?: string, sectionName?: string) => Promise<number | null>;
  uploadingImage?: boolean;
  errors?: Record<string, string>;
  pageName?: string;
  sectionName?: string;
}

export const CoreValuesSectionForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {},
  pageName,
  sectionName = 'core-values'
}: CoreValuesSectionFormProps) => {
  return (
    <div className="space-y-4">
      <FormField
        label="Title"
        name="title"
        value={formData.title || ''}
        onChange={(value) => handleInputChange('title', value)}
        error={errors.title}
        helpText="Section title (e.g., 'Our Core Values')"
      />

      <FormField
        label="Subtitle"
        name="subtitle"
        type="textarea"
        rows={2}
        value={formData.subtitle || ''}
        onChange={(value) => handleInputChange('subtitle', value)}
        error={errors.subtitle}
        helpText="Section subtitle/description"
      />

      <FormField
        label="Background Color"
        name="backgroundColor"
        type="color"
        value={formData.backgroundColor || '#247b6b'}
        onChange={(value) => handleInputChange('backgroundColor', value)}
        error={errors.backgroundColor}
        helpText="Background color for the core values section"
      />

      {uploadImage && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pattern Image (Overlay)
          </label>
          <ImageUpload
            label=""
            value={formData.patternImage || formData.patternImageId || ''}
            onChange={(mediaId: number | string) => handleInputChange('patternImage', mediaId)}
            onUpload={uploadImage}
            uploading={uploadingImage || false}
            pageName={pageName || 'general'}
            sectionName={sectionName}
            allowUrl={true}
            error={errors.patternImage}
          />
          {errors.patternImage && (
            <p className="mt-1 text-sm text-red-600">{errors.patternImage}</p>
          )}
          
          {/* Pattern Image Position Control */}
          {(formData.patternImage || formData.patternImageId) && (
            <div className="mt-4">
              <ImagePositionControl
                label="Pattern Image Position"
                positionX={formData.patternPositionX || formData.patternImagePositionX || '50'}
                positionY={formData.patternPositionY || formData.patternImagePositionY || '50'}
                onChangeX={(value) => {
                  handleInputChange('patternPositionX', value);
                  handleInputChange('patternImagePositionX', value);
                }}
                onChangeY={(value) => {
                  handleInputChange('patternPositionY', value);
                  handleInputChange('patternImagePositionY', value);
                }}
                imageMediaId={formData.patternImage || formData.patternImageId}
                helpText="Adjust X and Y position (0-100%) to control which part of the pattern image is visible"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

