import { FormField } from '../FormField';

interface RefrigerantsCTASectionFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  errors?: Record<string, string>;
}

export const RefrigerantsCTASectionForm = ({
  formData,
  handleInputChange,
  errors = {}
}: RefrigerantsCTASectionFormProps) => {
  return (
    <div className="space-y-4">
      <FormField
        label="Card 1 Title"
        name="card1Title"
        value={formData.card1Title || ''}
        onChange={(value) => handleInputChange('card1Title', value)}
        error={errors.card1Title}
      />

      <FormField
        label="Card 1 Description"
        name="card1Description"
        type="textarea"
        rows={3}
        value={formData.card1Description || ''}
        onChange={(value) => handleInputChange('card1Description', value)}
        error={errors.card1Description}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Card 1 Button Text"
          name="card1ButtonText"
          value={formData.card1ButtonText || ''}
          onChange={(value) => handleInputChange('card1ButtonText', value)}
          error={errors.card1ButtonText}
        />
        <FormField
          label="Card 1 Button Link"
          name="card1ButtonLink"
          value={formData.card1ButtonLink || ''}
          onChange={(value) => handleInputChange('card1ButtonLink', value)}
          error={errors.card1ButtonLink}
        />
      </div>

      <div className="border-t border-gray-200 pt-4 mt-4">
        <FormField
          label="Card 2 Title"
          name="card2Title"
          value={formData.card2Title || ''}
          onChange={(value) => handleInputChange('card2Title', value)}
          error={errors.card2Title}
        />

        <FormField
          label="Card 2 Description"
          name="card2Description"
          type="textarea"
          rows={3}
          value={formData.card2Description || ''}
          onChange={(value) => handleInputChange('card2Description', value)}
          error={errors.card2Description}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Card 2 Button Text"
            name="card2ButtonText"
            value={formData.card2ButtonText || ''}
            onChange={(value) => handleInputChange('card2ButtonText', value)}
            error={errors.card2ButtonText}
          />
          <FormField
            label="Card 2 Button Link"
            name="card2ButtonLink"
            value={formData.card2ButtonLink || ''}
            onChange={(value) => handleInputChange('card2ButtonLink', value)}
            error={errors.card2ButtonLink}
          />
        </div>
      </div>
    </div>
  );
};

