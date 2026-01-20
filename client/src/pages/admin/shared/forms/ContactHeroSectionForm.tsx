import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';
import { ImagePositionControl } from '../ImagePositionControl';

interface ContactHeroSectionFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage?: (file: File, pageName?: string, sectionName?: string) => Promise<number | null>;
  uploadingImage?: boolean;
  errors?: Record<string, string>;
  pageName?: string;
  sectionName?: string;
}

export const ContactHeroSectionForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {},
  pageName = 'contact',
  sectionName = 'hero'
}: ContactHeroSectionFormProps) => {
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
        label="Title"
        name="title"
        value={formData.title || ''}
        onChange={(value) => handleInputChange('title', value)}
        required
        error={errors.title}
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

      <FormField
        label="Office Title"
        name="officeTitle"
        value={formData.officeTitle || ''}
        onChange={(value) => handleInputChange('officeTitle', value)}
        error={errors.officeTitle}
        helpText="e.g., CORPORATE OFFICE"
      />

      <FormField
        label="Company Name"
        name="companyName"
        value={formData.companyName || ''}
        onChange={(value) => handleInputChange('companyName', value)}
        error={errors.companyName}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Address (One line per address line)
        </label>
        <textarea
          value={Array.isArray(formData.address) ? formData.address.join('\n') : (formData.address || '')}
          onChange={(e) => {
            const lines = e.target.value.split('\n').filter(line => line.trim());
            handleInputChange('address', lines);
          }}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Refex Building,&#10;67, Bazullah Road,&#10;Parthasarathy Puram, T Nagar&#10;Chennai – 600017"
        />
        <p className="mt-1 text-sm text-gray-500">Enter each address line on a new line</p>
      </div>

      <FormField
        label="Phone"
        name="phone"
        value={formData.phone || ''}
        onChange={(value) => handleInputChange('phone', value)}
        error={errors.phone}
        helpText="e.g., 044 – 4340 5900/950"
      />

      <FormField
        label="Email"
        name="email"
        type="email"
        value={formData.email || ''}
        onChange={(value) => handleInputChange('email', value)}
        error={errors.email}
      />

      <FormField
        label="Overlay Opacity (%)"
        name="overlayOpacity"
        type="number"
        value={formData.overlayOpacity !== undefined ? formData.overlayOpacity : 10}
        onChange={(value) => handleInputChange('overlayOpacity', value)}
        error={errors.overlayOpacity}
        helpText="Opacity of the dark overlay on the background image (0-100). Default: 10"
        min={0}
        max={100}
      />
    </div>
  );
};

