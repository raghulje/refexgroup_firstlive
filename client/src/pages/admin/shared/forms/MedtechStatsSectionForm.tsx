import { FormField } from '../FormField';

interface MedtechStatsSectionFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  errors?: Record<string, string>;
}

export const MedtechStatsSectionForm = ({
  formData,
  handleInputChange,
  errors = {}
}: MedtechStatsSectionFormProps) => {
  const stats = Array.isArray(formData.stats)
    ? formData.stats
    : (formData.stats
        ? (() => {
            try {
              return JSON.parse(formData.stats);
            } catch {
              return [
                { value: '', suffix: '', label: '' },
                { value: '', suffix: '', label: '' },
                { value: '', suffix: '', label: '' }
              ];
            }
          })()
        : [
            { value: '', suffix: '', label: '' },
            { value: '', suffix: '', label: '' },
            { value: '', suffix: '', label: '' }
          ]);

  const updateStat = (index: number, field: string, value: string) => {
    const updated = [...stats];
    updated[index] = { ...updated[index], [field]: value };
    handleInputChange('stats', updated);
  };

  const addStat = () => {
    handleInputChange('stats', [...stats, { value: '', suffix: '', label: '' }]);
  };

  const removeStat = (index: number) => {
    const updated = stats.filter((_: any, i: number) => i !== index);
    handleInputChange('stats', updated);
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-semibold text-gray-900">MedTech Statistics</h4>
          <button
            type="button"
            onClick={addStat}
            className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            <i className="ri-add-line"></i> Add Stat
          </button>
        </div>
        <div className="space-y-3">
          {stats.length > 0 ? (
            stats.map((stat: any, index: number) => (
              <div
                key={index}
                className="space-y-3 p-4 border border-gray-200 rounded-lg bg-white"
              >
                <div className="flex justify-between items-center">
                  <p className="text-sm font-semibold text-gray-700">
                    Stat {index + 1}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeStat(index)}
                    className="px-2 py-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Remove stat"
                  >
                    <i className="ri-delete-bin-line"></i>
                  </button>
                </div>

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
              helpText="e.g. +, % (optional)"
              error={errors[`stats[${index}].suffix`]}
            />
            <FormField
              label="Label"
              name={`stat-${index}-label`}
              value={stat.label || ''}
              onChange={(value) => updateStat(index, 'label', value)}
              required
              error={errors[`stats[${index}].label`]}
            />
          </div>
                </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm italic">
              No stats added yet. Click "Add Stat" to add MedTech statistics.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};


