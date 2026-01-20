import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';
import { ImagePositionControl } from '../ImagePositionControl';

interface MobilityHeroSectionFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage?: (file: File, pageName?: string, sectionName?: string) => Promise<number | null>;
  uploadingImage?: boolean;
  errors?: Record<string, string>;
  pageName?: string;
  sectionName?: string;
}

export const MobilityHeroSectionForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {},
  pageName = 'mobility',
  sectionName = 'hero'
}: MobilityHeroSectionFormProps) => {
  return (
    <div className="space-y-4">
      <FormField
        label="Tagline"
        name="tagline"
        value={formData.tagline || ''}
        onChange={(value) => handleInputChange('tagline', value)}
        error={errors.tagline}
        helpText="Small text above the title"
      />

      <FormField
        label="Title Highlight"
        name="titleHighlight"
        value={formData.titleHighlight || ''}
        onChange={(value) => handleInputChange('titleHighlight', value)}
        required
        error={errors.titleHighlight}
        helpText="First part of title (e.g., 'Refex Mobility:')"
      />

      <FormField
        label="Title Main"
        name="titleMain"
        value={formData.titleMain || ''}
        onChange={(value) => handleInputChange('titleMain', value)}
        required
        error={errors.titleMain}
        helpText="Second part of title (e.g., 'Where reliability meets responsibility!')"
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

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Button Text"
          name="buttonText"
          value={formData.buttonText || ''}
          onChange={(value) => handleInputChange('buttonText', value)}
          error={errors.buttonText}
        />
        <FormField
          label="Button Link"
          name="buttonLink"
          value={formData.buttonLink || ''}
          onChange={(value) => handleInputChange('buttonLink', value)}
          error={errors.buttonLink}
          helpText="URL (e.g., /contact)"
        />
      </div>

      {uploadImage && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hero Image
          </label>
          <ImageUpload
            label=""
            value={formData.image || formData.imageId || ''}
            onChange={(mediaId: number | string) => handleInputChange('image', mediaId)}
            onUpload={uploadImage}
            uploading={uploadingImage || false}
            pageName={pageName}
            sectionName={sectionName}
            allowUrl={true}
            error={errors.image}
          />
          {errors.image && (
            <p className="mt-1 text-sm text-red-600">{errors.image}</p>
          )}
          
          {/* Image Position Control */}
          {(formData.image || formData.imageId) && (
            <div className="mt-4">
              <ImagePositionControl
                label="Hero Image Position"
                positionX={formData.imagePositionX || formData.positionX || '50'}
                positionY={formData.imagePositionY || formData.positionY || '50'}
                onChangeX={(value) => {
                  handleInputChange('imagePositionX', value);
                  handleInputChange('positionX', value);
                }}
                onChangeY={(value) => {
                  handleInputChange('imagePositionY', value);
                  handleInputChange('positionY', value);
                }}
                imageMediaId={formData.image || formData.imageId}
                helpText="Adjust X and Y position (0-100%) to control which part of the image is visible"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

