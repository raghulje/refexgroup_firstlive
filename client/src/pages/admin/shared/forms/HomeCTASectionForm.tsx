import { FormField } from '../FormField';

interface HomeCTASectionFormProps {
    formData: any;
    handleInputChange: (key: string, value: any) => void;
    errors?: Record<string, string>;
}

export const HomeCTASectionForm = ({
    formData,
    handleInputChange,
    errors = {}
}: HomeCTASectionFormProps) => {
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
                label="Link Text"
                name="linkText"
                value={formData.linkText || ''}
                onChange={(value) => handleInputChange('linkText', value)}
                error={errors.linkText}
            />

            <FormField
                label="Link URL"
                name="linkUrl"
                value={formData.linkUrl || ''}
                onChange={(value) => handleInputChange('linkUrl', value)}
                error={errors.linkUrl}
            />

            <FormField
                label="Order Index"
                name="orderIndex"
                type="number"
                value={formData.orderIndex || 0}
                onChange={(value) => handleInputChange('orderIndex', parseInt(value))}
                error={errors.orderIndex}
            />
        </div>
    );
};
