import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';

interface AirportsTransportSectionFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage?: (file: File) => Promise<number | null>;
  uploadingImage?: boolean;
  errors?: Record<string, string>;
}

export const AirportsTransportSectionForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {}
}: AirportsTransportSectionFormProps) => {
  const cards = Array.isArray(formData.cards)
    ? formData.cards
    : (formData.cards
      ? (() => {
        try {
          return JSON.parse(formData.cards);
        } catch {
          return [];
        }
      })()
      : [
        { title: '' },
        { title: '' }
      ]);

  const updateCard = (index: number, field: string, value: string) => {
    const updated = [...cards];
    updated[index] = { ...updated[index], [field]: value };
    handleInputChange('cards', updated);
  };

  const addCard = () => {
    handleInputChange('cards', [...cards, { title: '' }]);
  };

  const removeCard = (index: number) => {
    const updated = cards.filter((_: any, i: number) => i !== index);
    handleInputChange('cards', updated);
  };

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
        label="Description"
        name="description"
        type="textarea"
        rows={4}
        value={formData.description || ''}
        onChange={(value) => handleInputChange('description', value)}
        error={errors.description}
      />

      {uploadImage && (
        <ImageUpload
          label="Main Image"
          value={formData.image || ''}
          onChange={(mediaId) => handleInputChange('image', mediaId)}
          onUpload={uploadImage}
          uploading={uploadingImage || false}
        />
      )}

      <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-semibold text-gray-900">Transportation Cards</h4>
          <button
            type="button"
            onClick={addCard}
            className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            <i className="ri-add-line"></i> Add Card
          </button>
        </div>
        <div className="space-y-3">
          {cards.length > 0 ? (
            cards.map((card: any, index: number) => (
              <div
                key={index}
                className="space-y-2 p-4 border border-gray-200 rounded-lg bg-white"
              >
                <div className="flex justify-between items-center">
                  <p className="text-sm font-semibold text-gray-700">
                    Card {index + 1}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeCard(index)}
                    className="px-2 py-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Remove card"
                  >
                    <i className="ri-delete-bin-line"></i>
                  </button>
                </div>
                <FormField
                  label="Title"
                  name={`card-${index}-title`}
                  value={card.title || ''}
                  onChange={(value) => updateCard(index, 'title', value)}
                  required
                  error={errors[`cards[${index}].title`]}
                />
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm italic">
              No cards added yet. Click "Add Card" to add transportation initiatives.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};


