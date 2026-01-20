import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';

interface MedtechCertificationsSectionFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage?: (file: File) => Promise<number | null>;
  uploadingImage?: boolean;
  errors?: Record<string, string>;
}

export const MedtechCertificationsSectionForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {}
}: MedtechCertificationsSectionFormProps) => {
  const certifications = Array.isArray(formData.certifications)
    ? formData.certifications
    : (formData.certifications
        ? (() => {
            try {
              return JSON.parse(formData.certifications);
            } catch {
              return [];
            }
          })()
        : []);

  const visibleCerts =
    certifications.length > 0
      ? certifications
      : [];

  const updateCert = (index: number, field: string, value: string) => {
    const updated = [...visibleCerts];
    updated[index] = { ...updated[index], [field]: value };
    handleInputChange('certifications', updated);
  };

  const addCert = () => {
    handleInputChange('certifications', [...visibleCerts, { image: '', title: '' }]);
  };

  const removeCert = (index: number) => {
    const updated = visibleCerts.filter((_: any, i: number) => i !== index);
    handleInputChange('certifications', updated);
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
          <h4 className="font-semibold text-gray-900">Certifications</h4>
          <button
            type="button"
            onClick={addCert}
            className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            <i className="ri-add-line"></i> Add Certification
          </button>
        </div>
        <div className="space-y-3">
          {visibleCerts.length > 0 ? (
            visibleCerts.map((cert: any, index: number) => (
              <div
                key={index}
                className="space-y-3 p-4 border border-gray-200 rounded-lg bg-white"
              >
                <div className="flex justify-between items-center">
                  <p className="text-sm font-semibold text-gray-700">
                    Certification {index + 1}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeCert(index)}
                    className="px-2 py-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Remove certification"
                  >
                    <i className="ri-delete-bin-line"></i>
                  </button>
                </div>
            <ImageUpload
              label="Logo/Image"
              value={cert.image || ''}
              onChange={(value) => updateCert(index, 'image', value)}
              onUpload={uploadImage}
              uploading={uploadingImage || false}
              error={errors[`certifications[${index}].image`]}
              fileType="logo"
              allowUrl={true}
            />
            <FormField
              label="Title"
              name={`cert-${index}-title`}
              value={cert.title || ''}
              onChange={(value) => updateCert(index, 'title', value)}
              error={errors[`certifications[${index}].title`]}
            />
          </div>
        ))
      ) : (
        <p className="text-gray-400 text-sm italic">
          No certifications added yet. Click "Add Certification" to add certification logos.
        </p>
      )}
    </div>
  </div>
  </div>
  );
};


