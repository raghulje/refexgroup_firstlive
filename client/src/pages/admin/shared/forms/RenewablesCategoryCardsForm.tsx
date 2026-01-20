import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';

interface RenewablesCategoryCardsFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage?: (file: File) => Promise<number | null>;
  uploadingImage?: boolean;
  errors?: Record<string, string>;
}

export const RenewablesCategoryCardsForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {}
}: RenewablesCategoryCardsFormProps) => {
  // Parse categories from JSON or use array
  let categories = [];
  if (Array.isArray(formData.categories)) {
    categories = formData.categories;
  } else if (typeof formData.categories === 'string' && formData.categories) {
    try {
      categories = JSON.parse(formData.categories);
    } catch {
      categories = [];
    }
  }

  // Ensure we have at least 3 categories
  while (categories.length < 3) {
    categories.push({ title: '', image: '' });
  }

  const updateCategory = (index: number, field: string, value: string) => {
    const updated = [...categories];
    updated[index] = { ...updated[index], [field]: value };
    handleInputChange('categories', updated);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category Cards (3 items)
        </label>
        <div className="space-y-4">
          {categories.slice(0, 3).map((category: any, index: number) => (
            <div key={index} className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
              <h4 className="font-semibold text-gray-900 mb-3">Category {index + 1}</h4>
              <div className="space-y-3">
                <FormField
                  label="Title"
                  name={`category-${index}-title`}
                  value={category.title || ''}
                  onChange={(value) => updateCategory(index, 'title', value)}
                  required
                />
                {uploadImage ? (
                  <ImageUpload
                    label="Image"
                    value={category.image || ''}
                    onChange={(mediaId) => updateCategory(index, 'image', mediaId)}
                    onUpload={uploadImage}
                    uploading={uploadingImage || false}
                    error={errors[`category${index}Image`]}
                    allowUrl={true}
                  />
                ) : (
                  <FormField
                    label="Image URL"
                    name={`category-${index}-image`}
                    value={category.image || ''}
                    onChange={(value) => updateCategory(index, 'image', value)}
                    error={errors[`category${index}Image`]}
                    helpText="URL to category image (e.g., /assets/business/renewables/bhilai-2.jpg)"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

