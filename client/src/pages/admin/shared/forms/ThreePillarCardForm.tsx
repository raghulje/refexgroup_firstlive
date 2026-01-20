import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';

interface ThreePillarCardFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage: (file: File, pageName?: string, sectionName?: string) => Promise<number | null>;
  uploadingImage: boolean;
  errors?: Record<string, string>;
}

export const ThreePillarCardForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {}
}: ThreePillarCardFormProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Title"
          name="title"
          value={formData.title || ''}
          onChange={(value) => handleInputChange('title', value)}
          required
          error={errors.title}
          helpText="Card title (e.g., 'Environment', 'Health & Safety')"
        />

        <FormField
          label="Order"
          name="order"
          type="number"
          value={formData.order !== undefined ? formData.order : 0}
          onChange={(value) => handleInputChange('order', parseInt(value) || 0)}
          error={errors.order}
          helpText="Display order (lower numbers appear first)"
        />

        <FormField
          label="URL / Link"
          name="link"
          value={formData.link || ''}
          onChange={(value) => handleInputChange('link', value)}
          error={errors.link}
          helpText="Optional link (e.g. /sustainability)"
        />

        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            Card Image *
          </label>
          <ImageUpload
            key={`pillar-image-${formData.id || 'new'}-${formData.image || 'empty'}`}
            value={formData.image !== undefined && formData.image !== null ? formData.image : ''}
            onChange={(mediaId) => {
              console.log('ThreePillarCardForm: Image changed to:', mediaId);
              handleInputChange('image', mediaId);
            }}
            onUpload={uploadImage}
            uploading={uploadingImage}
            label=""
            pageName="general"
            sectionName="general"
            allowUrl={true}
            required
          />
          {errors.image && (
            <p className="mt-1.5 text-sm text-red-500 font-medium flex items-center gap-1">
              <i className="ri-error-warning-line"></i>
              {errors.image}
            </p>
          )}
        </div>
      </div>

      <div>
        <FormField
          label="Description"
          name="description"
          type="textarea"
          value={formData.description || ''}
          onChange={(value) => handleInputChange('description', value)}
          required
          error={errors.description}
          helpText="Card description content"
          rows={5}
        />
      </div>
    </div>
  );
};
