import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';

interface RenewablesBenefitsFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage?: (file: File) => Promise<number | null>;
  uploadingImage?: boolean;
  errors?: Record<string, string>;
}

export const RenewablesBenefitsForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {}
}: RenewablesBenefitsFormProps) => {
  // Parse benefits from JSON or use array
  let benefits: any[] = [];
  if (formData.benefits) {
    if (Array.isArray(formData.benefits)) {
      benefits = formData.benefits;
    } else if (typeof formData.benefits === 'string') {
      try {
        benefits = JSON.parse(formData.benefits);
      } catch {
        benefits = [];
      }
    }
  }

  const updateBenefit = (index: number, field: string, value: any) => {
    const updated = [...benefits];
    if (!updated[index]) {
      updated[index] = { icon: '', title: '', description: '' };
    }
    updated[index][field] = value;
    handleInputChange('benefits', updated);
  };

  const addBenefit = () => {
    const updated = [...benefits, { icon: '', title: '', description: '' }];
    handleInputChange('benefits', updated);
  };

  const removeBenefit = (index: number) => {
    const updated = benefits.filter((_, i) => i !== index);
    handleInputChange('benefits', updated);
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

      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Benefits
          </label>
          <button
            type="button"
            onClick={addBenefit}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <i className="ri-add-line"></i>
            Add Benefit
          </button>
        </div>

        {benefits.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500 text-sm mb-2">No benefits added yet</p>
            <button
              type="button"
              onClick={addBenefit}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Click to add your first benefit
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {benefits.map((benefit: any, index: number) => (
              <div key={index} className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold text-gray-900">Benefit {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeBenefit(index)}
                    className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-md transition-colors text-sm flex items-center gap-1"
                  >
                    <i className="ri-delete-bin-line"></i> Remove
                  </button>
                </div>
                <div className="space-y-3">
                  {uploadImage && (
                    <ImageUpload
                      label="Icon"
                      value={benefit.icon || ''}
                      onChange={(value) => updateBenefit(index, 'icon', value)}
                      onUpload={uploadImage}
                      uploading={uploadingImage || false}
                      error={errors[`benefit${index}Icon`]}
                      fileType="icon"
                      allowUrl={true}
                    />
                  )}
                  <FormField
                    label="Title"
                    name={`benefit-${index}-title`}
                    value={benefit.title || ''}
                    onChange={(value) => updateBenefit(index, 'title', value)}
                    required
                    error={errors[`benefit-${index}-title`]}
                  />
                  <FormField
                    label="Description"
                    name={`benefit-${index}-description`}
                    type="textarea"
                    rows={3}
                    value={benefit.description || ''}
                    onChange={(value) => updateBenefit(index, 'description', value)}
                    required
                    error={errors[`benefit-${index}-description`]}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

