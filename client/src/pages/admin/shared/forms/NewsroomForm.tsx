import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';

interface NewsroomFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage: (file: File) => Promise<string | null>;
  uploadingImage: boolean;
  errors?: Record<string, string>;
}

export const NewsroomForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {}
}: NewsroomFormProps) => {
  return (
    <div className="space-y-4">
      <FormField
        label="Type"
        name="type"
        type="select"
        value={formData.type || 'press'}
        onChange={(value) => handleInputChange('type', value)}
        required
        error={errors.type}
        options={[
          { value: 'press', label: 'Press Release' },
          { value: 'event', label: 'Event' }
        ]}
        helpText="Type of newsroom item"
      />
      
      <FormField
        label="Title"
        name="title"
        value={formData.title || ''}
        onChange={(value) => handleInputChange('title', value)}
        required
        error={errors.title}
        helpText="Title of the news item or event"
      />
      
      <FormField
        label="Link URL"
        name="link"
        type="url"
        value={formData.link || ''}
        onChange={(value) => handleInputChange('link', value)}
        error={errors.link}
        helpText="External link to the full article or event page"
      />

      <FormField
        label="Order Index"
        name="orderIndex"
        type="number"
        value={formData.orderIndex || 0}
        onChange={(value) => handleInputChange('orderIndex', parseInt(value) || 0)}
        error={errors.orderIndex}
        helpText="Display order (lower numbers appear first)"
      />
      
      <ImageUpload
        label="Background Image (Featured Image)"
        value={formData.featuredImageId || formData.image || ''}
        onChange={(value) => handleInputChange('featuredImageId', value)}
        onUpload={uploadImage}
        uploading={uploadingImage}
        error={errors.featuredImageId || errors.image}
      />
      {!errors.featuredImageId && !errors.image && (
        <p className="text-xs text-gray-500 -mt-3">Background image for the newsroom card (will be displayed as full-cover background)</p>
      )}
      
      <ImageUpload
        label="Media Logo (for Press Releases)"
        value={formData.logo || ''}
        onChange={(value) => handleInputChange('logo', value)}
        onUpload={uploadImage}
        uploading={uploadingImage}
        error={errors.logo}
      />
      {!errors.logo && (
        <p className="text-xs text-gray-500 -mt-3">Logo image for press releases (e.g., ET Now, ET Auto) - displayed in top-left corner</p>
      )}
      
      <FormField
        label="Badge"
        name="badge"
        value={formData.badge || ''}
        onChange={(value) => handleInputChange('badge', value)}
        error={errors.badge}
        helpText="Badge text (e.g., 'Press Release', 'Event')"
      />
      
      <FormField
        label="Category"
        name="category"
        value={formData.category || ''}
        onChange={(value) => handleInputChange('category', value)}
        error={errors.category}
        helpText="Category for filtering (e.g., 'Press Release', 'Event')"
      />
      
      <FormField
        label="Published Date"
        name="publishedAt"
        type="date"
        value={formData.publishedAt || ''}
        onChange={(value) => handleInputChange('publishedAt', value)}
        error={errors.publishedAt}
        helpText="Date when this item was published"
      />
      
      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Featured"
          name="isFeatured"
          type="checkbox"
          value={formData.isFeatured !== undefined ? formData.isFeatured : false}
          onChange={(value) => handleInputChange('isFeatured', value)}
          error={errors.isFeatured}
          helpText="Show as featured item"
        />
        
        <FormField
          label="Active"
          name="isActive"
          type="checkbox"
          value={formData.isActive !== undefined ? formData.isActive : true}
          onChange={(value) => handleInputChange('isActive', value)}
          error={errors.isActive}
        />
      </div>
    </div>
  );
};
