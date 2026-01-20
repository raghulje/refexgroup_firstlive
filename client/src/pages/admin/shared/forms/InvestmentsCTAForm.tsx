import { FormField } from '../FormField';

interface InvestmentsCTAFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  errors?: Record<string, string>;
}

export const InvestmentsCTAForm = ({
  formData,
  handleInputChange,
  errors = {}
}: InvestmentsCTAFormProps) => {
  // Parse cards from JSON or use array
  const cardsArray = Array.isArray(formData.cards) 
    ? formData.cards 
    : (typeof formData.cards === 'string' ? JSON.parse(formData.cards || '[]') : []);

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
    <div className="space-y-4">
      <FormField
        label="Background Color"
        name="backgroundColor"
        type="color"
        value={formData.backgroundColor || '#3b9dd6'}
        onChange={(value) => handleInputChange('backgroundColor', value)}
        error={errors.backgroundColor}
        helpText="Background color for the CTA section (hex code)"
      />
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          CTA Cards
        </label>
        <div className="space-y-3">
          {cardsArray.map((card: any, index: number) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold text-gray-900">Card {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeCard(index)}
                  className="text-red-600 hover:bg-red-50 px-2 py-1 rounded transition-colors"
                  title="Remove card"
                >
                  <i className="ri-delete-bin-line"></i>
                </button>
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
          
          <button
            type="button"
            onClick={addCard}
            className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors"
          >
            <i className="ri-add-line mr-2"></i>
            Add Card
          </button>
        </div>
      </div>
    </div>
  );
};

