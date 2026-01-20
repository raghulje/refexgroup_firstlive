import { useState } from 'react';
import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';
import { ImagePositionControl } from '../ImagePositionControl';

interface GovernanceSectionFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage?: (file: File, pageName?: string, sectionName?: string) => Promise<number | null>;
  uploadingImage?: boolean;
  errors?: Record<string, string>;
  pageName?: string;
  sectionName?: string;
}

export const GovernanceSectionForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {},
  pageName = 'esg',
  sectionName = 'governance'
}: GovernanceSectionFormProps) => {
  // Parse core values from JSON or use empty array
  const [coreValues, setCoreValues] = useState(() => {
    try {
      if (Array.isArray(formData.coreValues)) {
        return formData.coreValues;
      }
      if (typeof formData.coreValues === 'string') {
        return JSON.parse(formData.coreValues);
      }
      return [];
    } catch {
      return [];
    }
  });

  const updateCoreValues = (index: number, field: string, value: string) => {
    const updated = [...coreValues];
    if (!updated[index]) {
      updated[index] = { letter: '', title: '', description: '', icon: '' };
    }
    updated[index][field] = value;
    // Auto-extract letter from title if letter is empty and title is provided
    if (field === 'title' && value && !updated[index].letter) {
      updated[index].letter = value.charAt(0).toUpperCase();
    }
    setCoreValues(updated);
    handleInputChange('coreValues', updated);
  };

  const addCoreValue = () => {
    const newValue = { letter: '', title: '', description: '', icon: '' };
    const updated = [...coreValues, newValue];
    setCoreValues(updated);
    handleInputChange('coreValues', updated);
  };

  const removeCoreValue = (index: number) => {
    const updated = coreValues.filter((_: any, i: number) => i !== index);
    setCoreValues(updated);
    handleInputChange('coreValues', updated);
  };

  return (
    <div className="space-y-6">
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
        value={formData.description || ''}
        onChange={(value) => handleInputChange('description', value)}
        error={errors.description}
      />

      {/* Quote Section */}
      <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quote</h3>
        <div className="space-y-4">
          <FormField
            label="Quote Text"
            name="quote"
            type="textarea"
            value={formData.quote || ''}
            onChange={(value) => handleInputChange('quote', value)}
            error={errors.quote}
          />
          <FormField
            label="Quote Author"
            name="quoteAuthor"
            value={formData.quoteAuthor || ''}
            onChange={(value) => handleInputChange('quoteAuthor', value)}
            error={errors.quoteAuthor}
          />
        </div>
      </div>

      {/* Mission Section */}
      <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Mission</h3>
        <div className="space-y-4">
          <FormField
            label="Mission Title"
            name="missionTitle"
            value={formData.missionTitle || ''}
            onChange={(value) => handleInputChange('missionTitle', value)}
            error={errors.missionTitle}
          />
          <FormField
            label="Mission Description"
            name="missionDescription"
            type="textarea"
            value={formData.missionDescription || ''}
            onChange={(value) => handleInputChange('missionDescription', value)}
            error={errors.missionDescription}
          />
        </div>
      </div>

      {/* Vision Section */}
      <div className="border-2 border-green-200 rounded-lg p-4 bg-green-50">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Vision</h3>
        <div className="space-y-4">
          <FormField
            label="Vision Title"
            name="visionTitle"
            value={formData.visionTitle || ''}
            onChange={(value) => handleInputChange('visionTitle', value)}
            error={errors.visionTitle}
          />
          <FormField
            label="Vision Description"
            name="visionDescription"
            type="textarea"
            value={formData.visionDescription || ''}
            onChange={(value) => handleInputChange('visionDescription', value)}
            error={errors.visionDescription}
          />
        </div>
      </div>

      {/* Core Values Section */}
      <div className="border-2 border-purple-200 rounded-lg p-4 bg-purple-50">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Core Values</h3>
          <button
            type="button"
            onClick={addCoreValue}
            className="px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm"
          >
            <i className="ri-add-line mr-1"></i>
            Add Core Value
          </button>
        </div>
        
        <FormField
          label="Core Values Heading"
          name="coreValuesHeading"
          value={formData.coreValuesHeading || ''}
          onChange={(value) => handleInputChange('coreValuesHeading', value)}
          error={errors.coreValuesHeading}
        />
        
        <FormField
          label="Core Values Subtitle"
          name="coreValuesSubtitle"
          value={formData.coreValuesSubtitle || ''}
          onChange={(value) => handleInputChange('coreValuesSubtitle', value)}
          error={errors.coreValuesSubtitle}
        />

        {uploadImage && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pattern Image (Background Overlay)
            </label>
            <ImageUpload
              label=""
              value={formData.patternImage || formData.patternImageId || ''}
              onChange={(mediaId: number | string) => handleInputChange('patternImage', mediaId)}
              onUpload={uploadImage}
              uploading={uploadingImage || false}
              pageName={pageName}
              sectionName={`${sectionName}-core-values`}
              allowUrl={true}
              error={errors.patternImage}
            />
            {errors.patternImage && (
              <p className="mt-1 text-sm text-red-600">{errors.patternImage}</p>
            )}
            
            {/* Pattern Image Position Control */}
            {(formData.patternImage || formData.patternImageId) && (
              <div className="mt-4">
                <ImagePositionControl
                  label="Pattern Image Position"
                  positionX={formData.patternPositionX || formData.patternImagePositionX || '50'}
                  positionY={formData.patternPositionY || formData.patternImagePositionY || '50'}
                  onChangeX={(value) => {
                    handleInputChange('patternPositionX', value);
                    handleInputChange('patternImagePositionX', value);
                  }}
                  onChangeY={(value) => {
                    handleInputChange('patternPositionY', value);
                    handleInputChange('patternImagePositionY', value);
                  }}
                  imageMediaId={formData.patternImage || formData.patternImageId}
                  helpText="Adjust X and Y position (0-100%) to control which part of the pattern image is visible"
                />
              </div>
            )}
          </div>
        )}

        <div className="space-y-4 mt-4">
          {coreValues.map((value: any, index: number) => (
            <div key={index} className="border border-gray-300 rounded-lg p-4 bg-white">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold text-gray-800">Core Value {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeCoreValue(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <i className="ri-delete-bin-line"></i>
                </button>
              </div>
              <div className="space-y-3">
                <FormField
                  label="Letter"
                  name={`coreValue${index}Letter`}
                  value={value.letter || ''}
                  onChange={(val) => updateCoreValues(index, 'letter', val)}
                  error={errors[`coreValue${index}Letter`]}
                  helpText="Single letter to display (e.g., P, A, C, E). Auto-filled from title if empty."
                />
                <FormField
                  label="Title"
                  name={`coreValue${index}Title`}
                  value={value.title || ''}
                  onChange={(val) => updateCoreValues(index, 'title', val)}
                  error={errors[`coreValue${index}Title`]}
                  required
                />
                <FormField
                  label="Description"
                  name={`coreValue${index}Description`}
                  type="textarea"
                  rows={3}
                  value={value.description || ''}
                  onChange={(val) => updateCoreValues(index, 'description', val)}
                  error={errors[`coreValue${index}Description`]}
                  required
                />
                {uploadImage && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Icon
                    </label>
                    <ImageUpload
                      label=""
                      value={value.icon || value.iconId || ''}
                      onChange={(mediaId: number | string) => updateCoreValues(index, 'icon', mediaId)}
                      onUpload={uploadImage}
                      uploading={uploadingImage || false}
                      fileType="icon"
                      pageName={pageName}
                      sectionName={`${sectionName}-core-values`}
                      allowUrl={true}
                      error={errors[`coreValue${index}Icon`]}
                    />
                    {errors[`coreValue${index}Icon`] && (
                      <p className="mt-1 text-sm text-red-600">{errors[`coreValue${index}Icon`]}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
          {coreValues.length === 0 && (
            <p className="text-gray-500 text-sm text-center py-4">No core values added yet. Click "Add Core Value" to add one.</p>
          )}
        </div>
      </div>
    </div>
  );
};

