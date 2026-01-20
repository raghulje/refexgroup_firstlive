import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';

interface CapitalAreasSectionFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage?: (file: File) => Promise<number | null>;
  uploadingImage?: boolean;
  errors?: Record<string, string>;
}

export const CapitalAreasSectionForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {}
}: CapitalAreasSectionFormProps) => {
  const areas = Array.isArray(formData.areas)
    ? formData.areas
    : (formData.areas
        ? (() => {
            try {
              return JSON.parse(formData.areas);
            } catch {
              return [];
            }
          })()
        : []);

  const visibleAreas =
    areas.length > 0
      ? areas
      : [
          { name: '', icon: '' },
          { name: '', icon: '' },
          { name: '', icon: '' },
          { name: '', icon: '' },
          { name: '', icon: '' },
          { name: '', icon: '' }
        ];

  const updateArea = (index: number, field: string, value: string) => {
    const updated = [...visibleAreas];
    updated[index] = { ...updated[index], [field]: value };
    handleInputChange('areas', updated);
  };

  const addArea = () => {
    handleInputChange('areas', [...visibleAreas, { name: '', icon: '' }]);
  };

  const removeArea = (index: number) => {
    const updated = visibleAreas.filter((_: any, i: number) => i !== index);
    handleInputChange('areas', updated);
  };

  return (
    <div className="space-y-4">
      <FormField
        label="Section Title"
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

      {uploadImage && (
        <ImageUpload
          label="Background Image"
          value={formData.backgroundImage || ''}
          onChange={(mediaId) => handleInputChange('backgroundImage', mediaId)}
          onUpload={uploadImage}
          uploading={uploadingImage || false}
        />
      )}

      <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-semibold text-gray-900">Areas of Interest</h4>
          <button
            type="button"
            onClick={addArea}
            className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            <i className="ri-add-line"></i> Add Area
          </button>
        </div>
        <div className="space-y-3">
          {visibleAreas.length > 0 ? (
            visibleAreas.map((area: any, index: number) => (
              <div
                key={index}
                className="space-y-3 p-4 border border-gray-200 rounded-lg bg-white"
              >
                <div className="flex justify-between items-center">
                  <p className="text-sm font-semibold text-gray-700">
                    Area {index + 1}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeArea(index)}
                    className="px-2 py-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Remove area"
                  >
                    <i className="ri-delete-bin-line"></i>
                  </button>
                </div>
                <FormField
                  label="Name"
                  name={`area-${index}-name`}
                  value={area.name || ''}
                  onChange={(value) => updateArea(index, 'name', value)}
                  error={errors[`areas[${index}].name`]}
                />
                <ImageUpload
                  label="Icon"
                  value={area.icon || ''}
                  onChange={(value) => updateArea(index, 'icon', value)}
                  onUpload={uploadImage}
                  uploading={uploadingImage || false}
                  error={errors[`areas[${index}].icon`]}
                  fileType="icon"
                  allowUrl={true}
                />
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm italic">
              No areas added yet. Click "Add Area" to add focus areas.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};


