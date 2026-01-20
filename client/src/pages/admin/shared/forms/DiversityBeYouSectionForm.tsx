import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';

interface DiversityBeYouSectionFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage?: (file: File) => Promise<number | null>;
  uploadingImage?: boolean;
  errors?: Record<string, string>;
}

export const DiversityBeYouSectionForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {}
}: DiversityBeYouSectionFormProps) => {
  // Parse content from JSON or use array
  const content = Array.isArray(formData.content) 
    ? formData.content 
    : (typeof formData.content === 'string' ? JSON.parse(formData.content || '[]') : []);

  const updateContent = (index: number, value: string) => {
    const updated = [...content];
    updated[index] = value;
    handleInputChange('content', updated);
  };

  const addParagraph = () => {
    handleInputChange('content', [...content, '']);
  };

  const removeParagraph = (index: number) => {
    const updated = content.filter((_: any, i: number) => i !== index);
    handleInputChange('content', updated);
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

      <ImageUpload
        label="Image"
        value={formData.image || ''}
        onChange={(mediaId) => handleInputChange('image', mediaId)}
        onUpload={uploadImage}
        uploading={uploadingImage || false}
        pageName="diversity-inclusion"
        sectionName="be-you"
        allowUrl={true}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Content Paragraphs
        </label>
        <div className="space-y-3">
          {content.map((para: string, index: number) => (
            <div key={index} className="relative">
              <div className="flex justify-end mb-1">
                <button
                  type="button"
                  onClick={() => removeParagraph(index)}
                  className="px-2 py-1 text-red-600 hover:bg-red-50 rounded transition-colors text-sm"
                  title="Remove paragraph"
                >
                  <i className="ri-delete-bin-line"></i>
                </button>
              </div>
              <textarea
                value={para}
                onChange={(e) => updateContent(index, e.target.value)}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={`Paragraph ${index + 1}`}
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
    </div>
  );
};

