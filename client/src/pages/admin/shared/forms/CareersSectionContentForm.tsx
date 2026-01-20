import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';

interface CareersSectionContentFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage: (file: File) => Promise<string | null>;
  uploadingImage: boolean;
  errors?: Record<string, string>;
}

export const CareersSectionContentForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {}
}: CareersSectionContentFormProps) => {
  return (
    <div className="space-y-2.5">
      <FormField
        label="Label"
        name="label"
        value={formData.label || ''}
        onChange={(value) => handleInputChange('label', value)}
        required
        error={errors.label}
        helpText="Section label (e.g., 'Join Refex')"
      />
      
      <FormField
        label="Title"
        name="title"
        value={formData.title || ''}
        onChange={(value) => handleInputChange('title', value)}
        required
        error={errors.title}
        helpText="Title with HTML support (e.g., 'Resilient by <span>Nature.</span><br />Robust by <span>People.</span>')"
      />
      
      <FormField
        label="Description"
        name="description"
        type="textarea"
        value={formData.description || ''}
        onChange={(value) => handleInputChange('description', value)}
        required
        error={errors.description}
        helpText="Description text"
      />
      
      <div className="col-span-full grid grid-cols-2 gap-x-6 gap-y-2.5">
        <FormField
          label="Primary Button Text"
          name="primaryButtonText"
          value={formData.primaryButtonText || ''}
          onChange={(value) => handleInputChange('primaryButtonText', value)}
          error={errors.primaryButtonText}
        />
        
        <FormField
          label="Primary Button Link"
          name="primaryButtonLink"
          value={formData.primaryButtonLink || ''}
          onChange={(value) => handleInputChange('primaryButtonLink', value)}
          error={errors.primaryButtonLink}
        />
      </div>
      
      <div className="col-span-full grid grid-cols-2 gap-x-6 gap-y-2.5">
        <FormField
          label="Secondary Button Text"
          name="secondaryButtonText"
          value={formData.secondaryButtonText || ''}
          onChange={(value) => handleInputChange('secondaryButtonText', value)}
          error={errors.secondaryButtonText}
        />
        
        <FormField
          label="Secondary Button Link"
          name="secondaryButtonLink"
          value={formData.secondaryButtonLink || ''}
          onChange={(value) => handleInputChange('secondaryButtonLink', value)}
          error={errors.secondaryButtonLink}
        />
      </div>
      
      <ImageUpload
        label="Background Image"
        value={formData.image || ''}
        onChange={(mediaId) => handleInputChange('image', mediaId)}
        onUpload={uploadImage}
        uploading={uploadingImage}
        pageName="careers"
        sectionName="careers-section"
        allowUrl={true}
        error={errors.image}
      />
    </div>
  );
};

