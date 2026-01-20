import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';

interface PharmaRDCapabilitySectionFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage?: (file: File) => Promise<number | null>;
  uploadingImage?: boolean;
  errors?: Record<string, string>;
}

export const PharmaRDCapabilitySectionForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {}
}: PharmaRDCapabilitySectionFormProps) => {
  const capabilities = Array.isArray(formData.capabilities)
    ? formData.capabilities
    : (formData.capabilities
      ? (() => {
        try {
          return JSON.parse(formData.capabilities);
        } catch {
          return [];
        }
      })()
      : []);

  const updateCapability = (index: number, field: string, value: any) => {
    const updated = [...capabilities];
    updated[index] = { ...updated[index], [field]: value };
    handleInputChange('capabilities', updated);
  };

  const addCapability = () => {
    handleInputChange('capabilities', [...capabilities, { title: '', icon: 'ri-flask-line' }]);
  };

  const removeCapability = (index: number) => {
    const updated = capabilities.filter((_: any, i: number) => i !== index);
    handleInputChange('capabilities', updated);
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

      <FormField
        label="Description"
        name="description"
        type="textarea"
        rows={3}
        value={formData.description || ''}
        onChange={(value) => handleInputChange('description', value)}
        error={errors.description}
      />

      <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-semibold text-gray-900">R&D Capabilities</h4>
          <button
            type="button"
            onClick={addCapability}
            className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            <i className="ri-add-line"></i> Add Capability
          </button>
        </div>
        <div className="space-y-4">
          {capabilities.length > 0 ? (
            capabilities.map((capability: any, index: number) => (
              <div
                key={index}
                className="space-y-3 p-4 border border-gray-200 rounded-lg bg-white"
              >
                <div className="flex justify-between items-center">
                  <p className="text-sm font-semibold text-gray-700">
                    Capability {index + 1}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeCapability(index)}
                    className="px-2 py-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Remove capability"
                  >
                    <i className="ri-delete-bin-line"></i>
                  </button>
                </div>

                <FormField
                  label="Title"
                  name={`capability-${index}-title`}
                  value={capability.title || ''}
                  onChange={(value) => updateCapability(index, 'title', value)}
                  required
                  error={errors[`capabilities[${index}].title`]}
                />

                <div className="grid grid-cols-1 gap-3">
                  <FormField
                    label="Icon Class (Optional)"
                    name={`capability-${index}-icon`}
                    value={typeof capability.icon === 'string' ? capability.icon : 'ri-flask-line'}
                    onChange={(value) => updateCapability(index, 'icon', value)}
                    helpText="e.g., ri-flask-line, ri-microscope-line (leave empty to use uploaded icon)"
                    error={errors[`capabilities[${index}].icon`]}
                  />

                  {uploadImage && (
                    <ImageUpload
                      label="Icon Image (SVG/PNG - overrides icon class)"
                      value={typeof capability.icon === 'number' ? capability.icon : ''}
                      onChange={(mediaId) => updateCapability(index, 'icon', mediaId)}
                      onUpload={uploadImage}
                      uploading={uploadingImage || false}
                      fileType="image"
                    />
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm italic">
              No capabilities added yet. Click "Add Capability" to add R&D capability items.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

