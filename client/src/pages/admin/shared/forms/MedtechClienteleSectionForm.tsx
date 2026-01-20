import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';

interface MedtechClienteleSectionFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage?: (file: File) => Promise<number | null>;
  uploadingImage?: boolean;
  errors?: Record<string, string>;
}

export const MedtechClienteleSectionForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {}
}: MedtechClienteleSectionFormProps) => {
  const clientLogos = Array.isArray(formData.clientLogos)
    ? formData.clientLogos
    : (formData.clientLogos
        ? (() => {
            try {
              return JSON.parse(formData.clientLogos);
            } catch {
              return [];
            }
          })()
        : []);

  const visibleLogos =
    clientLogos.length > 0 ? clientLogos : [];

  const updateLogo = (index: number, value: string) => {
    const updated = [...visibleLogos];
    updated[index] = value;
    handleInputChange('clientLogos', updated);
  };

  const addLogo = () => {
    handleInputChange('clientLogos', [...visibleLogos, '']);
  };

  const removeLogo = (index: number) => {
    const updated = visibleLogos.filter((_: any, i: number) => i !== index);
    handleInputChange('clientLogos', updated);
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

      <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-semibold text-gray-900">Client Logos</h4>
          <button
            type="button"
            onClick={addLogo}
            className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            <i className="ri-add-line"></i> Add Logo
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visibleLogos.length > 0 ? (
            visibleLogos.map((logo: string, index: number) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Logo {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeLogo(index)}
                    className="px-2 py-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Remove logo"
                  >
                    <i className="ri-delete-bin-line"></i>
                  </button>
                </div>
                <ImageUpload
                  label=""
                  value={logo || ''}
                  onChange={(value) => updateLogo(index, value)}
                  onUpload={uploadImage}
                  uploading={uploadingImage || false}
                  error={errors[`clientLogos[${index}]`]}
                  fileType="logo"
                  allowUrl={true}
                />
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm italic col-span-2">
              No logos added yet. Click "Add Logo" to add client logos.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

