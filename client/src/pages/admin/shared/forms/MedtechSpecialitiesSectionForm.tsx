import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';

interface MedtechSpecialitiesSectionFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage?: (file: File) => Promise<number | null>;
  uploadingImage?: boolean;
  errors?: Record<string, string>;
}

export const MedtechSpecialitiesSectionForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {}
}: MedtechSpecialitiesSectionFormProps) => {
  const specialities = Array.isArray(formData.specialities)
    ? formData.specialities
    : (formData.specialities
      ? (() => {
        try {
          return JSON.parse(formData.specialities);
        } catch {
          return [];
        }
      })()
      : []);

  const normalizedSpecialities =
    specialities.length > 0
      ? specialities
      : [
        { icon: 'ri-heart-pulse-line', name: '' },
        { icon: 'ri-capsule-line', name: '' },
        { icon: 'ri-brain-line', name: '' },
        { icon: 'ri-bone-line', name: '' },
        { icon: 'ri-stethoscope-line', name: '' }
      ];

  const updateSpeciality = (index: number, field: string, value: string | number) => {
    const updated = [...normalizedSpecialities];
    updated[index] = { ...updated[index], [field]: value };
    handleInputChange('specialities', updated);
  };

  const handleIconUpload = async (index: number, file: File) => {
    if (!uploadImage) return null;
    try {
      const mediaId = await uploadImage(file);
      if (mediaId) {
        // Resolve media ID to path immediately
        const { mediaService } = await import('../../../../services/apiService');
        const media = await mediaService.getById(mediaId);
        if (media?.filePath) {
          updateSpeciality(index, 'icon', media.filePath);
          return mediaId;
        }
      }
      return null;
    } catch (error) {
      console.error("Error resolving uploaded icon:", error);
      return null;
    }
  };

  const addSpeciality = () => {
    handleInputChange('specialities', [...normalizedSpecialities, { icon: 'ri-check-line', name: '' }]);
  };

  const removeSpeciality = (index: number) => {
    const updated = normalizedSpecialities.filter((_: any, i: number) => i !== index);
    handleInputChange('specialities', updated);
  };

  return (
    <div className="space-y-4">
      <FormField
        label="Badge"
        name="badge"
        value={formData.badge || ''}
        onChange={(value) => handleInputChange('badge', value)}
        error={errors.badge}
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
          label="Main Image"
          value={formData.image || ''}
          onChange={(mediaId) => handleInputChange('image', mediaId)}
          onUpload={uploadImage}
          uploading={uploadingImage || false}
        />
      )}

      <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-semibold text-gray-900">Specialities List</h4>
          <button
            type="button"
            onClick={addSpeciality}
            className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            <i className="ri-add-line"></i> Add Speciality
          </button>
        </div>
        <div className="space-y-3">
          {normalizedSpecialities.length > 0 ? (
            normalizedSpecialities.map((item: any, index: number) => (
              <div
                key={index}
                className="space-y-3 p-4 border border-gray-200 rounded-lg bg-white"
              >
                <div className="flex justify-between items-center">
                  <p className="text-sm font-semibold text-gray-700">
                    Speciality {index + 1}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeSpeciality(index)}
                    className="px-2 py-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Remove speciality"
                  >
                    <i className="ri-delete-bin-line"></i>
                  </button>
                </div>

                <ImageUpload
                  label="Icon (Upload Image or enter Remix Class)"
                  value={item.icon || ''}
                  onChange={(value) => updateSpeciality(index, 'icon', value)}
                  onUpload={(file) => handleIconUpload(index, file)}
                  uploading={uploadingImage || false}
                  error={errors[`specialities[${index}].icon`]}
                  allowUrl={true}
                  helpText="Upload an icon or enter a class like 'ri-heart-line'"
                />

                <FormField
                  label="Name"
                  name={`speciality-${index}-name`}
                  value={item.name || ''}
                  onChange={(value) => updateSpeciality(index, 'name', value)}
                  required
                  error={errors[`specialities[${index}].name`]}
                />
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm italic">
              No specialities added yet. Click "Add Speciality" to add speciality items.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};


