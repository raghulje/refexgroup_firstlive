import { useState } from 'react';
import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';

interface RefrigerantsWhyChooseUsSectionFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage?: (file: File) => Promise<number | null>;
  uploadingImage?: boolean;
  errors?: Record<string, string>;
}

export const RefrigerantsWhyChooseUsSectionForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {}
}: RefrigerantsWhyChooseUsSectionFormProps) => {
  // Parse cards data
  let cardsData: any[] = [];
  if (formData.cards) {
    if (Array.isArray(formData.cards)) {
      cardsData = formData.cards;
    } else if (typeof formData.cards === 'string') {
      try {
        cardsData = JSON.parse(formData.cards);
      } catch {
        cardsData = [];
      }
    }
  }

  const handleCardChange = (index: number, field: string, value: any) => {
    const updated = [...cardsData];
    if (!updated[index]) {
      updated[index] = { title: '', description: '', iconPath: null };
    }
    updated[index][field] = value;
    handleInputChange('cards', updated);
  };

  const addCard = () => {
    const updated = [...cardsData, { title: '', description: '', iconPath: null }];
    handleInputChange('cards', updated);
  };

  const removeCard = (index: number) => {
    const updated = cardsData.filter((_, i) => i !== index);
    handleInputChange('cards', updated);
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

      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Cards
          </label>
          <button
            type="button"
            onClick={addCard}
            className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors flex items-center gap-1"
          >
            <i className="ri-add-line"></i>
            Add Card
          </button>
        </div>

        {cardsData.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500 text-sm mb-2">No cards added yet</p>
            <button
              type="button"
              onClick={addCard}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Click to add your first card
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {cardsData.map((card: any, index: number) => (
              <div key={index} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-medium text-gray-700">Card {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeCard(index)}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    <i className="ri-delete-bin-line"></i> Remove
                  </button>
                </div>

                <div className="space-y-3">
                  <FormField
                    label="Title"
                    name={`card-${index}-title`}
                    value={card.title || ''}
                    onChange={(value) => handleCardChange(index, 'title', value)}
                    error={errors[`card-${index}-title`]}
                  />

                  <FormField
                    label="Description"
                    name={`card-${index}-description`}
                    type="textarea"
                    rows={3}
                    value={card.description || ''}
                    onChange={(value) => handleCardChange(index, 'description', value)}
                    error={errors[`card-${index}-description`]}
                  />

                  {uploadImage && (
                    <ImageUpload
                      key={`icon-${index}-${card.iconPath || 'empty'}`}
                      label="Icon Image (Optional)"
                      value={card.iconPath || ''}
                      onChange={(mediaId) => handleCardChange(index, 'iconPath', mediaId)}
                      onUpload={uploadImage}
                      uploading={uploadingImage || false}
                      pageName="general"
                      sectionName="general"
                      allowUrl={true}
                      fileType="icon"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

