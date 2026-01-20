import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';

interface HomeAboutSectionFormProps {
    formData: any;
    handleInputChange: (key: string, value: any) => void;
    uploadImage: (file: File) => Promise<number | null>;
    uploadingImage: boolean;
    errors?: Record<string, string>;
}

export const HomeAboutSectionForm = ({
    formData,
    handleInputChange,
    uploadImage,
    uploadingImage,
    errors = {}
}: HomeAboutSectionFormProps) => {

    return (
        <div className="space-y-4">
            <FormField
                label="Title"
                name="title"
                value={formData.title || ''}
                onChange={(value) => handleInputChange('title', value)}
                required
                error={errors.title}
                helpText="Section title (e.g. 'Choosing green...')"
            />

            <FormField
                label="Tagline"
                name="tagline"
                value={formData.tagline || ''}
                onChange={(value) => handleInputChange('tagline', value)}
                error={errors.tagline}
            />

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content
                </label>
                <FormField
                    label=""
                    name="content_text"
                    type="textarea"
                    rows={8}
                    value={formData.content_text || ''}
                    onChange={(value) => handleInputChange('content_text', value)}
                    error={errors.content_text}
                    helpText="Enter the full about content here. Use new lines/blank lines; the system will automatically split it into paragraphs on the website."
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo Image
                </label>
                <ImageUpload
                    label=""
                    value={formData.logo_image_id || ''}
                    onChange={(mediaId) => handleInputChange('logo_image_id', mediaId)}
                    onUpload={uploadImage}
                    uploading={uploadingImage}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Main Image
                </label>
                <ImageUpload
                    label=""
                    value={formData.main_image_id || ''}
                    onChange={(mediaId) => handleInputChange('main_image_id', mediaId)}
                    onUpload={uploadImage}
                    uploading={uploadingImage}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <FormField
                    label="Button Text"
                    name="button_text"
                    value={formData.button_text || ''}
                    onChange={(value) => handleInputChange('button_text', value)}
                />
                <FormField
                    label="Button Link"
                    name="button_link"
                    value={formData.button_link || ''}
                    onChange={(value) => handleInputChange('button_link', value)}
                />
            </div>
        </div>
    );
};
