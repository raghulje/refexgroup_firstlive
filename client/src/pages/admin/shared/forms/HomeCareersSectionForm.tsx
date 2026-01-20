import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';

interface HomeCareersSectionFormProps {
    formData: any;
    handleInputChange: (key: string, value: any) => void;
    uploadImage: (file: File) => Promise<number | null>;
    uploadingImage: boolean;
    errors?: Record<string, string>;
}

export const HomeCareersSectionForm = ({
    formData,
    handleInputChange,
    uploadImage,
    uploadingImage,
    errors = {}
}: HomeCareersSectionFormProps) => {
    return (
        <div className="space-y-4">
            <FormField
                label="Tagline"
                name="tagline"
                value={formData.tagline || ''}
                onChange={(value) => handleInputChange('tagline', value)}
                error={errors.tagline}
            />

            <FormField
                label="Title"
                name="title"
                value={formData.title || ''}
                onChange={(value) => handleInputChange('title', value)}
                required
                error={errors.title}
                helpText="HTML is supported (e.g., use <br /> for line breaks)"
            />

            <FormField
                label="Description"
                name="description"
                value={formData.description || ''}
                onChange={(value) => handleInputChange('description', value)}
                type="textarea"
                error={errors.description}
            />

            <div className="grid grid-cols-2 gap-4">
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

            <div className="grid grid-cols-2 gap-4">
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

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Side Image
                </label>
                <ImageUpload
                    label=""
                    value={formData.imageId || ''}
                    onChange={(mediaId) => handleInputChange('imageId', mediaId)}
                    onUpload={uploadImage}
                    uploading={uploadingImage}
                />
            </div>
        </div>
    );
};
