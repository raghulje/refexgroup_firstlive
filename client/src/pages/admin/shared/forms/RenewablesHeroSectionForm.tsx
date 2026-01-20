import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';
import { ImagePositionControl } from '../ImagePositionControl';

interface RenewablesHeroSectionFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage?: (file: File, pageName?: string, sectionName?: string) => Promise<number | null>;
  uploadingImage?: boolean;
  errors?: Record<string, string>;
  pageName?: string;
  sectionName?: string;
}

export const RenewablesHeroSectionForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {},
  pageName = 'renewables',
  sectionName = 'hero'
}: RenewablesHeroSectionFormProps) => {
  return (
    <div className="space-y-4">
      <FormField
        label="Tagline"
        name="tagline"
        value={formData.tagline || ''}
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
        />
      </div>

      {/* Stats */}
      <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
        <h4 className="font-semibold text-gray-900 mb-4">Statistics</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <FormField
              label="Stat 1 Value"
              name="stat1Value"
              value={formData.stat1Value || ''}
              onChange={(value) => handleInputChange('stat1Value', value)}
              error={errors.stat1Value}
            />
            <FormField
              label="Stat 1 Label"
              name="stat1Label"
              value={formData.stat1Label || ''}
              onChange={(value) => handleInputChange('stat1Label', value)}
              error={errors.stat1Label}
            />
          </div>
          <div className="space-y-2">
            <FormField
              label="Stat 2 Value"
              name="stat2Value"
              value={formData.stat2Value || ''}
              onChange={(value) => handleInputChange('stat2Value', value)}
              error={errors.stat2Value}
            />
            <FormField
              label="Stat 2 Label"
              name="stat2Label"
              value={formData.stat2Label || ''}
              onChange={(value) => handleInputChange('stat2Label', value)}
              error={errors.stat2Label}
            />
          </div>
          <div className="space-y-2 col-span-2">
            <FormField
              label="Stat 3 Value"
              name="stat3Value"
              value={formData.stat3Value || ''}
              onChange={(value) => handleInputChange('stat3Value', value)}
              error={errors.stat3Value}
            />
            <FormField
              label="Stat 3 Label"
              name="stat3Label"
              value={formData.stat3Label || ''}
              onChange={(value) => handleInputChange('stat3Label', value)}
              error={errors.stat3Label}
            />
          </div>
        </div>
      </div>

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
    </div>
  );
};

