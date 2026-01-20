import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';

interface VenwindTechnicalSpecsSectionFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage?: (file: File) => Promise<number | null>;
  uploadingImage?: boolean;
  errors?: Record<string, string>;
}

export const VenwindTechnicalSpecsSectionForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {}
}: VenwindTechnicalSpecsSectionFormProps) => {
  const specs = Array.isArray(formData.specs)
    ? formData.specs
    : (formData.specs
      ? (() => {
        try {
          return JSON.parse(formData.specs);
        } catch {
          return [
            { value: '', label: '' },
            { value: '', label: '' },
            { value: '', label: '' },
            { value: '', label: '' }
          ];
        }
      })()
      : [
        { value: '', label: '' },
        { value: '', label: '' },
        { value: '', label: '' },
        { value: '', label: '' }
      ]);

  const updateSpec = (index: number, field: string, value: string) => {
    const updated = [...specs];
    updated[index] = { ...updated[index], [field]: value };
    handleInputChange('specs', updated);
  };

  const addSpec = () => {
    handleInputChange('specs', [...specs, { value: '', label: '' }]);
  };

  const removeSpec = (index: number) => {
    const updated = specs.filter((_: any, i: number) => i !== index);
    handleInputChange('specs', updated);
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

      <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-semibold text-gray-900">Technical Specifications</h4>
          <button
            type="button"
            onClick={addSpec}
            className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            <i className="ri-add-line"></i> Add Spec
          </button>
        </div>
        <div className="space-y-3">
          {specs.length > 0 ? (
            specs.map((spec: any, index: number) => (
              <div
                key={index}
                className="space-y-3 p-4 border border-gray-200 rounded-lg bg-white"
              >
                <div className="flex justify-between items-center">
                  <p className="text-sm font-semibold text-gray-700">
                    Spec Card {index + 1}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeSpec(index)}
                    className="px-2 py-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Remove spec"
                  >
                    <i className="ri-delete-bin-line"></i>
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    label="Value"
                    name={`spec-${index}-value`}
                    value={spec.value || ''}
                    onChange={(value) => updateSpec(index, 'value', value)}
                    required
                    error={errors[`specs[${index}].value`]}
                  />
                  <FormField
                    label="Label"
                    name={`spec-${index}-label`}
                    value={spec.label || ''}
                    onChange={(value) => updateSpec(index, 'label', value)}
                    required
                    error={errors[`specs[${index}].label`]}
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm italic">
              No specs added yet. Click "Add Spec" to add technical specification cards.
            </p>
          )}
        </div>
      </div>

      {uploadImage && (
        <ImageUpload
          label="Technical Specs Image"
          value={formData.image || ''}
          onChange={(mediaId) => handleInputChange('image', mediaId)}
          onUpload={uploadImage}
          uploading={uploadingImage || false}
        />
      )}
    </div>
  );
};

