import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';
import { ImagePositionControl } from '../ImagePositionControl';

interface MissionVisionSectionFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage: (file: File) => Promise<string | null>;
  uploadingImage: boolean;
  errors?: Record<string, string>;
}

export const MissionVisionSectionForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {}
}: MissionVisionSectionFormProps) => {
  return (
    <div className="space-y-6">
      {/* Mission Section */}
      <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Mission</h3>
        <div className="space-y-4">
          <FormField
            label="Mission Title"
            name="missionTitle"
            value={formData.missionTitle || ''}
            onChange={(value) => handleInputChange('missionTitle', value)}
            error={errors.missionTitle}
          />
          <FormField
            label="Mission Text"
            name="missionText"
            type="textarea"
            rows={4}
            value={formData.missionText || ''}
            onChange={(value) => handleInputChange('missionText', value)}
            error={errors.missionText}
          />
          {uploadImage && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mission Icon
              </label>
              <ImageUpload
                label=""
                value={formData.missionIcon || formData.missionIconId || ''}
                onChange={(mediaId) => handleInputChange('missionIcon', mediaId)}
                onUpload={uploadImage}
                uploading={uploadingImage}
                error={errors.missionIcon}
              />
            </div>
          )}
        </div>
      </div>

      {/* Vision Section */}
      <div className="border-2 border-green-200 rounded-lg p-4 bg-green-50">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Vision</h3>
        <div className="space-y-4">
          <FormField
            label="Vision Title"
            name="visionTitle"
            value={formData.visionTitle || ''}
            onChange={(value) => handleInputChange('visionTitle', value)}
            error={errors.visionTitle}
          />
          <FormField
            label="Vision Text"
            name="visionText"
            type="textarea"
            rows={4}
            value={formData.visionText || ''}
            onChange={(value) => handleInputChange('visionText', value)}
            error={errors.visionText}
          />
          {uploadImage && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vision Icon
              </label>
              <ImageUpload
                label=""
                value={formData.visionIcon || formData.visionIconId || ''}
                onChange={(mediaId) => handleInputChange('visionIcon', mediaId)}
                onUpload={uploadImage}
                uploading={uploadingImage}
                error={errors.visionIcon}
              />
            </div>
          )}
        </div>
      </div>

      {/* Background Image */}
      {uploadImage && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Background Image
          </label>
          <ImageUpload
            label=""
            value={formData.backgroundImage || formData.backgroundImageId || ''}
            onChange={(mediaId) => handleInputChange('backgroundImage', mediaId)}
            onUpload={uploadImage}
            uploading={uploadingImage}
            error={errors.backgroundImage}
          />
          {errors.backgroundImage && (
            <p className="mt-1 text-sm text-red-600">{errors.backgroundImage}</p>
          )}
          
          {/* Image Position Control */}
          {(formData.backgroundImage || formData.backgroundImageId) && (
            <div className="mt-4">
              <ImagePositionControl
                label="Background Image Position"
                positionX={formData.backgroundPositionX}
                positionY={formData.backgroundPositionY}
                onChangeX={(value) => handleInputChange('backgroundPositionX', value)}
                onChangeY={(value) => handleInputChange('backgroundPositionY', value)}
                imageMediaId={formData.backgroundImage || formData.backgroundImageId}
                helpText="Adjust X and Y position (0-100%) to control which part of the image is visible"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

