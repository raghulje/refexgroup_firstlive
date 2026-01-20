import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';

interface AirportsRetailAdvantageSectionFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage?: (file: File) => Promise<number | null>;
  uploadingImage?: boolean;
  errors?: Record<string, string>;
}

export const AirportsRetailAdvantageSectionForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {}
}: AirportsRetailAdvantageSectionFormProps) => {
  const bullets = Array.isArray(formData.bullets)
    ? formData.bullets
    : (formData.bullets
      ? (() => {
        try {
          return JSON.parse(formData.bullets);
        } catch {
          return [];
        }
      })()
      : [
        '',
        '',
        '',
        ''
      ]);

  const updateBullet = (index: number, value: string) => {
    const updated = [...bullets];
    updated[index] = value;
    handleInputChange('bullets', updated);
  };

  const addBullet = () => {
    handleInputChange('bullets', [...bullets, '']);
  };

  const removeBullet = (index: number) => {
    const updated = bullets.filter((_: any, i: number) => i !== index);
    handleInputChange('bullets', updated);
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
        label="Description"
        name="description"
        type="textarea"
        rows={4}
        value={formData.description || ''}
        onChange={(value) => handleInputChange('description', value)}
        error={errors.description}
      />

      {uploadImage && (
        <ImageUpload
          label="Left Image"
          value={formData.image || ''}
          onChange={(mediaId) => handleInputChange('image', mediaId)}
          onUpload={uploadImage}
          uploading={uploadingImage || false}
        />
      )}

      <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-semibold text-gray-900">Bullet Points</h4>
          <button
            type="button"
            onClick={addBullet}
            className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            <i className="ri-add-line"></i> Add Bullet
          </button>
        </div>
        <div className="space-y-3">
          {bullets.length > 0 ? (
            bullets.map((bullet: string, index: number) => (
              <div key={index} className="flex items-start gap-2">
                <FormField
                  label={`Bullet ${index + 1}`}
                  name={`bullet-${index}`}
                  value={bullet || ''}
                  onChange={(value) => updateBullet(index, value)}
                  error={errors[`bullets[${index}]`]}
                />
                <button
                  type="button"
                  onClick={() => removeBullet(index)}
                  className="mt-6 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove bullet"
                >
                  <i className="ri-delete-bin-line"></i>
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm italic">
              No bullet points added yet. Click "Add Bullet" to add advantage points.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};


