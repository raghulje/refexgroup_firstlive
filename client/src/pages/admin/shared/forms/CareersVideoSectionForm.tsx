import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';
import { ImagePositionControl } from '../ImagePositionControl';

interface CareersVideoSectionFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage?: (file: File, pageName?: string, sectionName?: string) => Promise<number | null>;
  uploadingImage?: boolean;
  errors?: Record<string, string>;
}

export const CareersVideoSectionForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage = false,
  errors = {}
}: CareersVideoSectionFormProps) => {
  return (
    <div className="space-y-4">
      <FormField
        label="Video URL (YouTube Embed)"
        name="videoUrl"
        value={formData.videoUrl || ''}
        onChange={(value) => handleInputChange('videoUrl', value)}
        required
        error={errors.videoUrl}
        helpText="e.g., https://www.youtube.com/embed/Exp79B_pL9I"
      />
      {formData.videoUrl && (
        <div className="mt-4 rounded-lg overflow-hidden border border-gray-200">
          <iframe
            src={formData.videoUrl}
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen
            title="Video Preview"
          ></iframe>
        </div>
      )}

      {uploadImage && (
        <>
        <ImageUpload
          label="Cover Image"
          value={formData.coverImage || formData.coverImageId || ''}
          onChange={(mediaId: number | string) => handleInputChange('coverImage', mediaId)}
          onUpload={uploadImage}
          uploading={uploadingImage}
          pageName="careers"
          sectionName="video"
          allowUrl={true}
          error={errors.coverImage}
        />
          
          {/* Image Position Control */}
          {(formData.coverImage || formData.coverImageId) && (
            <ImagePositionControl
              label="Cover Image Position"
              positionX={formData.coverImagePositionX !== undefined && formData.coverImagePositionX !== null && formData.coverImagePositionX !== '' ? String(formData.coverImagePositionX) : '50'}
              positionY={formData.coverImagePositionY !== undefined && formData.coverImagePositionY !== null && formData.coverImagePositionY !== '' ? String(formData.coverImagePositionY) : '50'}
              onChangeX={(value) => {
                console.log('Setting coverImagePositionX to:', value);
                handleInputChange('coverImagePositionX', value);
              }}
              onChangeY={(value) => {
                console.log('Setting coverImagePositionY to:', value);
                handleInputChange('coverImagePositionY', value);
              }}
              imageUrl={typeof formData.coverImage === 'string' && (formData.coverImage.startsWith('http://') || formData.coverImage.startsWith('https://')) ? formData.coverImage : undefined}
              imageMediaId={typeof formData.coverImage === 'number' ? formData.coverImage : (typeof formData.coverImageId === 'number' ? formData.coverImageId : (typeof formData.coverImage === 'string' && /^\d+$/.test(formData.coverImage) ? parseInt(formData.coverImage) : undefined))}
              previewWidth={400}
              previewAspectRatio="16:9"
              helpText="Preview shows actual page dimensions (max-w-4xl, 16:9 ratio). Adjust X and Y to control visible area."
            />
          )}
        </>
      )}
    </div>
  );
};

