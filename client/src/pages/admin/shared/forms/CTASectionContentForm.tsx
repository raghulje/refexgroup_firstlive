import { FormField } from '../FormField';

interface CTASectionContentFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  errors?: Record<string, string>;
}

export const CTASectionContentForm = ({
  formData,
  handleInputChange,
  errors = {}
}: CTASectionContentFormProps) => {
  return (
    <div className="space-y-6">
      {/* Card 1 */}
      <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Card 1</h3>
        <div className="space-y-4">
          <FormField
            label="Title"
            name="card1Title"
            value={formData.card1Title || ''}
            onChange={(value) => handleInputChange('card1Title', value)}
            error={errors.card1Title}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Button Text"
              name="card1ButtonText"
              value={formData.card1ButtonText || ''}
              onChange={(value) => handleInputChange('card1ButtonText', value)}
              error={errors.card1ButtonText}
            />
            <FormField
              label="Button Link"
              name="card1ButtonLink"
              value={formData.card1ButtonLink || ''}
              onChange={(value) => handleInputChange('card1ButtonLink', value)}
              error={errors.card1ButtonLink}
            />
          </div>
        </div>
      </div>

      {/* Card 2 */}
      <div className="border-2 border-green-200 rounded-lg p-4 bg-green-50">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Card 2</h3>
        <div className="space-y-4">
          <FormField
            label="Title"
            name="card2Title"
            value={formData.card2Title || ''}
            onChange={(value) => handleInputChange('card2Title', value)}
            error={errors.card2Title}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Button Text"
              name="card2ButtonText"
              value={formData.card2ButtonText || ''}
              onChange={(value) => handleInputChange('card2ButtonText', value)}
              error={errors.card2ButtonText}
            />
            <FormField
              label="Button Link"
              name="card2ButtonLink"
              value={formData.card2ButtonLink || ''}
              onChange={(value) => handleInputChange('card2ButtonLink', value)}
              error={errors.card2ButtonLink}
            />
          </div>
        </div>
      </div>

      {/* Card 3 */}
      <div className="border-2 border-purple-200 rounded-lg p-4 bg-purple-50">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Card 3</h3>
        <div className="space-y-4">
          <FormField
            label="Title"
            name="card3Title"
            value={formData.card3Title || ''}
            onChange={(value) => handleInputChange('card3Title', value)}
            error={errors.card3Title}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Button Text"
              name="card3ButtonText"
              value={formData.card3ButtonText || ''}
              onChange={(value) => handleInputChange('card3ButtonText', value)}
              error={errors.card3ButtonText}
            />
            <FormField
              label="Button Link"
              name="card3ButtonLink"
              value={formData.card3ButtonLink || ''}
              onChange={(value) => handleInputChange('card3ButtonLink', value)}
              error={errors.card3ButtonLink}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

