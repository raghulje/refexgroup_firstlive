import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';

interface MobilityAdvantagesSectionFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage?: (file: File) => Promise<number | null>;
  uploadingImage?: boolean;
  errors?: Record<string, string>;
}

export const MobilityAdvantagesSectionForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {}
}: MobilityAdvantagesSectionFormProps) => {
  const leftCards = Array.isArray(formData.leftCards)
    ? formData.leftCards
    : (formData.leftCards
      ? (() => {
        try {
          return JSON.parse(formData.leftCards);
        } catch {
          return [];
        }
      })()
      : []);

  const rightCards = Array.isArray(formData.rightCards)
    ? formData.rightCards
    : (formData.rightCards
      ? (() => {
        try {
          return JSON.parse(formData.rightCards);
        } catch {
          return [];
        }
      })()
      : []);

  const updateCard = (side: 'left' | 'right', index: number, field: string, value: any) => {
    const array = side === 'left' ? leftCards : rightCards;
    const updated = [...array];
    updated[index] = { ...updated[index], [field]: value };
    handleInputChange(side === 'left' ? 'leftCards' : 'rightCards', updated);
  };

  const addCard = (side: 'left' | 'right') => {
    const array = side === 'left' ? leftCards : rightCards;
    handleInputChange(side === 'left' ? 'leftCards' : 'rightCards', [...array, { title: '', description: '' }]);
  };

  const removeCard = (side: 'left' | 'right', index: number) => {
    const array = side === 'left' ? leftCards : rightCards;
    const updated = array.filter((_: any, i: number) => i !== index);
    handleInputChange(side === 'left' ? 'leftCards' : 'rightCards', updated);
  };

  return (
    <div className="space-y-4">
      <FormField
        label="Heading"
        name="heading"
        value={formData.heading || ''}
        onChange={(value) => handleInputChange('heading', value)}
        error={errors.heading}
      />

      <FormField
        label="Description"
        name="description"
        type="textarea"
        rows={3}
        value={formData.description || ''}
        onChange={(value) => handleInputChange('description', value)}
        error={errors.description}
      />

      {uploadImage && (
        <ImageUpload
          label="Advantages Image"
          value={formData.image || ''}
          onChange={(mediaId) => handleInputChange('image', mediaId)}
          onUpload={uploadImage}
          uploading={uploadingImage || false}
        />
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {/* Left Cards */}
        <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-gray-900">Left Side Cards</h4>
            <button
              type="button"
              onClick={() => addCard('left')}
              className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              <i className="ri-add-line"></i> Add
            </button>
          </div>
          <div className="space-y-3">
            {leftCards.length > 0 ? (
              leftCards.map((card: any, index: number) => (
                <div key={index} className="space-y-2 p-3 border border-gray-200 rounded-lg bg-white">
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-semibold text-gray-700">Card {index + 1}</p>
                    <button
                      type="button"
                      onClick={() => removeCard('left', index)}
                      className="px-2 py-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <i className="ri-delete-bin-line"></i>
                    </button>
                  </div>
                  <FormField
                    label="Title"
                    name={`left-card-${index}-title`}
                    value={card.title || ''}
                    onChange={(value) => updateCard('left', index, 'title', value)}
                    required
                  />
                  <FormField
                    label="Description"
                    name={`left-card-${index}-description`}
                    type="textarea"
                    rows={2}
                    value={card.description || ''}
                    onChange={(value) => updateCard('left', index, 'description', value)}
                    required
                  />
                  <FormField
                    label="Icon Class (Optional)"
                    name={`left-card-${index}-icon`}
                    value={typeof card.icon === 'string' ? card.icon : ''}
                    onChange={(value) => updateCard('left', index, 'icon', value)}
                    helpText="e.g., ri-shield-check-line"
                  />
                  {uploadImage && (
                    <ImageUpload
                      label="Icon Image (SVG/PNG)"
                      value={typeof card.icon === 'number' ? card.icon : ''}
                      onChange={(mediaId) => updateCard('left', index, 'icon', mediaId)}
                      onUpload={uploadImage}
                      uploading={uploadingImage || false}
                      fileType="image"
                    />
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-xs italic">No left cards added yet.</p>
            )}
          </div>
        </div>

        {/* Right Cards */}
        <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-gray-900">Right Side Cards</h4>
            <button
              type="button"
              onClick={() => addCard('right')}
              className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              <i className="ri-add-line"></i> Add
            </button>
          </div>
          <div className="space-y-3">
            {rightCards.length > 0 ? (
              rightCards.map((card: any, index: number) => (
                <div key={index} className="space-y-2 p-3 border border-gray-200 rounded-lg bg-white">
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-semibold text-gray-700">Card {index + 1}</p>
                    <button
                      type="button"
                      onClick={() => removeCard('right', index)}
                      className="px-2 py-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <i className="ri-delete-bin-line"></i>
                    </button>
                  </div>
                  <FormField
                    label="Title"
                    name={`right-card-${index}-title`}
                    value={card.title || ''}
                    onChange={(value) => updateCard('right', index, 'title', value)}
                    required
                  />
                  <FormField
                    label="Description"
                    name={`right-card-${index}-description`}
                    type="textarea"
                    rows={2}
                    value={card.description || ''}
                    onChange={(value) => updateCard('right', index, 'description', value)}
                    required
                  />
                  <FormField
                    label="Icon Class (Optional)"
                    name={`right-card-${index}-icon`}
                    value={typeof card.icon === 'string' ? card.icon : ''}
                    onChange={(value) => updateCard('right', index, 'icon', value)}
                    helpText="e.g., ri-shield-check-line"
                  />
                  {uploadImage && (
                    <ImageUpload
                      label="Icon Image (SVG/PNG)"
                      value={typeof card.icon === 'number' ? card.icon : ''}
                      onChange={(mediaId) => updateCard('right', index, 'icon', mediaId)}
                      onUpload={uploadImage}
                      uploading={uploadingImage || false}
                      fileType="image"
                    />
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-xs italic">No right cards added yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

