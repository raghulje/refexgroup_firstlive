import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';

interface MobilitySolutionsSectionFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage?: (file: File) => Promise<number | null>;
  uploadingImage?: boolean;
  errors?: Record<string, string>;
}

export const MobilitySolutionsSectionForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {}
}: MobilitySolutionsSectionFormProps) => {
  const solutions = Array.isArray(formData.solutions)
    ? formData.solutions
    : (formData.solutions
      ? (() => {
        try {
          return JSON.parse(formData.solutions);
        } catch {
          return [
            { title: '', description: '', image: '' },
            { title: '', description: '', image: '' },
            { title: '', description: '', image: '' }
          ];
        }
      })()
      : [
        { title: '', description: '', image: '' },
        { title: '', description: '', image: '' },
        { title: '', description: '', image: '' }
      ]);

  const updateSolution = (index: number, field: string, value: any) => {
    const updated = [...solutions];
    updated[index] = { ...updated[index], [field]: value };
    handleInputChange('solutions', updated);
  };

  return (
    <div className="space-y-4">
      <FormField
        label="Title"
        name="title"
        value={formData.title || ''}
        onChange={(value) => handleInputChange('title', value)}
        error={errors.title}
      />

      <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
        <h4 className="font-semibold text-gray-900 mb-4">Mobility Solutions</h4>
        <div className="space-y-4">
          {solutions.map((solution: any, index: number) => (
            <div
              key={index}
              className="space-y-3 p-4 border border-gray-200 rounded-lg bg-white"
            >
              <p className="text-sm font-semibold text-gray-700">
                Solution {index + 1}
              </p>
              <FormField
                label="Title"
                name={`solution-${index}-title`}
                value={solution.title || ''}
                onChange={(value) => updateSolution(index, 'title', value)}
                required
                error={errors[`solutions[${index}].title`]}
              />
              <FormField
                label="Description"
                name={`solution-${index}-description`}
                type="textarea"
                rows={3}
                value={solution.description || ''}
                onChange={(value) => updateSolution(index, 'description', value)}
                required
                error={errors[`solutions[${index}].description`]}
              />
              <FormField
                label="Icon Class (Optional)"
                name={`solution-${index}-icon`}
                value={typeof solution.icon === 'string' ? solution.icon : ''}
                onChange={(value) => updateSolution(index, 'icon', value)}
                helpText="e.g., ri-car-line (leave empty to use uploaded icon)"
                error={errors[`solutions[${index}].icon`]}
              />
              {uploadImage && (
                <ImageUpload
                  label="Icon Image (SVG/PNG - overrides icon class)"
                  value={typeof solution.icon === 'number' ? solution.icon : ''}
                  onChange={(mediaId) => updateSolution(index, 'icon', mediaId)}
                  onUpload={uploadImage}
                  uploading={uploadingImage || false}
                  fileType="image"
                />
              )}
              {uploadImage && (
                <ImageUpload
                  label="Solution Image"
                  value={solution.image || ''}
                  onChange={(mediaId) => {
                    const updated = [...solutions];
                    updated[index] = { ...updated[index], image: mediaId };
                    handleInputChange('solutions', updated);
                  }}
                  onUpload={uploadImage}
                  uploading={uploadingImage || false}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <FormField
        label="Cities Title"
        name="citiesTitle"
        value={formData.citiesTitle || ''}
        onChange={(value) => handleInputChange('citiesTitle', value)}
        error={errors.citiesTitle}
        helpText="e.g., 'Available In Major Cities'"
      />

      <FormField
        label="Cities"
        name="cities"
        value={formData.cities || ''}
        onChange={(value) => handleInputChange('cities', value)}
        error={errors.cities}
        helpText="e.g., 'Chennai | Bengaluru | Mumbai | Hyderabad | Delhi'"
      />
    </div>
  );
};

