import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';

interface PharmaLogoCardsSectionFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage?: (file: File) => Promise<number | null>;
  uploadingImage?: boolean;
  errors?: Record<string, string>;
}

export const PharmaLogoCardsSectionForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {}
}: PharmaLogoCardsSectionFormProps) => {
  const logos = Array.isArray(formData.logos)
    ? formData.logos
    : (formData.logos
      ? (() => {
        try {
          return JSON.parse(formData.logos);
        } catch {
          return [
            { name: '', image: '' },
            { name: '', image: '' },
            { name: '', image: '' }
          ];
        }
      })()
      : [
        { name: '', image: '' },
        { name: '', image: '' },
        { name: '', image: '' }
      ]);

  const updateLogo = (index: number, field: string, value: string) => {
    const updated = [...logos];
    updated[index] = { ...updated[index], [field]: value };
    handleInputChange('logos', updated);
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
        <h4 className="font-semibold text-gray-900 mb-4">Group Logos</h4>
        <div className="space-y-4">
          {logos.map((logo: any, index: number) => (
            <div
              key={index}
              className="space-y-3 p-4 border border-gray-200 rounded-lg bg-white"
            >
              <p className="text-sm font-semibold text-gray-700">
                Logo {index + 1}
              </p>
              <FormField
                label="Name"
                name={`logo-${index}-name`}
                value={logo.name || ''}
                onChange={(value) => updateLogo(index, 'name', value)}
                required
                error={errors[`logos[${index}].name`]}
                helpText="e.g., Modepro, RLFC, Extrovis"
              />
              {uploadImage && (
                <ImageUpload
                  label="Logo Image"
                  value={logo.image || ''}
                  onChange={(mediaId) => {
                    const updated = [...logos];
                    updated[index] = { ...updated[index], image: mediaId };
                    handleInputChange('logos', updated);
                  }}
                  onUpload={uploadImage}
                  uploading={uploadingImage || false}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

