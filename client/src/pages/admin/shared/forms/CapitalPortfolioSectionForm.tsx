import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';

interface CapitalPortfolioSectionFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage?: (file: File) => Promise<number | null>;
  uploadingImage?: boolean;
  errors?: Record<string, string>;
}

export const CapitalPortfolioSectionForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {}
}: CapitalPortfolioSectionFormProps) => {
  const portfolioLogos = Array.isArray(formData.portfolioLogos)
    ? formData.portfolioLogos
    : (formData.portfolioLogos
        ? (() => {
            try {
              return JSON.parse(formData.portfolioLogos);
            } catch {
              return [];
            }
          })()
        : []);

  const visibleLogos =
    portfolioLogos.length > 0 ? portfolioLogos : new Array(12).fill('');

  const updateLogo = (index: number, value: string) => {
    const updated = [...visibleLogos];
    updated[index] = value;
    handleInputChange('portfolioLogos', updated);
  };

  const addLogo = () => {
    handleInputChange('portfolioLogos', [...visibleLogos, '']);
  };

  const removeLogo = (index: number) => {
    const updated = visibleLogos.filter((_: any, i: number) => i !== index);
    handleInputChange('portfolioLogos', updated);
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
        label="Subtitle"
        name="subtitle"
        value={formData.subtitle || ''}
        onChange={(value) => handleInputChange('subtitle', value)}
        error={errors.subtitle}
      />

      <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-semibold text-gray-900">Portfolio Logos</h4>
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
                  error={errors[`portfolioLogos[${index}]`]}
                  fileType="logo"
                  allowUrl={true}
                />
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm italic col-span-2">
              No logos added yet. Click "Add Logo" to add portfolio company logos.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};


