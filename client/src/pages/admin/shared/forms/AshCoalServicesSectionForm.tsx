import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';

interface AshCoalServicesSectionFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage?: (file: File) => Promise<number | null>;
  uploadingImage?: boolean;
  errors?: Record<string, string>;
}

export const AshCoalServicesSectionForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {}
}: AshCoalServicesSectionFormProps) => {
  return (
    <div className="space-y-6">
      <FormField
        label="Section Heading"
        name="heading"
        value={formData.heading || ''}
        onChange={(value) => handleInputChange('heading', value)}
        required
        error={errors.heading}
      />

      <FormField
        label="Background Color"
        name="backgroundColor"
        value={formData.backgroundColor || '#000000'}
        onChange={(value) => handleInputChange('backgroundColor', value)}
        error={errors.backgroundColor}
        placeholder="#000000"
        helpText="Section background color (e.g., #000000 for black)"
      />

      <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
        <h3 className="font-semibold text-gray-900 mb-3">Handling &amp; Disposal of Fly Ash</h3>
        <FormField
          label="Title"
          name="flyAshTitle"
          value={formData.flyAshTitle || 'Handling & Disposal of Fly Ash'}
          onChange={(value) => handleInputChange('flyAshTitle', value)}
          error={errors.flyAshTitle}
        />
        <FormField
          label="Description"
          name="flyAshDescription"
          type="textarea"
          rows={5}
          value={formData.flyAshDescription || ''}
          onChange={(value) => handleInputChange('flyAshDescription', value)}
          error={errors.flyAshDescription}
        />
        {uploadImage && (
          <ImageUpload
            label="Image"
            value={formData.flyAshImage || ''}
            onChange={(mediaId) => handleInputChange('flyAshImage', mediaId)}
            onUpload={uploadImage}
            uploading={uploadingImage || false}
            error={errors.flyAshImage}
            allowUrl={true}
          />
        )}
      </div>

      <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
        <h3 className="font-semibold text-gray-900 mb-3">Coal Yard Management</h3>
        <FormField
          label="Title"
          name="coalYardTitle"
          value={formData.coalYardTitle || 'Coal Yard Management'}
          onChange={(value) => handleInputChange('coalYardTitle', value)}
          error={errors.coalYardTitle}
        />
        <FormField
          label="Description"
          name="coalYardDescription"
          type="textarea"
          rows={5}
          value={formData.coalYardDescription || ''}
          onChange={(value) => handleInputChange('coalYardDescription', value)}
          error={errors.coalYardDescription}
        />
        {uploadImage && (
          <ImageUpload
            label="Image"
            value={formData.coalYardImage || ''}
            onChange={(mediaId) => handleInputChange('coalYardImage', mediaId)}
            onUpload={uploadImage}
            uploading={uploadingImage || false}
            error={errors.coalYardImage}
            allowUrl={true}
          />
        )}
      </div>

      <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
        <h3 className="font-semibold text-gray-900 mb-3">Coal Trading</h3>
        <FormField
          label="Title"
          name="coalTradingTitle"
          value={formData.coalTradingTitle || 'Coal Trading'}
          onChange={(value) => handleInputChange('coalTradingTitle', value)}
          error={errors.coalTradingTitle}
        />
        <FormField
          label="Description"
          name="coalTradingDescription"
          type="textarea"
          rows={5}
          value={formData.coalTradingDescription || ''}
          onChange={(value) => handleInputChange('coalTradingDescription', value)}
          error={errors.coalTradingDescription}
        />
        {uploadImage && (
          <ImageUpload
            label="Image"
            value={formData.coalTradingImage || ''}
            onChange={(mediaId) => handleInputChange('coalTradingImage', mediaId)}
            onUpload={uploadImage}
            uploading={uploadingImage || false}
            error={errors.coalTradingImage}
            allowUrl={true}
          />
        )}
      </div>
    </div>
  );
};


