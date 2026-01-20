import { FormField } from '../FormField';

interface JobFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  errors?: Record<string, string>;
}

export const JobForm = ({
  formData,
  handleInputChange,
  errors = {}
}: JobFormProps) => {
  return (
    <div className="space-y-4">
      <FormField
        label="Title"
        name="title"
        value={formData.title}
        onChange={(value) => handleInputChange('title', value)}
        required
        error={errors.title}
      />
      
      <FormField
        label="Department"
        name="department"
        value={formData.department}
        onChange={(value) => handleInputChange('department', value)}
        error={errors.department}
      />
      
      <FormField
        label="Location"
        name="location"
        value={formData.location}
        onChange={(value) => handleInputChange('location', value)}
        error={errors.location}
      />
      
      <FormField
        label="Job Type"
        name="jobType"
        type="select"
        value={formData.jobType}
        onChange={(value) => handleInputChange('jobType', value)}
        options={[
          { value: 'full-time', label: 'Full Time' },
          { value: 'part-time', label: 'Part Time' },
          { value: 'contract', label: 'Contract' },
          { value: 'internship', label: 'Internship' }
        ]}
        error={errors.jobType}
      />
      
      <FormField
        label="Description"
        name="description"
        type="textarea"
        rows={6}
        value={formData.description}
        onChange={(value) => handleInputChange('description', value)}
        error={errors.description}
      />
      
      <FormField
        label="Requirements"
        name="requirements"
        type="textarea"
        rows={6}
        value={formData.requirements}
        onChange={(value) => handleInputChange('requirements', value)}
        error={errors.requirements}
      />
      
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

