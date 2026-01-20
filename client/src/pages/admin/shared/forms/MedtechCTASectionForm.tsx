import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';

interface MedtechCTASectionFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage?: (file: File) => Promise<number | null>;
  uploadingImage?: boolean;
  errors?: Record<string, string>;
}

export const MedtechCTASectionForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {}
}: MedtechCTASectionFormProps) => {
  return (
    <div className="space-y-4">
      <FormField
        label="Title"
        name="title"
        value={formData.title || ''}
        onChange={(value) => handleInputChange('title', value)}
        required
        error={errors.title}
        helpText="e.g. Adonis & 3i MedTech together makes Refex MedTech stronger."
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

      {uploadImage && (
        <ImageUpload
          label="Background Image"
          value={formData.backgroundImage || ''}
          onChange={(mediaId) => handleInputChange('backgroundImage', mediaId)}
          onUpload={uploadImage}
          uploading={uploadingImage || false}
          error={errors.backgroundImage}
          allowUrl={true}
        />
      )}

      <div className="grid grid-cols-2 gap-4 border-t border-gray-200 pt-4">
        <h4 className="col-span-2 font-semibold text-gray-700">Button 1</h4>
        <FormField
          label="Text"
          name="button1Text"
          value={formData.button1Text || ''}
          onChange={(value) => handleInputChange('button1Text', value)}
          error={errors.button1Text}
        />
        <FormField
          label="Link"
          name="button1Link"
          value={formData.button1Link || ''}
          onChange={(value) => handleInputChange('button1Link', value)}
          error={errors.button1Link}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 border-t border-gray-200 pt-4">
        <h4 className="col-span-2 font-semibold text-gray-700">Button 2</h4>
        <FormField
          label="Text"
          name="button2Text"
          value={formData.button2Text || ''}
          onChange={(value) => handleInputChange('button2Text', value)}
          error={errors.button2Text}
        />
        <FormField
          label="Link"
          name="button2Link"
          value={formData.button2Link || ''}
          onChange={(value) => handleInputChange('button2Link', value)}
          error={errors.button2Link}
        />
      </div>
    </div>
  );
};
