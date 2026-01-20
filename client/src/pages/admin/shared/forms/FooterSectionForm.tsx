import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';

interface FooterSectionFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  errors?: Record<string, string>;
}

export const FooterSectionForm = ({ formData, handleInputChange, errors }: FooterSectionFormProps) => {
  const links = Array.isArray(formData.links) ? formData.links : [];

  const addLink = () => {
    const newLinks = [...links, { label: '', path: '' }];
    handleInputChange('links', newLinks);
  };

  const removeLink = (index: number) => {
    const newLinks = links.filter((_: any, i: number) => i !== index);
    handleInputChange('links', newLinks);
  };

  const updateLink = (index: number, field: string, value: string) => {
    const newLinks = [...links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    handleInputChange('links', newLinks);
  };

  return (
    <div className="space-y-4">
      <FormField
        label="Section Type"
        name="sectionType"
        type="select"
        value={formData.sectionType || 'business'}
        onChange={(value) => handleInputChange('sectionType', value)}
        options={[
          { value: 'business', label: 'Business Links' },
          { value: 'quick-links', label: 'Quick Links' },
          { value: 'other', label: 'Other Links' },
          { value: 'contact', label: 'Contact Information' },
        ]}
        required
        error={errors?.sectionType}
      />

      <FormField
        label="Section Title"
        name="sectionTitle"
        type="text"
        value={formData.sectionTitle || ''}
        onChange={(value) => handleInputChange('sectionTitle', value)}
        placeholder="e.g., BUSINESS, QUICK LINKS"
        required
        error={errors?.sectionTitle}
      />

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Links
          </label>
          <button
            type="button"
            onClick={addLink}
            className="px-3 py-1 bg-blue-600 dark:bg-blue-700 text-white rounded text-sm hover:bg-blue-700 dark:hover:bg-blue-800"
          >
            <i className="ri-add-line mr-1"></i>
            Add Link
          </button>
        </div>

        {links.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 py-4 text-center border border-dashed border-gray-300 dark:border-gray-600 rounded">
            No links added. Click "Add Link" to add links to this section.
          </p>
        ) : (
          <div className="space-y-3">
            {links.map((link: any, index: number) => (
              <div
                key={index}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Link {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeLink(index)}
                    className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                  >
                    <i className="ri-delete-bin-line"></i>
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Label
                    </label>
                    <input
                      type="text"
                      value={link.label || ''}
                      onChange={(e) => updateLink(index, 'label', e.target.value)}
                      placeholder="Link label"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Path/URL
                    </label>
                    <input
                      type="text"
                      value={link.path || ''}
                      onChange={(e) => updateLink(index, 'path', e.target.value)}
                      placeholder="/page-path or https://..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <FormField
        label="Order Index"
        name="orderIndex"
        type="number"
        value={formData.orderIndex || 0}
        onChange={(value) => handleInputChange('orderIndex', parseInt(value) || 0)}
        min={0}
        error={errors?.orderIndex}
        helpText="Lower numbers appear first"
      />

      <FormField
        label="Active"
        name="isActive"
        type="checkbox"
        value={formData.isActive !== undefined ? formData.isActive : true}
        onChange={(value) => handleInputChange('isActive', value)}
      />
    </div>
  );
};
