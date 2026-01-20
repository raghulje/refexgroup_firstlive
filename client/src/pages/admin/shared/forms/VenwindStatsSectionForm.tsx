import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';

interface VenwindStatsSectionFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage?: (file: File) => Promise<number | null>;
  uploadingImage?: boolean;
  errors?: Record<string, string>;
}

export const VenwindStatsSectionForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {}
}: VenwindStatsSectionFormProps) => {
  const stats = Array.isArray(formData.stats)
    ? formData.stats
    : (formData.stats
      ? (() => {
        try {
          return JSON.parse(formData.stats);
        } catch {
          return [
            { value: '', suffix: '', description: '' },
            { value: '', suffix: '', description: '' },
            { value: '', suffix: '', description: '' },
            { value: '', suffix: '', description: '' }
          ];
        }
      })()
      : [
        { value: '', suffix: '', description: '' },
        { value: '', suffix: '', description: '' },
        { value: '', suffix: '', description: '' },
        { value: '', suffix: '', description: '' }
      ]);

  const updateStat = (index: number, field: string, value: string) => {
    const updated = [...stats];
    updated[index] = { ...updated[index], [field]: value };
    handleInputChange('stats', updated);
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
        <h4 className="font-semibold text-gray-900 mb-4">Statistics Cards</h4>
        <div className="space-y-4">
          {stats.map((stat: any, index: number) => (
            <div
              key={index}
              className="space-y-3 p-4 border border-gray-200 rounded-lg bg-white"
            >
              <p className="text-sm font-semibold text-gray-700">
                Stat Card {index + 1}
              </p>

              <div className="grid grid-cols-3 gap-3">
                <FormField
                  label="Value"
                  name={`stat-${index}-value`}
                  value={stat.value || ''}
                  onChange={(value) => updateStat(index, 'value', value)}
                  required
                  error={errors[`stats[${index}].value`]}
                />
                <FormField
                  label="Suffix"
                  name={`stat-${index}-suffix`}
                  value={stat.suffix || ''}
                  onChange={(value) => updateStat(index, 'suffix', value)}
                  helpText="e.g. MW, +, % (optional)"
                  error={errors[`stats[${index}].suffix`]}
                />
                <FormField
                  label="Description"
                  name={`stat-${index}-description`}
                  value={stat.description || ''}
                  onChange={(value) => updateStat(index, 'description', value)}
                  required
                  error={errors[`stats[${index}].description`]}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {uploadImage && (
        <ImageUpload
          label="Stats Image"
          value={formData.image || ''}
          onChange={(mediaId) => handleInputChange('image', mediaId)}
          onUpload={uploadImage}
          uploading={uploadingImage || false}
        />
      )}
    </div>
  );
};

