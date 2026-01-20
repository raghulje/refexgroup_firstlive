import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';
import { ImagePositionControl } from '../ImagePositionControl';

interface AirportsHeroSectionFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage?: (file: File, pageName?: string, sectionName?: string) => Promise<number | null>;
  uploadingImage?: boolean;
  errors?: Record<string, string>;
  pageName?: string;
  sectionName?: string;
}

export const AirportsHeroSectionForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {},
  pageName = 'airports',
  sectionName = 'hero'
}: AirportsHeroSectionFormProps) => {
  return (
    <div className="space-y-4">
      <FormField
        label="Tagline"
        name="tagline"
        value={formData.tagline || 'Airports and Transportation'}
        onChange={(value) => handleInputChange('tagline', value)}
        error={errors.tagline}
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
          helpText="Anchor link or full URL (e.g. #explore or https://...)"
        />
      </div>

      {uploadImage && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logo Image
            </label>
            <ImageUpload
              label=""
              value={formData.logoImage || formData.logoImageId || ''}
              onChange={(mediaId: number | string) => handleInputChange('logoImage', mediaId)}
              onUpload={uploadImage}
              uploading={uploadingImage || false}
              fileType="logo"
              pageName={pageName}
              sectionName={sectionName}
              allowUrl={true}
              error={errors.logoImage}
            />
            {errors.logoImage && (
              <p className="mt-1 text-sm text-red-600">{errors.logoImage}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hero Background Image
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
        </>
      )}
    </div>
  );
};


