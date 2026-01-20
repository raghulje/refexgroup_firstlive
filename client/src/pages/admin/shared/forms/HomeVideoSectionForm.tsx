import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';

interface HomeVideoSectionFormProps {
    formData: any;
    handleInputChange: (key: string, value: any) => void;
    uploadImage: (file: File) => Promise<number | null>;
    uploadingImage: boolean;
    errors?: Record<string, string>;
}

export const HomeVideoSectionForm = ({
    formData,
    handleInputChange,
    uploadImage,
    uploadingImage,
    errors = {}
}: HomeVideoSectionFormProps) => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    label="Title"
                    name="title"
                    value={formData.title || ''}
                    onChange={(value) => handleInputChange('title', value)}
                    error={errors.title}
                />

                <FormField
                    label="Video URL"
                    name="videoUrl"
                    value={formData.videoUrl || ''}
                    onChange={(value) => handleInputChange('videoUrl', value)}
                    required
                    error={errors.videoUrl}
                    helpText="YouTube embed URL (e.g., https://www.youtube.com/embed/xxxxx)"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <FormField
                        label="Description"
                        name="description"
                        value={formData.description || ''}
                        onChange={(value) => handleInputChange('description', value)}
                        type="textarea"
                        error={errors.description}
                        rows={6}
                    />
                </div>

                <div className="md:col-span-1">
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                        Thumbnail Image
                    </label>
                    <ImageUpload
                        label=""
                        value={formData.thumbnailImageId || ''}
                        onChange={(mediaId) => handleInputChange('thumbnailImageId', mediaId)}
                        onUpload={uploadImage}
                        uploading={uploadingImage}
                    />
                    {errors.thumbnailImageId && (
                        <p className="mt-1.5 text-sm text-red-500 font-medium flex items-center gap-1">
                            <i className="ri-error-warning-line"></i>
                            {errors.thumbnailImageId}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};
