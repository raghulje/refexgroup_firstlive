import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';

interface MessageAnilJainFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage: (file: File) => Promise<string | null>;
  uploadingImage: boolean;
  errors?: Record<string, string>;
}

export const MessageAnilJainForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {}
}: MessageAnilJainFormProps) => {
  // Parse content from JSON or use array
  const contentArray = Array.isArray(formData.content) 
    ? formData.content 
    : (typeof formData.content === 'string' ? JSON.parse(formData.content || '[]') : []);

  const updateContent = (index: number, value: string) => {
    const updated = [...contentArray];
    updated[index] = value;
    handleInputChange('content', JSON.stringify(updated));
  };

  const addParagraph = () => {
    const updated = [...contentArray, ''];
    handleInputChange('content', JSON.stringify(updated));
  };

  const removeParagraph = (index: number) => {
    const updated = contentArray.filter((_: any, i: number) => i !== index);
    handleInputChange('content', JSON.stringify(updated));
  };

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
        label="Position"
        name="position"
        value={formData.position || ''}
        onChange={(value) => handleInputChange('position', value)}
        required
        error={errors.position}
      />
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Content Paragraphs
        </label>
        <div className="space-y-3">
          {contentArray.map((para: string, index: number) => (
            <div key={index} className="relative">
              <div className="flex justify-end mb-1">
                <button
                  type="button"
                  onClick={() => removeParagraph(index)}
                  className="px-2 py-1 text-red-600 hover:bg-red-50 rounded-md transition-colors text-sm"
                  title="Remove paragraph"
                >
                  <i className="ri-delete-bin-line"></i>
                </button>
              </div>
              <FormField
                label=""
                name={`content-${index}`}
                type="textarea"
                rows={5}
                value={para || ''}
                onChange={(value) => updateContent(index, value)}
                error={errors[`content-${index}`]}
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addParagraph}
            className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors"
          >
            <i className="ri-add-line mr-2"></i>
            Add Paragraph
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Background Image
        </label>
        <ImageUpload
          label="Background Image"
          value={formData.image || formData.imageId || ''}
          onChange={(mediaId) => handleInputChange('image', mediaId)}
          onUpload={uploadImage}
          uploading={uploadingImage}
          error={errors.image}
          fieldName="imageId"
        />
      </div>
    </div>
  );
};

