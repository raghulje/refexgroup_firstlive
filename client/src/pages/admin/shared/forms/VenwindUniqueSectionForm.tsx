import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';

interface VenwindUniqueSectionFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage?: (file: File) => Promise<number | null>;
  uploadingImage?: boolean;
  errors?: Record<string, string>;
}

export const VenwindUniqueSectionForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {}
}: VenwindUniqueSectionFormProps) => {
  const features = Array.isArray(formData.features)
    ? formData.features.map((f: any) => typeof f === 'string' ? { text: f, icon: '' } : f)
    : (formData.features
      ? (() => {
        try {
          const parsed = JSON.parse(formData.features);
          return Array.isArray(parsed)
            ? parsed.map((f: any) => typeof f === 'string' ? { text: f, icon: '' } : f)
            : [];
        } catch {
          return [];
        }
      })()
      : []);

  const updateFeature = (index: number, field: string, value: any) => {
    const updated = [...features];
    updated[index] = { ...updated[index], [field]: value };
    handleInputChange('features', updated);
  };

  const addFeature = () => {
    handleInputChange('features', [...features, { text: '', icon: '' }]);
  };

  const removeFeature = (index: number) => {
    const updated = features.filter((_: any, i: number) => i !== index);
    handleInputChange('features', updated);
  };

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
        label="Description"
        name="description"
        type="textarea"
        rows={4}
        value={formData.description || ''}
        onChange={(value) => handleInputChange('description', value)}
        error={errors.description}
      />

      <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-semibold text-gray-900">Unique Features</h4>
          <button
            type="button"
            onClick={addFeature}
            className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            <i className="ri-add-line"></i> Add Feature
          </button>
        </div>
        <div className="space-y-6">
          {features.length > 0 ? (
            features.map((feature: any, index: number) => (
              <div key={index} className="p-4 bg-white border border-gray-200 rounded-lg space-y-4">
                <div className="flex justify-between items-start">
                  <p className="font-medium text-sm text-gray-700">Feature {index + 1}</p>
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    title="Remove feature"
                  >
                    <i className="ri-delete-bin-line"></i>
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    label="Feature Text"
                    name={`feature-${index}-text`}
                    value={feature.text || ''}
                    onChange={(value) => updateFeature(index, 'text', value)}
                    error={errors[`features[${index}].text`]}
                  />

                  {uploadImage && (
                    <ImageUpload
                      label="Feature Icon (SVG/Image)"
                      value={feature.icon || ''}
                      onChange={(mediaId) => updateFeature(index, 'icon', mediaId)}
                      onUpload={uploadImage}
                      uploading={uploadingImage || false}
                      fileType="image"
                    />
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm italic">
              No features added yet. Click "Add Feature" to add unique selling points.
            </p>
          )}
        </div>
      </div>

      {uploadImage && (
        <ImageUpload
          label="Unique Section Image"
          value={formData.image || ''}
          onChange={(mediaId) => handleInputChange('image', mediaId)}
          onUpload={uploadImage}
          uploading={uploadingImage || false}
        />
      )}
    </div>
  );
};

