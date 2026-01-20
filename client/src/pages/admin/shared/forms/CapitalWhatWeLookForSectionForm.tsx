import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';

interface CapitalWhatWeLookForSectionFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage?: (file: File) => Promise<number | null>;
  uploadingImage?: boolean;
  errors?: Record<string, string>;
}

export const CapitalWhatWeLookForSectionForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {}
}: CapitalWhatWeLookForSectionFormProps) => {
  const factors = Array.isArray(formData.factors)
    ? formData.factors
    : (formData.factors
      ? (() => {
        try {
          return JSON.parse(formData.factors);
        } catch {
          return [];
        }
      })()
      : []);

  const visibleFactors =
    factors.length > 0
      ? factors
      : [
        { icon: '', title: '' },
        { icon: '', title: '' },
        { icon: '', title: '' }
      ];

  const updateFactor = (index: number, field: string, value: any) => {
    const updated = [...visibleFactors];
    updated[index] = { ...updated[index], [field]: value };
    handleInputChange('factors', updated);
  };

  const addFactor = () => {
    handleInputChange('factors', [...visibleFactors, { icon: '', title: '' }]);
  };

  const removeFactor = (index: number) => {
    const updated = visibleFactors.filter((_: any, i: number) => i !== index);
    handleInputChange('factors', updated);
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
        label="Description 1"
        name="description1"
        type="textarea"
        rows={4}
        value={formData.description1 || ''}
        onChange={(value) => handleInputChange('description1', value)}
        error={errors.description1}
        helpText="First paragraph (e.g., mission statement)"
      />

      <FormField
        label="Description 2"
        name="description2"
        type="textarea"
        rows={2}
        value={formData.description2 || ''}
        onChange={(value) => handleInputChange('description2', value)}
        error={errors.description2}
        helpText="Second paragraph (e.g., 'When evaluating a startup...')"
      />

      <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-semibold text-gray-900">Evaluation Factors</h4>
          <button
            type="button"
            onClick={addFactor}
            className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            <i className="ri-add-line"></i> Add Factor
          </button>
        </div>
        <div className="space-y-3">
          {visibleFactors.length > 0 ? (
            visibleFactors.map((factor: any, index: number) => (
              <div
                key={index}
                className="space-y-3 p-4 border border-gray-200 rounded-lg bg-white"
              >
                <div className="flex justify-between items-center">
                  <p className="text-sm font-semibold text-gray-700">
                    Factor {index + 1}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeFactor(index)}
                    className="px-2 py-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Remove factor"
                  >
                    <i className="ri-delete-bin-line"></i>
                  </button>
                </div>
                <ImageUpload
                  label="Icon"
                  value={factor.icon || ''}
                  onChange={(value) => updateFactor(index, 'icon', value)}
                  onUpload={uploadImage}
                  uploading={uploadingImage || false}
                  error={errors[`factors[${index}].icon`]}
                  fileType="icon"
                  allowUrl={true}
                />
                <FormField
                  label="Title"
                  name={`factor-${index}-title`}
                  value={factor.title || ''}
                  onChange={(value) => updateFactor(index, 'title', value)}
                  required
                  error={errors[`factors[${index}].title`]}
                />
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm italic">
              No factors added yet. Click "Add Factor" to add evaluation criteria.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};


