import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';

interface ChampioningSectionContentFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage?: (file: File, pageName?: string, sectionName?: string) => Promise<number | null>;
  uploadingImage?: boolean;
  errors?: Record<string, string>;
}

export const ChampioningSectionContentForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {}
}: ChampioningSectionContentFormProps) => {
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
        value={formData.description || ''}
        onChange={(value) => handleInputChange('description', value)}
        required
        error={errors.description}
      />
      
      <FormField
        label="Background Color"
        name="backgroundColor"
        type="color"
        value={formData.backgroundColor || '#7DC144'}
        onChange={(value) => handleInputChange('backgroundColor', value)}
        error={errors.backgroundColor}
        helpText="Background color for the section (hex code)"
      />
      
      {uploadImage && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Background Pattern
          </label>
          <ImageUpload
            label=""
            value={formData.backgroundPattern || ''}
            onChange={(mediaId: number | string) => handleInputChange('backgroundPattern', mediaId)}
            onUpload={uploadImage}
            uploading={uploadingImage || false}
            pageName="esg"
            sectionName="championing-change"
            allowUrl={true}
          />
          {errors.backgroundPattern && (
            <p className="mt-1 text-sm text-red-600">{errors.backgroundPattern}</p>
          )}
        </div>
      )}
      
      <FormField
        label="Text Color"
        name="textColor"
        value={formData.textColor || 'white'}
        onChange={(value) => handleInputChange('textColor', value)}
        error={errors.textColor}
        helpText="Text color (e.g., 'white', 'black', '#000000')"
      />
    </div>
  );
};

