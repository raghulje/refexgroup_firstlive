import { useState, useEffect } from 'react';
import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';
import { pagesService } from '../../../../services/apiService';

interface AboutSectionContentFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage?: (file: File, pageName?: string, sectionName?: string) => Promise<number | null>;
  uploadingImage?: boolean;
  errors?: Record<string, string>;
  pageName?: string;
  sectionName?: string;
}

export const AboutSectionContentForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {},
  pageName,
  sectionName
}: AboutSectionContentFormProps) => {
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

  // Handle paragraphs - convert between array and string
  let paragraphs: string[] = [];
  if (Array.isArray(formData.paragraphs)) {
    paragraphs = formData.paragraphs;
  } else if (formData.paragraphs) {
    try {
      paragraphs = JSON.parse(formData.paragraphs);
      if (!Array.isArray(paragraphs)) {
        paragraphs = [formData.paragraphs];
      }
    } catch {
      // If not JSON, treat as single string or split by newlines
      paragraphs = typeof formData.paragraphs === 'string' 
        ? formData.paragraphs.split('\n').filter(p => p.trim())
        : [String(formData.paragraphs)];
    }
  }

  const handleParagraphChange = (index: number, value: string) => {
    const updated = [...paragraphs];
    updated[index] = value;
    handleInputChange('paragraphs', JSON.stringify(updated));
  };

  const addParagraph = () => {
    const updated = [...paragraphs, ''];
    handleInputChange('paragraphs', JSON.stringify(updated));
  };

  const removeParagraph = (index: number) => {
    const updated = paragraphs.filter((_: any, i: number) => i !== index);
    handleInputChange('paragraphs', JSON.stringify(updated));
  };

  return (
    <div className="space-y-4">
      <FormField
        label="Label"
        name="label"
        value={formData.label || ''}
        onChange={(value) => handleInputChange('label', value)}
        required
        error={errors.label}
        helpText="Section label (e.g., 'About')"
      />
      
      {uploadImage && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Logo
          </label>
          <ImageUpload
            label=""
            value={formData.logo || ''}
            onChange={(mediaId: number | string) => handleInputChange('logo', mediaId)}
            onUpload={uploadImage}
            uploading={uploadingImage || false}
            fileType="logo"
            pageName={pageName || 'about-refex'}
            sectionName={sectionName || 'about'}
            allowUrl={true}
          />
          {errors.logo && (
            <p className="mt-1 text-sm text-red-600">{errors.logo}</p>
          )}
        </div>
      )}
      
      <FormField
        label="Title"
        name="title"
        value={formData.title || ''}
        onChange={(value) => handleInputChange('title', value)}
        required
        error={errors.title}
        helpText="Title with HTML support (e.g., 'Choosing green,<br />Chasing growth')"
      />
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Content Paragraphs
        </label>
        <div className="space-y-3">
          {paragraphs.map((paragraph: string, index: number) => (
            <div key={index} className="flex gap-2">
              <FormField
                name={`paragraph-${index}`}
                value={paragraph}
                onChange={(value) => handleParagraphChange(index, value)}
                type="textarea"
                error={errors[`paragraph-${index}`]}
              />
              <button
                type="button"
                onClick={() => removeParagraph(index)}
                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                title="Remove paragraph"
              >
                <i className="ri-delete-bin-line"></i>
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addParagraph}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            <i className="ri-add-line"></i>
            Add Paragraph
          </button>
        </div>
      </div>
      
      {uploadImage && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image
          </label>
          <ImageUpload
            label=""
            value={formData.image || ''}
            onChange={(mediaId: number | string) => handleInputChange('image', mediaId)}
            onUpload={uploadImage}
            uploading={uploadingImage || false}
            pageName={pageName || 'about-refex'}
            sectionName={sectionName || 'about'}
            allowUrl={true}
          />
          {errors.image && (
            <p className="mt-1 text-sm text-red-600">{errors.image}</p>
          )}
        </div>
      )}
      
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
          helpText="Enter full URL (e.g., https://example.com)"
        />
      )}
    </div>
  );
};

