import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';

interface OverviewSectionFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage: (file: File) => Promise<string | null>;
  uploadingImage: boolean;
  errors?: Record<string, string>;
}

export const OverviewSectionForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {}
}: OverviewSectionFormProps) => {
  return (
    <div className="space-y-4">
      <FormField
        label="Heading"
        name="heading"
        value={formData.heading || ''}
        onChange={(value) => handleInputChange('heading', value)}
        error={errors.heading}
      />

      <FormField
        label="Tagline"
        name="tagline"
        value={formData.tagline || ''}
        onChange={(value) => handleInputChange('tagline', value)}
        error={errors.tagline}
        helpText="e.g., 'We thrive on RESILIENCE'"
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Years in Business"
          name="yearsInBusiness"
          type="number"
          value={formData.yearsInBusiness || ''}
          onChange={(value) => handleInputChange('yearsInBusiness', value)}
          error={errors.yearsInBusiness}
          helpText="e.g., 23"
        />
        <FormField
          label="People Impacted (Million)"
          name="peopleImpacted"
          type="number"
          value={formData.peopleImpacted || ''}
          onChange={(value) => handleInputChange('peopleImpacted', value)}
          error={errors.peopleImpacted}
          helpText="e.g., 2"
        />
      </div>

      <FormField
        label="Description"
        name="description"
        type="textarea"
        rows={8}
        value={formData.description || ''}
        onChange={(value) => handleInputChange('description', value)}
        error={errors.description}
        helpText="Main description paragraphs (separate paragraphs with double line breaks)"
      />

      {uploadImage && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logo
            </label>
            <ImageUpload
              label=""
              value={formData.logo || ''}
              onChange={(mediaId) => handleInputChange('logo', mediaId)}
              onUpload={uploadImage}
              uploading={uploadingImage}
            />
            {errors.logo && (
              <p className="mt-1 text-sm text-red-600">{errors.logo}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Main Image (Office Group Photo)
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
        </div>
      )}
    </div>
  );
};

