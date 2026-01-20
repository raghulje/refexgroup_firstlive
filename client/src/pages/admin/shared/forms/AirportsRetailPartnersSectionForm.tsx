import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';

interface AirportsRetailPartnersSectionFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage?: (file: File) => Promise<number | null>;
  uploadingImage?: boolean;
  errors?: Record<string, string>;
}

export const AirportsRetailPartnersSectionForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {}
}: AirportsRetailPartnersSectionFormProps) => {
  const features = Array.isArray(formData.features)
    ? formData.features
    : (formData.features
      ? (() => {
        try {
          return JSON.parse(formData.features);
        } catch {
          return [];
        }
      })()
      : [
        { title: '', description: '', icon: '' },
        { title: '', description: '', icon: '' },
        { title: '', description: '', icon: '' },
        { title: '', description: '', icon: '' }
      ]);

  const updateFeature = (index: number, field: string, value: any) => {
    const updated = [...features];
    updated[index] = { ...updated[index], [field]: value };
    handleInputChange('features', updated);
  };

  const addFeature = () => {
    handleInputChange('features', [...features, { title: '', description: '', icon: '' }]);
  };

  const removeFeature = (index: number) => {
    const updated = features.filter((_: any, i: number) => i !== index);
    handleInputChange('features', updated);
  };

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
        label="Gradient Heading"
        name="gradientTitle"
        value={formData.gradientTitle || ''}
        onChange={(value) => handleInputChange('gradientTitle', value)}
        error={errors.gradientTitle}
        helpText="Main large heading (e.g. The Refex Difference in Travel Retail)"
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

      {uploadImage && (
        <ImageUpload
          label="Right Side Image"
          value={formData.image || ''}
          onChange={(mediaId) => handleInputChange('image', mediaId)}
          onUpload={uploadImage}
          uploading={uploadingImage || false}
        />
      )}

      <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-semibold text-gray-900">Partner Features</h4>
          <button
            type="button"
            onClick={addFeature}
            className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
          >
            <i className="ri-add-line"></i> Add Feature
          </button>
        </div>
        <div className="space-y-4">
          {features.length > 0 ? (
            features.map((feature: any, index: number) => (
              <div
                key={index}
                className="space-y-3 p-4 border border-gray-200 rounded-lg bg-white"
              >
                <div className="flex justify-between items-center">
                  <p className="text-sm font-semibold text-gray-700">
                    Feature {index + 1}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="px-2 py-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Remove feature"
                  >
                    <i className="ri-delete-bin-line"></i>
                  </button>
                </div>

                <FormField
                  label="Title"
                  name={`feature-${index}-title`}
                  value={feature.title || ''}
                  onChange={(value) => updateFeature(index, 'title', value)}
                  required
                  error={errors[`features[${index}].title`]}
                />

                <FormField
                  label="Description"
                  name={`feature-${index}-description`}
                  type="textarea"
                  rows={3}
                  value={feature.description || ''}
                  onChange={(value) => updateFeature(index, 'description', value)}
                  error={errors[`features[${index}].description`]}
                />

                {uploadImage && (
                  <div className="space-y-2">
                    <ImageUpload
                      label="Feature Icon"
                      value={feature.icon || ''}
                      onChange={(mediaId) => updateFeature(index, 'icon', mediaId)}
                      onUpload={uploadImage}
                      uploading={uploadingImage || false}
                      allowUrl={true}
                    />
                    <p className="text-xs text-gray-500">
                      Upload an icon image or use an icon class (e.g., ri-check-line)
                    </p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm italic">
              No features added yet. Click "Add Feature" to add partner benefits.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};


