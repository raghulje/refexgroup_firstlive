import { useState, useEffect } from 'react';
import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';
import { pagesService } from '../../../../services/apiService';

interface HeroSlideFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage: (file: File) => Promise<string | null>;
  uploadingImage: boolean;
  errors?: Record<string, string>;
}

export const HeroSlideForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {}
}: HeroSlideFormProps) => {
  const [pages, setPages] = useState<any[]>([]);
  const [loadingPages, setLoadingPages] = useState(false);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        setLoadingPages(true);
        const pagesData = await pagesService.getAll();
        setPages(pagesData);
      } catch (error) {
        console.error('Error fetching pages:', error);
      } finally {
        setLoadingPages(false);
      }
    };
    fetchPages();
  }, []);

  // Determine link type based on buttonLink value
  const isInternalLink = formData.buttonLink && !formData.buttonLink.startsWith('http');
  const linkType = formData.linkType || (isInternalLink ? 'internal' : (formData.buttonLink ? 'external' : 'internal'));

  const handleLinkTypeChange = (type: string) => {
    handleInputChange('linkType', type);
    if (type === 'internal') {
      handleInputChange('buttonLink', '');
    } else {
      handleInputChange('buttonLink', '');
    }
  };

  return (
    <div className="space-y-2.5 w-full">
      <FormField
        label="Title"
        name="title"
        value={formData.title || ''}
        onChange={(value) => handleInputChange('title', value)}
        required
        error={errors.title}
      />
      
      <FormField
        label="Subtitle"
        name="subtitle"
        value={formData.subtitle || ''}
        onChange={(value) => handleInputChange('subtitle', value)}
        error={errors.subtitle}
      />
      
      <div className="col-span-full">
        <FormField
          label="Description"
          name="description"
          type="textarea"
          rows={4}
          value={formData.description || ''}
          onChange={(value) => handleInputChange('description', value)}
          error={errors.description}
        />
      </div>
      
      <FormField
        label="Button Text"
        name="buttonText"
        value={formData.buttonText || ''}
        onChange={(value) => handleInputChange('buttonText', value)}
        error={errors.buttonText}
      />
      
      {/* Link Type Selection */}
      <div className="col-span-full">
        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1.5">
          Link Type
        </label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="linkType"
              value="internal"
              checked={linkType === 'internal'}
              onChange={(e) => handleLinkTypeChange(e.target.value)}
              className="mr-2"
            />
            <span className="text-xs text-gray-700 dark:text-gray-300">Internal Link</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="linkType"
              value="external"
              checked={linkType === 'external'}
              onChange={(e) => handleLinkTypeChange(e.target.value)}
              className="mr-2"
            />
            <span className="text-xs text-gray-700 dark:text-gray-300">External Link</span>
          </label>
        </div>
      </div>

      {/* Internal Link Dropdown */}
      {linkType === 'internal' && (
        <div className="col-span-full">
          <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1.5">
            Select Page
          </label>
          <select
            value={formData.buttonLink || ''}
            onChange={(e) => handleInputChange('buttonLink', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-50/50 hover:bg-white focus:bg-white dark:bg-gray-800/50 dark:border-gray-700"
            disabled={loadingPages}
          >
            <option value="">Select a page...</option>
            {pages.map((page) => (
              <option key={page.id} value={`/${page.slug}`}>
                {page.title} ({page.slug})
              </option>
            ))}
          </select>
          {errors.buttonLink && (
            <p className="mt-1 text-xs text-red-500">{errors.buttonLink}</p>
          )}
        </div>
      )}

      {/* External Link Input */}
      {linkType === 'external' && (
        <FormField
          label="External URL"
          name="buttonLink"
          type="url"
          value={formData.buttonLink || ''}
          onChange={(value) => handleInputChange('buttonLink', value)}
          error={errors.buttonLink}
          helpText="Enter full URL (e.g., https://example.com)"
        />
      )}
      
      <div className="col-span-full">
        <ImageUpload
          label="Background Image"
          value={formData.backgroundImage || formData.backgroundImageId || ''}
          onChange={(value) => handleInputChange('backgroundImage', value)}
          onUpload={uploadImage}
          uploading={uploadingImage}
          error={errors.backgroundImage}
          fieldName="backgroundImageId"
          pageName="home"
          sectionName="hero"
        />
      </div>
      
      <FormField
        label="Active"
        name="isActive"
        type="checkbox"
        value={formData.isActive}
        onChange={(value) => handleInputChange('isActive', value)}
      />
    </div>
  );
};

