import { FormField } from '../FormField';

interface NewsroomCTASectionFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  errors?: Record<string, string>;
}

export const NewsroomCTASectionForm = ({
  formData,
  handleInputChange,
  errors = {}
}: NewsroomCTASectionFormProps) => {
  // Parse cards from JSON or use array, fallback to individual card fields
  let cardsArray: any[] = [];
  
  if (formData.cards) {
    if (Array.isArray(formData.cards)) {
      cardsArray = formData.cards;
    } else if (typeof formData.cards === 'string') {
      try {
        cardsArray = JSON.parse(formData.cards);
      } catch {
        cardsArray = [];
      }
    }
  }
  
  // If no cards array, try to build from individual card fields (for backward compatibility)
  if (cardsArray.length === 0) {
    if (formData.card1Title || formData.card2Title) {
      if (formData.card1Title) {
        cardsArray.push({
          title: formData.card1Title,
          buttonText: formData.card1ButtonText || '',
          buttonLink: formData.card1ButtonLink || ''
        });
      }
      if (formData.card2Title) {
        cardsArray.push({
          title: formData.card2Title,
          buttonText: formData.card2ButtonText || '',
          buttonLink: formData.card2ButtonLink || ''
        });
      }
    }
  }

  const updateCard = (index: number, field: string, value: string) => {
    const updated = [...cardsArray];
    if (!updated[index]) {
      updated[index] = { title: '', buttonText: '', buttonLink: '' };
    }
    updated[index][field] = value;
    handleInputChange('cards', JSON.stringify(updated));
  };

  const addCard = () => {
    const updated = [...cardsArray, { title: '', buttonText: '', buttonLink: '' }];
    handleInputChange('cards', JSON.stringify(updated));
  };

  const removeCard = (index: number) => {
    const updated = cardsArray.filter((_: any, i: number) => i !== index);
    handleInputChange('cards', JSON.stringify(updated));
  };

  return (
    <div className="space-y-6">
      <FormField
        label="Background Gradient From Color"
        name="bgGradientFrom"
        value={formData.bgGradientFrom || '#3b9dd6'}
        onChange={(value) => handleInputChange('bgGradientFrom', value)}
        error={errors.bgGradientFrom}
        helpText="Hex color for gradient start (e.g., #3b9dd6)"
      />

      <FormField
        label="Background Gradient To Color"
        name="bgGradientTo"
        value={formData.bgGradientTo || '#4db3e8'}
        onChange={(value) => handleInputChange('bgGradientTo', value)}
        error={errors.bgGradientTo}
        helpText="Hex color for gradient end (e.g., #4db3e8)"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          CTA Cards
        </label>
        <div className="space-y-3">
          {cardsArray.map((card: any, index: number) => (
            <div key={index} className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold text-gray-900">Card {index + 1}</h4>
                {cardsArray.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeCard(index)}
                    className="text-red-600 hover:bg-red-50 px-2 py-1 rounded transition-colors"
                    title="Remove card"
                  >
                    <i className="ri-delete-bin-line"></i>
                  </button>
                )}
              </div>
              
              <div className="space-y-3">
                <FormField
                  label="Title"
                  name={`card-${index}-title`}
                  value={card.title || ''}
                  onChange={(value) => updateCard(index, 'title', value)}
                  required
                />
                <FormField
                  label="Button Text"
                  name={`card-${index}-buttonText`}
                  value={card.buttonText || ''}
                  onChange={(value) => updateCard(index, 'buttonText', value)}
                  required
                />
                <FormField
                  label="Button Link"
                  name={`card-${index}-buttonLink`}
                  value={card.buttonLink || ''}
                  onChange={(value) => updateCard(index, 'buttonLink', value)}
                  required
                />
              </div>
            </div>
          ))}
          
          {cardsArray.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">No cards yet. Click "Add Card" to create one.</p>
          )}
          
          <button
            type="button"
            onClick={addCard}
            className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center gap-2"
          >
            <i className="ri-add-line"></i>
            Add Card
          </button>
        </div>
      </div>
    </div>
  );
};

