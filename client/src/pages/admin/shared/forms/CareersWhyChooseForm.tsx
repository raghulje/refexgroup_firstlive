import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';

interface CareersWhyChooseFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage?: (file: File) => Promise<number | null>;
  uploadingImage?: boolean;
  errors?: Record<string, string>;
}

export const CareersWhyChooseForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {}
}: CareersWhyChooseFormProps) => {
  // Parse features from JSON or use array
  let features = [];
  if (Array.isArray(formData.features)) {
    features = formData.features;
  } else if (typeof formData.features === 'string' && formData.features) {
    try {
      features = JSON.parse(formData.features);
    } catch {
      features = [];
    }
  }

  // Ensure we have at least 3 features
  while (features.length < 3) {
    features.push({ icon: '', title: '', description: '' });
  }

  const updateFeature = (index: number, field: string, value: string) => {
    const updated = [...features];
    updated[index] = { ...updated[index], [field]: value };
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Features (3 items)
        </label>
        <div className="space-y-4">
          {features.slice(0, 3).map((feature: any, index: number) => (
            <div key={index} className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
              <h4 className="font-semibold text-gray-900 mb-3">Feature {index + 1}</h4>
              <div className="space-y-3">
                <ImageUpload
                  label="Icon"
                  value={feature.icon || ''}
                  onChange={(value) => updateFeature(index, 'icon', value)}
                  onUpload={uploadImage}
                  uploading={uploadingImage || false}
                  error={errors[`feature${index}Icon`]}
                  fileType="icon"
                  allowUrl={true}
                />
                <FormField
                  label="Title"
                  name={`feature-${index}-title`}
                  value={feature.title || ''}
                  onChange={(value) => updateFeature(index, 'title', value)}
                  required
                />
                <FormField
                  label="Description"
                  name={`feature-${index}-description`}
                  type="textarea"
                  rows={2}
                  value={feature.description || ''}
                  onChange={(value) => updateFeature(index, 'description', value)}
                  required
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

