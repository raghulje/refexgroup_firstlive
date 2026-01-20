import { ImageUpload } from '../ImageUpload';
import { FormField } from '../FormField';

interface CareersTestimonialSliderFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  errors?: Record<string, string>;
  uploadImage?: (file: File, pageName?: string, sectionName?: string) => Promise<number | null>;
  uploadingImage?: boolean;
}

export const CareersTestimonialSliderForm = ({
  formData,
  handleInputChange,
  errors = {},
  uploadImage,
  uploadingImage = false
}: CareersTestimonialSliderFormProps) => {
  // Parse images from JSON or use array
  let images: (string | number)[] = [];
  if (Array.isArray(formData.images)) {
    images = formData.images;
  } else if (typeof formData.images === 'string' && formData.images) {
    try {
      images = JSON.parse(formData.images);
    } catch {
      images = [];
    }
  }

  const updateImage = (index: number, value: string | number) => {
    const updated = [...images];
    updated[index] = value;
    handleInputChange('images', updated);
  };

  const addImage = () => {
    handleInputChange('images', [...images, '']);
  };

  const removeImage = (index: number) => {
    const updated = images.filter((_: any, i: number) => i !== index);
    handleInputChange('images', updated);
  };

  return (
    <div className="space-y-4">
      <FormField
        label="Badge Text"
        name="badgeText"
        value={formData.badgeText || 'RIL ESOP Testimonials'}
        onChange={(value) => handleInputChange('badgeText', value)}
        error={errors.badgeText}
        placeholder="e.g., RIL ESOP Testimonials, RRIL ESOP Testimonials"
      />
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Slider Images
        </label>
        <div className="space-y-4">
          {images.map((img: string | number, index: number) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Image {index + 1}</span>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="text-red-600 hover:bg-red-50 px-2 py-1 rounded transition-colors"
                  title="Remove image"
                >
                  <i className="ri-delete-bin-line"></i>
                </button>
              </div>
              <ImageUpload
                label=""
                value={img}
                onChange={(value) => updateImage(index, value)}
                onUpload={uploadImage}
                uploading={uploadingImage}
                pageName="careers"
                sectionName="testimonial-slider"
                allowUrl={true}
                fileType="image"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addImage}
            className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center gap-2"
          >
            <i className="ri-add-line"></i>
            Add Image
          </button>
        </div>
      </div>
    </div>
  );
};

