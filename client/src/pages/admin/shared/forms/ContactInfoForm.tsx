import { FormField } from '../FormField';

interface ContactInfoFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  errors?: Record<string, string>;
}

export const ContactInfoForm = ({
  formData,
  handleInputChange,
  errors = {}
}: ContactInfoFormProps) => {
  return (
    <div className="space-y-4">
      <FormField
        label="Info Type"
        name="infoType"
        type="select"
        value={formData.infoType || 'email'}
        onChange={(value) => handleInputChange('infoType', value)}
        required
        error={errors.infoType}
        options={[
          { value: 'email', label: 'Email' },
          { value: 'phone', label: 'Phone' },
          { value: 'address', label: 'Address' },
          { value: 'website', label: 'Website' },
          { value: 'other', label: 'Other' }
        ]}
        helpText="Type of contact information"
      />
      
      <FormField
        label="Label"
        name="label"
        value={formData.label || ''}
        onChange={(value) => handleInputChange('label', value)}
        error={errors.label}
        helpText="Display label (e.g., 'Email', 'Phone')"
      />
      
      <FormField
        label="Value"
        name="value"
        value={formData.value || ''}
        onChange={(value) => handleInputChange('value', value)}
        required
        error={errors.value}
        helpText="The actual contact information value"
      />
      
      <FormField
        label="Icon Class"
        name="iconClass"
        value={formData.iconClass || ''}
        onChange={(value) => handleInputChange('iconClass', value)}
        error={errors.iconClass}
        helpText="Remix Icon class (e.g., 'ri-mail-line', 'ri-phone-line')"
      />
      
      <FormField
        label="Display Location"
        name="displayLocation"
        type="select"
        value={formData.displayLocation || 'footer'}
        onChange={(value) => handleInputChange('displayLocation', value)}
        error={errors.displayLocation}
        options={[
          { value: 'footer', label: 'Footer' },
          { value: 'header', label: 'Header' },
          { value: 'contact-page', label: 'Contact Page' },
          { value: 'all', label: 'All Locations' }
        ]}
        helpText="Where this contact info should be displayed"
      />
      
      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Order Index"
          name="orderIndex"
          type="number"
          value={formData.orderIndex !== undefined ? formData.orderIndex : 0}
          onChange={(value) => handleInputChange('orderIndex', parseInt(value) || 0)}
          error={errors.orderIndex}
          helpText="Display order (lower numbers appear first)"
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
