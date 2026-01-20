import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';

interface SDGSectionFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage?: (file: File, pageName?: string, sectionName?: string) => Promise<number | null>;
  uploadingImage?: boolean;
  errors?: Record<string, string>;
}

export const SDGSectionForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {}
}: SDGSectionFormProps) => {
  return (
    <div className="space-y-4">
      <FormField
        label="Heading"
        name="heading"
        value={formData.heading || ''}
        onChange={(value) => handleInputChange('heading', value)}
        required
        error={errors.heading}
      />
      
      <FormField
        label="Description 1"
        name="description1"
        type="textarea"
        value={formData.description1 || ''}
        onChange={(value) => handleInputChange('description1', value)}
        error={errors.description1}
      />
      
      <FormField
        label="Description 2"
        name="description2"
        type="textarea"
        value={formData.description2 || ''}
        onChange={(value) => handleInputChange('description2', value)}
        error={errors.description2}
      />
      
      <FormField
        label="Background Color"
        name="backgroundColor"
        type="color"
        value={formData.backgroundColor || '#7cb342'}
        onChange={(value) => handleInputChange('backgroundColor', value)}
        error={errors.backgroundColor}
        helpText="Background color for the SDG section (hex code)"
      />
      
      {uploadImage && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image
          </label>
          <ImageUpload
            label=""
            value={formData.image || ''}
            onChange={(mediaId: number | string) => handleInputChange('image', mediaId)}
            onUpload={uploadImage}
            uploading={uploadingImage || false}
            pageName="esg"
            sectionName="sdg"
            allowUrl={true}
          />
          {errors.image && (
            <p className="mt-1 text-sm text-red-600">{errors.image}</p>
          )}
        </div>
      )}
    </div>
  );
};

