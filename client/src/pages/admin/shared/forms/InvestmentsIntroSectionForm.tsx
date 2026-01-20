import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';

interface InvestmentsIntroSectionFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage: (file: File) => Promise<string | null>;
  uploadingImage: boolean;
  errors?: Record<string, string>;
}

export const InvestmentsIntroSectionForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {}
}: InvestmentsIntroSectionFormProps) => {
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
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Logo
        </label>
        <ImageUpload
          label="Logo"
          value={formData.logo || formData.logoId || ''}
          onChange={(mediaId) => handleInputChange('logo', mediaId)}
          onUpload={uploadImage}
          uploading={uploadingImage}
          error={errors.logo}
          fieldName="logoId"
        />
      </div>
    </div>
  );
};

