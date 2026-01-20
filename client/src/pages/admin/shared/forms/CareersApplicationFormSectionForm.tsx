import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';

interface CareersApplicationFormSectionFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage?: (file: File) => Promise<number | null>;
  uploadingImage?: boolean;
  errors?: Record<string, string>;
}

export const CareersApplicationFormSectionForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {}
}: CareersApplicationFormSectionFormProps) => {
  return (
    <div className="space-y-4">
      <FormField
        label="Left Title"
        name="leftTitle"
        value={formData.leftTitle || formData.title || ''}
        onChange={(value) => {
          handleInputChange('leftTitle', value);
          handleInputChange('title', value); // Also set for backward compatibility
        }}
        required
        error={errors.leftTitle || errors.title}
        helpText="Title shown on the left side of the form section"
      />

      <FormField
        label="Left Subtitle"
        name="leftSubtitle"
        value={formData.leftSubtitle || formData.subtitle || ''}
        onChange={(value) => {
          handleInputChange('leftSubtitle', value);
          handleInputChange('subtitle', value); // Also set for backward compatibility
        }}
        error={errors.leftSubtitle || errors.subtitle}
        helpText="Subtitle shown on the left side of the form section"
      />

      <FormField
        label="Form Title"
        name="formTitle"
        value={formData.formTitle || ''}
        onChange={(value) => handleInputChange('formTitle', value)}
        error={errors.formTitle}
        helpText="Title shown above the application form"
      />

      {uploadImage && (
        <ImageUpload
          label="Background Image"
          value={formData.backgroundImage || formData.backgroundImageId || ''}
          onChange={(mediaId: number | string) => handleInputChange('backgroundImage', mediaId)}
          onUpload={uploadImage}
          uploading={uploadingImage || false}
          pageName="careers"
          sectionName="application-form"
          allowUrl={true}
          error={errors.backgroundImage}
        />
      )}
    </div>
  );
};

