import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';
import { ImagePositionControl } from '../ImagePositionControl';

interface PharmaHeroSectionFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage?: (file: File, pageName?: string, sectionName?: string) => Promise<number | null>;
  uploadingImage?: boolean;
  errors?: Record<string, string>;
  pageName?: string;
  sectionName?: string;
}

export const PharmaHeroSectionForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {},
  pageName = 'pharma',
  sectionName = 'hero'
}: PharmaHeroSectionFormProps) => {
  const stats = Array.isArray(formData.stats)
    ? formData.stats
    : (formData.stats
        ? (() => {
            try {
              return JSON.parse(formData.stats);
            } catch {
              return [
                { value: '', suffix: '', label: '' },
                { value: '', suffix: '', label: '' },
                { value: '', suffix: '', label: '' }
              ];
            }
          })()
        : [
            { value: '', suffix: '', label: '' },
            { value: '', suffix: '', label: '' },
            { value: '', suffix: '', label: '' }
          ]);

  const updateStat = (index: number, field: string, value: string) => {
    const updated = [...stats];
    updated[index] = { ...updated[index], [field]: value };
    handleInputChange('stats', updated);
  };

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

      <FormField
        label="Description"
        name="description"
        type="textarea"
        rows={4}
        value={formData.description || ''}
        onChange={(value) => handleInputChange('description', value)}
        error={errors.description}
      />

      <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
        <h4 className="font-semibold text-gray-900 mb-4">Hero Statistics</h4>
        <div className="space-y-4">
          {stats.map((stat: any, index: number) => (
            <div
              key={index}
              className="space-y-3 p-4 border border-gray-200 rounded-lg bg-white"
            >
              <p className="text-sm font-semibold text-gray-700">
                Stat {index + 1}
              </p>
              <div className="grid grid-cols-3 gap-3">
                <FormField
                  label="Value"
                  name={`stat-${index}-value`}
                  value={stat.value || ''}
                  onChange={(value) => updateStat(index, 'value', value)}
                  required
                  error={errors[`stats[${index}].value`]}
                />
                <FormField
                  label="Suffix"
                  name={`stat-${index}-suffix`}
                  value={stat.suffix || ''}
                  onChange={(value) => updateStat(index, 'suffix', value)}
                  helpText="e.g. +, % (optional)"
                  error={errors[`stats[${index}].suffix`]}
                />
                <FormField
                  label="Label"
                  name={`stat-${index}-label`}
                  value={stat.label || ''}
                  onChange={(value) => updateStat(index, 'label', value)}
                  required
                  error={errors[`stats[${index}].label`]}
                />
              </div>
            </div>
          ))}
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

