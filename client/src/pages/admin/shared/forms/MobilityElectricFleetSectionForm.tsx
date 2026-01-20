import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';

interface MobilityElectricFleetSectionFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage?: (file: File) => Promise<number | null>;
  uploadingImage?: boolean;
  errors?: Record<string, string>;
}

export const MobilityElectricFleetSectionForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {}
}: MobilityElectricFleetSectionFormProps) => {
  const advantages = Array.isArray(formData.advantages)
    ? formData.advantages
    : (formData.advantages
      ? (() => {
        try {
          return JSON.parse(formData.advantages);
        } catch {
          return [
            { title: '', description: '' },
            { title: '', description: '' },
            { title: '', description: '' }
          ];
        }
      })()
      : [
        { title: '', description: '' },
        { title: '', description: '' },
        { title: '', description: '' }
      ]);

  const updateAdvantage = (index: number, field: string, value: any) => {
    const updated = [...advantages];
    updated[index] = { ...updated[index], [field]: value };
    handleInputChange('advantages', updated);
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
        rows={4}
        value={formData.description || ''}
        onChange={(value) => handleInputChange('description', value)}
        error={errors.description}
      />

      <div className="grid grid-cols-2 gap-4">
        {uploadImage && (
          <>
            <ImageUpload
              label="Image 1"
              value={formData.image1 || ''}
              onChange={(mediaId) => handleInputChange('image1', mediaId)}
              onUpload={uploadImage}
              uploading={uploadingImage || false}
            />
            <ImageUpload
              label="Image 2"
              value={formData.image2 || ''}
              onChange={(mediaId) => handleInputChange('image2', mediaId)}
              onUpload={uploadImage}
              uploading={uploadingImage || false}
            />
          </>
        )}
      </div>

      {uploadImage && (
        <ImageUpload
          label="Bottom Image"
          value={formData.imageBottom || ''}
          onChange={(mediaId) => handleInputChange('imageBottom', mediaId)}
          onUpload={uploadImage}
          uploading={uploadingImage || false}
        />
      )}

      <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
        <h4 className="font-semibold text-gray-900 mb-4">Electric Fleet Advantages</h4>
        <div className="space-y-3">
          {advantages.map((advantage: any, index: number) => (
            <div
              key={index}
              className="space-y-2 p-3 border border-gray-200 rounded-lg bg-white"
            >
              <p className="text-xs font-semibold text-gray-700">
                Advantage {index + 1}
              </p>
              <FormField
                label="Title"
                name={`advantage-${index}-title`}
                value={advantage.title || ''}
                onChange={(value) => updateAdvantage(index, 'title', value)}
                required
                error={errors[`advantages[${index}].title`]}
              />
              <FormField
                label="Description"
                name={`advantage-${index}-description`}
                type="textarea"
                rows={2}
                value={advantage.description || ''}
                onChange={(value) => updateAdvantage(index, 'description', value)}
                required
                error={errors[`advantages[${index}].description`]}
              />
              <FormField
                label="Icon Class (Optional)"
                name={`advantage-${index}-icon`}
                value={typeof advantage.icon === 'string' ? advantage.icon : ''}
                onChange={(value) => updateAdvantage(index, 'icon', value)}
                helpText="e.g., ri-leaf-line (leave empty to use uploaded icon)"
              />
              {uploadImage && (
                <ImageUpload
                  label="Icon Image (SVG/PNG - overrides icon class)"
                  value={typeof advantage.icon === 'number' ? advantage.icon : ''}
                  onChange={(mediaId) => updateAdvantage(index, 'icon', mediaId)}
                  onUpload={uploadImage}
                  uploading={uploadingImage || false}
                  fileType="image"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

