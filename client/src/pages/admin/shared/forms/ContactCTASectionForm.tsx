import { FormField } from '../FormField';

interface ContactCTASectionFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  errors?: Record<string, string>;
}

export const ContactCTASectionForm = ({
  formData,
  handleInputChange,
  errors = {}
}: ContactCTASectionFormProps) => {
  // Parse cards from JSON or use default structure
  let cards = [];
  if (Array.isArray(formData.cards)) {
    cards = formData.cards;
  } else if (typeof formData.cards === 'string' && formData.cards) {
    try {
      cards = JSON.parse(formData.cards);
    } catch {
      cards = [];
    }
  }
  
  // Ensure we have at least 2 cards
  while (cards.length < 2) {
    cards.push({ title: '', buttonText: '', buttonLink: '' });
  }

  const updateCard = (index: number, field: string, value: string) => {
    const updatedCards = [...cards];
    updatedCards[index] = { ...updatedCards[index], [field]: value };
    handleInputChange('cards', updatedCards);
  };

  return (
    <div className="space-y-6">
      <FormField
        label="Background Color/Gradient"
        name="backgroundColor"
        value={formData.backgroundColor || ''}
        onChange={(value) => handleInputChange('backgroundColor', value)}
        error={errors.backgroundColor}
        helpText="CSS gradient or color (e.g., linear-gradient(to right, #3b8ac6, #4a9fd8))"
      />

      {/* Card 1 */}
      <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Card 1 - News</h3>
        <div className="space-y-4">
          <FormField
            label="Title"
            name="card1Title"
            value={cards[0]?.title || ''}
            onChange={(value) => updateCard(0, 'title', value)}
            error={errors.card1Title}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Button Text"
              name="card1ButtonText"
              value={cards[0]?.buttonText || ''}
              onChange={(value) => updateCard(0, 'buttonText', value)}
              error={errors.card1ButtonText}
            />
            <FormField
              label="Button Link"
              name="card1ButtonLink"
              value={cards[0]?.buttonLink || ''}
              onChange={(value) => updateCard(0, 'buttonLink', value)}
              error={errors.card1ButtonLink}
            />
          </div>
        </div>
      </div>

      {/* Card 2 */}
      <div className="border-2 border-green-200 rounded-lg p-4 bg-green-50">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Card 2 - Careers</h3>
        <div className="space-y-4">
          <FormField
            label="Title"
            name="card2Title"
            value={cards[1]?.title || ''}
            onChange={(value) => updateCard(1, 'title', value)}
            error={errors.card2Title}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Button Text"
              name="card2ButtonText"
              value={cards[1]?.buttonText || ''}
              onChange={(value) => updateCard(1, 'buttonText', value)}
              error={errors.card2ButtonText}
            />
            <FormField
              label="Button Link"
              name="card2ButtonLink"
              value={cards[1]?.buttonLink || ''}
              onChange={(value) => updateCard(1, 'buttonLink', value)}
              error={errors.card2ButtonLink}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

