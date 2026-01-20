import { useState, useEffect } from 'react';
import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';
import { pagesService } from '../../../../services/apiService';

interface VenwindCTASectionFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage?: (file: File) => Promise<number | null>;
  uploadingImage?: boolean;
  errors?: Record<string, string>;
}

export const VenwindCTASectionForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {}
}: VenwindCTASectionFormProps) => {
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
  const linkType = formData.linkType || (isInternalLink ? 'internal' : (formData.buttonLink ? 'external' : 'external'));

  const handleLinkTypeChange = (type: string) => {
    handleInputChange('linkType', type);
    if (type === 'internal') {
      handleInputChange('buttonLink', '');
    } else {
      handleInputChange('buttonLink', '');
    }
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
        label="Description"
        name="description"
        type="textarea"
        rows={3}
        value={formData.description || ''}
        onChange={(value) => handleInputChange('description', value)}
        error={errors.description}
      />

      <FormField
        label="Button Text"
        name="buttonText"
        value={formData.buttonText || ''}
        onChange={(value) => handleInputChange('buttonText', value)}
        error={errors.buttonText}
      />

      {/* Link Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
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
            <span className="text-sm text-gray-700">Internal Link</span>
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
            <span className="text-sm text-gray-700">External Link</span>
          </label>
        </div>
      </div>

      {/* Internal Link Dropdown */}
      {linkType === 'internal' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Page
          </label>
          <select
            value={formData.buttonLink || ''}
            onChange={(e) => handleInputChange('buttonLink', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            <p className="mt-1 text-sm text-red-600">{errors.buttonLink}</p>
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
          helpText="Enter full URL (e.g., https://venwind.in/)"
        />
      )}

      <FormField
        label="Overlay Gradient"
        name="overlayGradient"
        value={formData.overlayGradient || 'linear-gradient(185deg, #2A78B247 0%, #005F11D9 71%)'}
        onChange={(value) => handleInputChange('overlayGradient', value)}
        error={errors.overlayGradient}
        helpText="CSS gradient for overlay (e.g., linear-gradient(185deg, #2A78B247 0%, #005F11D9 71%))"
      />

      {uploadImage && (
        <ImageUpload
          label="Background Image"
          value={formData.backgroundImage || ''}
          onChange={(mediaId) => handleInputChange('backgroundImage', mediaId)}
          onUpload={uploadImage}
          uploading={uploadingImage || false}
        />
      )}
    </div >
  );
};

