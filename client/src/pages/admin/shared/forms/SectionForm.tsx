import { FormField } from '../FormField';

interface SectionFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  errors?: Record<string, string>;
}

export const SectionForm = ({
  formData,
  handleInputChange,
  errors = {}
}: SectionFormProps) => {
  return (
    <div className="space-y-4">
      <FormField
        label="Section Key"
        name="sectionKey"
        value={formData.sectionKey || ''}
        onChange={(value) => handleInputChange('sectionKey', value)}
        required
        error={errors.sectionKey}
        helpText="Unique identifier for this section (e.g., 'hero', 'about')"
      />
      
      <FormField
        label="Section Type"
        name="sectionType"
        type="select"
        value={formData.sectionType || ''}
        onChange={(value) => handleInputChange('sectionType', value)}
        required
        error={errors.sectionType}
        options={[
          { value: '', label: 'Select type' },
          { value: 'hero', label: 'Hero' },
          { value: 'content', label: 'Content' },
          { value: 'cta', label: 'CTA' },
          { value: 'grid', label: 'Grid' },
          { value: 'list', label: 'List' },
          { value: 'custom', label: 'Custom' }
        ]}
      />
      
      <FormField
        label="Order Index"
        name="orderIndex"
        type="number"
        value={formData.orderIndex || 0}
        onChange={(value) => handleInputChange('orderIndex', parseInt(value) || 0)}
        error={errors.orderIndex}
      />
      
      <FormField
        label="Active"
        name="isActive"
        type="checkbox"
        value={formData.isActive}
        onChange={(value) => handleInputChange('isActive', value)}
      />
      
      <div className="p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Section content is managed separately. Use the "Edit Content" option to modify section content.
        </p>
      </div>
    </div>
  );
};

