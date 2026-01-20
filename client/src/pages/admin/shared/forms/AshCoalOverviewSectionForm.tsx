import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';

interface AshCoalOverviewSectionFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage?: (file: File) => Promise<number | null>;
  uploadingImage?: boolean;
  errors?: Record<string, string>;
}

export const AshCoalOverviewSectionForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {}
}: AshCoalOverviewSectionFormProps) => {
  return (
    <div className="space-y-4">
      <FormField
        label="Heading"
        name="heading"
        value={formData.heading || ''}
        onChange={(value) => handleInputChange('heading', value)}
        required
        error={errors.heading}
      />

      <FormField
        label="Main Paragraph"
        name="description"
        type="textarea"
        rows={6}
        value={formData.description || ''}
        onChange={(value) => handleInputChange('description', value)}
        error={errors.description}
      />

      {/* Right column features – edited as normal fields, stored as JSON behind the scenes */}
      <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50 space-y-4">
        <h3 className="font-semibold text-gray-900">Why us features (right column)</h3>
        {(Array.isArray(formData.features) ? formData.features : new Array(5).fill(null)).map((item: any, index: number) => {
          const feature = item || {};
          const idx = index + 1;
          return (
            <div key={index} className="border border-gray-200 rounded-lg p-3 bg-white space-y-2">
              <p className="text-xs font-semibold text-gray-500 uppercase">Feature {idx}</p>
              <FormField
                label="Title"
                name={`feature_${idx}_title`}
                value={feature.title || ''}
                onChange={(value) => {
                  const current = Array.isArray(formData.features) ? [...formData.features] : new Array(5).fill(null);
                  const updated = current.map((f, i) => (i === index ? { ...(f || {}), title: value } : f || {}));
                  handleInputChange('features', updated);
                }}
              />
              <FormField
                label="Description"
                name={`feature_${idx}_description`}
                type="textarea"
                rows={3}
                value={feature.description || ''}
                onChange={(value) => {
                  const current = Array.isArray(formData.features) ? [...formData.features] : new Array(5).fill(null);
                  const updated = current.map((f, i) => (i === index ? { ...(f || {}), description: value } : f || {}));
                  handleInputChange('features', updated);
                }}
              />
              {uploadImage && (
                <ImageUpload
                  key={`icon-${index}-${feature.iconPath || 'empty'}`}
                  label="Icon Image (Optional)"
                  value={feature.iconPath || ''}
                  onChange={(mediaId) => {
                    const current = Array.isArray(formData.features) ? [...formData.features] : new Array(5).fill(null);
                    const updated = current.map((f, i) => (i === index ? { ...(f || {}), iconPath: mediaId } : f || {}));
                    handleInputChange('features', updated);
                  }}
                  onUpload={uploadImage}
                  uploading={uploadingImage || false}
                  pageName="general"
                  sectionName="general"
                  allowUrl={true}
                  fileType="icon"
                />
              )}
            </div>
          );
        })}
      </div>

      {uploadImage && (
        <ImageUpload
          label="Left Image (Why us)"
          value={formData.image || ''}
          onChange={(mediaId) => handleInputChange('image', mediaId)}
          onUpload={uploadImage}
          uploading={uploadingImage || false}
        />
      )}
    </div>
  );
};
