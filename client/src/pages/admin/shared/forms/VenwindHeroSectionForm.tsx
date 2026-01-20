import { useState, useEffect } from 'react';
import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';
import { ImagePositionControl } from '../ImagePositionControl';
import { pagesService } from '../../../../services/apiService';

interface VenwindHeroSectionFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage?: (file: File, pageName?: string, sectionName?: string) => Promise<number | null>;
  uploadingImage?: boolean;
  errors?: Record<string, string>;
  pageName?: string;
  sectionName?: string;
}

export const VenwindHeroSectionForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {},
  pageName = 'venwind',
  sectionName = 'hero'
}: VenwindHeroSectionFormProps) => {
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
  const isInternalLink = formData.buttonLink && !formData.buttonLink.startsWith('http') && !formData.buttonLink.startsWith('#');
  const linkType = formData.linkType || (isInternalLink ? 'internal' : (formData.buttonLink ? 'external' : 'anchor'));

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
        label="Tagline"
        name="tagline"
        value={formData.tagline || formData.subtitle || ''}
        onChange={(value) => {
          handleInputChange('tagline', value);
          handleInputChange('subtitle', value); // Keep subtitle in sync for backward compatibility
        }}
        error={errors.tagline}
        helpText="Small text above the main title"
      />

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
        rows={4}
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
          <label className="flex items-center">
            <input
              type="radio"
              name="linkType"
              value="anchor"
              checked={linkType === 'anchor'}
              onChange={(e) => handleLinkTypeChange(e.target.value)}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Anchor Link</span>
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
          helpText="Enter full URL (e.g., https://example.com)"
        />
      )}

      {/* Anchor Link Input */}
      {linkType === 'anchor' && (
        <FormField
          label="Anchor Link"
          name="buttonLink"
          value={formData.buttonLink || ''}
          onChange={(value) => handleInputChange('buttonLink', value)}
          error={errors.buttonLink}
          helpText="Anchor link (e.g., #explore)"
        />
      )}

      {uploadImage && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Background Image
          </label>
          <ImageUpload
            label=""
            value={formData.backgroundImage || formData.backgroundImageId || ''}
            onChange={(mediaId: number | string) => handleInputChange('backgroundImage', mediaId)}
            onUpload={uploadImage}
            uploading={uploadingImage || false}
            pageName={pageName}
            sectionName={sectionName}
            allowUrl={true}
            error={errors.backgroundImage}
          />
          {errors.backgroundImage && (
            <p className="mt-1 text-sm text-red-600">{errors.backgroundImage}</p>
          )}
          
          {/* Image Position Control */}
          {(formData.backgroundImage || formData.backgroundImageId) && (
            <div className="mt-4">
              <ImagePositionControl
                label="Background Image Position"
                positionX={formData.backgroundPositionX || formData.backgroundImagePositionX || '50'}
                positionY={formData.backgroundPositionY || formData.backgroundImagePositionY || '50'}
                onChangeX={(value) => {
                  handleInputChange('backgroundPositionX', value);
                  handleInputChange('backgroundImagePositionX', value);
                }}
                onChangeY={(value) => {
                  handleInputChange('backgroundPositionY', value);
                  handleInputChange('backgroundImagePositionY', value);
                }}
                imageMediaId={formData.backgroundImage || formData.backgroundImageId}
                helpText="Adjust X and Y position (0-100%) to control which part of the image is visible"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

