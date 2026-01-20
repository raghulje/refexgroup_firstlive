import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';

interface SectionContentFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage?: (file: File, pageName?: string, sectionName?: string) => Promise<number | null>;
  uploadingImage?: boolean;
  errors?: Record<string, string>;
  sectionKey?: string;
  pageName?: string;
}

export const SectionContentForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {},
  sectionKey,
  pageName
}: SectionContentFormProps) => {
  // Render different forms based on section key
  if (sectionKey === 'hero') {
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
          label="Subtitle"
          name="subtitle"
          value={formData.subtitle || ''}
          onChange={(value) => handleInputChange('subtitle', value)}
          error={errors.subtitle}
        />
        {uploadImage && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Background Image
            </label>
            <ImageUpload
              label=""
              value={formData.backgroundImage || ''}
              onChange={(mediaId: number | string) => handleInputChange('backgroundImage', mediaId)}
              onUpload={uploadImage}
              uploading={uploadingImage || false}
              pageName={pageName || 'general'}
              sectionName={sectionKey || 'hero'}
              allowUrl={true}
            />
          </div>
        )}
      </div>
    );
  }

  if (sectionKey === 'intro') {
    return (
      <div className="space-y-4">
        {uploadImage && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
              <ImageUpload
                label=""
                value={formData.image || ''}
                onChange={(mediaId: number | string) => handleInputChange('image', mediaId)}
                onUpload={uploadImage}
                uploading={uploadingImage || false}
                pageName={pageName || 'general'}
                sectionName={sectionKey || 'intro'}
                allowUrl={true}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
              <ImageUpload
                label=""
                value={formData.logo || ''}
                onChange={(mediaId: number | string) => handleInputChange('logo', mediaId)}
                onUpload={uploadImage}
                uploading={uploadingImage || false}
                fileType="logo"
                pageName={pageName || 'general'}
                sectionName={sectionKey || 'intro'}
                allowUrl={true}
              />
            </div>
          </>
        )}
        <FormField
          label="Heading"
          name="heading"
          value={formData.heading || ''}
          onChange={(value) => handleInputChange('heading', value)}
          required
          error={errors.heading}
        />
        <FormField
          label="Description"
          name="description"
          type="textarea"
          value={formData.description || ''}
          onChange={(value) => handleInputChange('description', value)}
          required
          error={errors.description}
        />
      </div>
    );
  }

  if (sectionKey === 'championing-change') {
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
          value={formData.description || ''}
          onChange={(value) => handleInputChange('description', value)}
          required
          error={errors.description}
        />
        <FormField
          label="Background Color"
          name="backgroundColor"
          type="color"
          value={formData.backgroundColor || '#7DC144'}
          onChange={(value) => handleInputChange('backgroundColor', value)}
          error={errors.backgroundColor}
        />
        {uploadImage && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Background Pattern</label>
            <ImageUpload
              label=""
              value={formData.backgroundPattern || ''}
              onChange={(mediaId: number | string) => handleInputChange('backgroundPattern', mediaId)}
              onUpload={uploadImage}
              uploading={uploadingImage || false}
              pageName={pageName || 'esg'}
              sectionName="championing-change"
              allowUrl={true}
            />
          </div>
        )}
        <FormField
          label="Text Color"
          name="textColor"
          value={formData.textColor || 'white'}
          onChange={(value) => handleInputChange('textColor', value)}
          error={errors.textColor}
        />
      </div>
    );
  }

  if (sectionKey === 'cta') {
    return (
      <div className="space-y-4">
        <FormField
          label="Title"
          name="title"
          value={formData.title || ''}
          onChange={(value) => handleInputChange('title', value)}
          error={errors.title}
        />
        <FormField
          label="Button Text"
          name="buttonText"
          value={formData.buttonText || ''}
          onChange={(value) => handleInputChange('buttonText', value)}
          error={errors.buttonText}
        />
        <FormField
          label="Button Link"
          name="buttonLink"
          value={formData.buttonLink || ''}
          onChange={(value) => handleInputChange('buttonLink', value)}
          error={errors.buttonLink}
        />
        {uploadImage && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
            <ImageUpload
              label=""
              value={formData.logo || ''}
              onChange={(mediaId: number | string) => handleInputChange('logo', mediaId)}
              onUpload={uploadImage}
              uploading={uploadingImage || false}
              fileType="logo"
              pageName={pageName || 'general'}
              sectionName={sectionKey || 'cta'}
              allowUrl={true}
            />
          </div>
        )}
      </div>
    );
  }

  if (sectionKey === 'sustainability-report') {
    return (
      <div className="space-y-4">
        {uploadImage && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Background Image</label>
            <ImageUpload
              label=""
              value={formData.backgroundImage || ''}
              onChange={(mediaId: number | string) => handleInputChange('backgroundImage', mediaId)}
              onUpload={uploadImage}
              uploading={uploadingImage || false}
              pageName={pageName || 'esg'}
              sectionName="sustainability-report"
              allowUrl={true}
            />
          </div>
        )}
        <FormField
          label="Report Title"
          name="sustainabilityReportTitle"
          value={formData.sustainabilityReportTitle || ''}
          onChange={(value) => handleInputChange('sustainabilityReportTitle', value)}
          error={errors.sustainabilityReportTitle}
        />
        <FormField
          label="Report Button Text"
          name="sustainabilityReportLabel"
          value={formData.sustainabilityReportLabel || ''}
          onChange={(value) => handleInputChange('sustainabilityReportLabel', value)}
          error={errors.sustainabilityReportLabel}
        />
        <FormField
          label="Report URL"
          name="sustainabilityReportUrl"
          value={formData.sustainabilityReportUrl || ''}
          onChange={(value) => handleInputChange('sustainabilityReportUrl', value)}
          error={errors.sustainabilityReportUrl}
        />
        <FormField
          label="Dashboard Title"
          name="dashboardTitle"
          value={formData.dashboardTitle || ''}
          onChange={(value) => handleInputChange('dashboardTitle', value)}
          error={errors.dashboardTitle}
        />
        <FormField
          label="Dashboard Button Text"
          name="dashboardLabel"
          value={formData.dashboardLabel || ''}
          onChange={(value) => handleInputChange('dashboardLabel', value)}
          error={errors.dashboardLabel}
        />
        <FormField
          label="Dashboard URL"
          name="dashboardUrl"
          value={formData.dashboardUrl || ''}
          onChange={(value) => handleInputChange('dashboardUrl', value)}
          error={errors.dashboardUrl}
        />
        <FormField
          label="Overlay Color"
          name="overlayColor"
          type="color"
          value={formData.overlayColor || '#2d5234'}
          onChange={(value) => handleInputChange('overlayColor', value)}
          error={errors.overlayColor}
        />
      </div>
    );
  }

  if (sectionKey === 'sdg') {
    return (
      <div className="space-y-4">
        <FormField
          label="Heading"
          name="heading"
          value={formData.heading || ''}
          onChange={(value) => handleInputChange('heading', value)}
          error={errors.heading}
        />
        <FormField
          label="Description 1"
          name="description1"
          type="textarea"
          value={formData.description1 || ''}
          onChange={(value) => handleInputChange('description1', value)}
          error={errors.description1}
        />
        <FormField
          label="Description 2"
          name="description2"
          type="textarea"
          value={formData.description2 || ''}
          onChange={(value) => handleInputChange('description2', value)}
          error={errors.description2}
        />
        {uploadImage && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
            <ImageUpload
              label=""
              value={formData.image || ''}
              onChange={(mediaId: number | string) => handleInputChange('image', mediaId)}
              onUpload={uploadImage}
              uploading={uploadingImage || false}
              pageName={pageName || 'esg'}
              sectionName="sdg"
              allowUrl={true}
            />
          </div>
        )}
        <FormField
          label="Background Color"
          name="backgroundColor"
          type="color"
          value={formData.backgroundColor || '#7cb342'}
          onChange={(value) => handleInputChange('backgroundColor', value)}
          error={errors.backgroundColor}
        />
      </div>
    );
  }

  // Generic Sections (Overview, Solutions, Projects, etc.)
  const genericSections = [
    'overview', 'solutions', 'services', 'projects', 'investment-focus',
    'wind-energy', 'fleet', 'products', 'manufacturing', 'quality',
    'r-and-d', 'certifications', 'plant-capabilities', 'mission-vision',
    'core-values', 'story', 'initiatives', 'our-commitment',
    'quality-assurance', 'applications', 'technology', 'gallery'
  ];

  if (genericSections.some(key => sectionKey === key || sectionKey?.includes(key))) {
    return (
      <div className="space-y-4">
        <FormField
          label="Heading"
          name="heading"
          value={formData.heading || ''}
          onChange={(value) => handleInputChange('heading', value)}
          error={errors.heading}
        />
        <FormField
          label="Subtitle"
          name="subtitle"
          value={formData.subtitle || ''}
          onChange={(value) => handleInputChange('subtitle', value)}
          error={errors.subtitle}
        />
        <FormField
          label="Description"
          name="description"
          type="textarea"
          value={formData.description || ''}
          onChange={(value) => handleInputChange('description', value)}
          rows={6}
          error={errors.description}
        />

        {uploadImage && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Main Image</label>
              <ImageUpload
                label=""
                value={formData.image || ''}
                onChange={(mediaId: number | string) => handleInputChange('image', mediaId)}
                onUpload={uploadImage}
                uploading={uploadingImage || false}
                pageName={pageName || 'general'}
                sectionName={sectionKey || 'generic'}
                allowUrl={true}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Background Image (Optional)</label>
              <ImageUpload
                label=""
                value={formData.backgroundImage || ''}
                onChange={(mediaId: number | string) => handleInputChange('backgroundImage', mediaId)}
                onUpload={uploadImage}
                uploading={uploadingImage || false}
                pageName={pageName || 'general'}
                sectionName={sectionKey || 'generic'}
                allowUrl={true}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Button Text"
            name="buttonText"
            value={formData.buttonText || ''}
            onChange={(value) => handleInputChange('buttonText', value)}
            error={errors.buttonText}
          />
          <FormField
            label="Button Link"
            name="buttonLink"
            value={formData.buttonLink || ''}
            onChange={(value) => handleInputChange('buttonLink', value)}
            error={errors.buttonLink}
          />
        </div>
      </div>
    );
  }

  // Default JSON editor for complex sections
  return (
    <div className="space-y-4">
      <FormField
        label="Content (JSON)"
        name="content"
        type="textarea"
        value={typeof formData === 'string' ? formData : JSON.stringify(formData, null, 2)}
        onChange={(value) => handleInputChange('content', value)}
        error={errors.content}
        helpText="Enter JSON content for this section"
      />
      <div className="p-4 bg-yellow-50 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> This section uses JSON format. Make sure the JSON is valid before saving.
        </p>
      </div>
    </div>
  );
};

