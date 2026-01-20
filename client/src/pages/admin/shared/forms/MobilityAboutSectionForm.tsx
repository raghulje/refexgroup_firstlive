import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';

interface MobilityAboutSectionFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage?: (file: File) => Promise<number | null>;
  uploadingImage?: boolean;
  errors?: Record<string, string>;
}

export const MobilityAboutSectionForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {}
}: MobilityAboutSectionFormProps) => {
  const paragraphs = Array.isArray(formData.paragraphs)
    ? formData.paragraphs
    : (formData.paragraphs
      ? (() => {
        try {
          return JSON.parse(formData.paragraphs);
        } catch {
          return [];
        }
      })()
      : []);

  const updateParagraph = (index: number, value: string) => {
    const updated = [...paragraphs];
    updated[index] = value;
    handleInputChange('paragraphs', updated);
  };

  const addParagraph = () => {
    handleInputChange('paragraphs', [...paragraphs, '']);
  };

  const removeParagraph = (index: number) => {
    const updated = paragraphs.filter((_: any, i: number) => i !== index);
    handleInputChange('paragraphs', updated);
  };

  return (
    <div className="space-y-4">
      <FormField
        label="Badge"
        name="badge"
        value={formData.badge || ''}
        onChange={(value) => handleInputChange('badge', value)}
        error={errors.badge}
        helpText="Small badge text (optional)"
      />

      <FormField
        label="Heading"
        name="heading"
        value={formData.heading || ''}
        onChange={(value) => handleInputChange('heading', value)}
        error={errors.heading}
      />

      <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-semibold text-gray-900">About Paragraphs</h4>
          <button
            type="button"
            onClick={addParagraph}
            className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            <i className="ri-add-line"></i> Add Paragraph
          </button>
        </div>
        <div className="space-y-3">
          {paragraphs.length > 0 ? (
            paragraphs.map((paragraph: string, index: number) => (
              <div key={index} className="relative">
                <div className="flex justify-end mb-1">
                  <button
                    type="button"
                    onClick={() => removeParagraph(index)}
                    className="px-2 py-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
                    title="Remove paragraph"
                  >
                    <i className="ri-delete-bin-line"></i>
                  </button>
                </div>
                <FormField
                  label={`Paragraph ${index + 1}`}
                  name={`paragraph-${index}`}
                  type="textarea"
                  rows={5}
                  value={paragraph || ''}
                  onChange={(value) => updateParagraph(index, value)}
                  error={errors[`paragraphs[${index}]`]}
                />
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm italic">
              No paragraphs added yet. Click "Add Paragraph" to add about text.
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Button Text"
          name="buttonText"
          value={formData.buttonText || ''}
          onChange={(value) => handleInputChange('buttonText', value)}
          error={errors.buttonText}
        />
        <FormField
          label="Button Link"
          name="buttonLink"
          value={formData.buttonLink || ''}
          onChange={(value) => handleInputChange('buttonLink', value)}
          error={errors.buttonLink}
          helpText="URL (e.g., #solutions)"
        />
      </div>

      {uploadImage && (
        <ImageUpload
          label="About Image"
          value={formData.image || ''}
          onChange={(mediaId) => handleInputChange('image', mediaId)}
          onUpload={uploadImage}
          uploading={uploadingImage || false}
        />
      )}
    </div>
  );
};

