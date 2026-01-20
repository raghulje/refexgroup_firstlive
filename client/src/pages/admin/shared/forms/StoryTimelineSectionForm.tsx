import { useState, useEffect } from 'react';
import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';
import { ImagePositionControl } from '../ImagePositionControl';

interface StoryTimelineSectionFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage: (file: File) => Promise<string | null>;
  uploadingImage: boolean;
  errors?: Record<string, string>;
}

export const StoryTimelineSectionForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {}
}: StoryTimelineSectionFormProps) => {
  // Parse timeline data
  let timelineData: any[] = [];
  if (formData.timeline) {
    if (Array.isArray(formData.timeline)) {
      timelineData = formData.timeline;
    } else if (typeof formData.timeline === 'string') {
      try {
        timelineData = JSON.parse(formData.timeline);
      } catch {
        timelineData = [];
      }
    }
  }

  const handleTimelineItemChange = (index: number, field: string, value: any) => {
    const updated = [...timelineData];
    if (!updated[index]) {
      updated[index] = { year: '', title: '', description: '' };
    }
    updated[index][field] = value;
    handleInputChange('timeline', JSON.stringify(updated));
  };

  const addTimelineItem = () => {
    const updated = [...timelineData, { year: '', title: '', description: '' }];
    handleInputChange('timeline', JSON.stringify(updated));
  };

  const removeTimelineItem = (index: number) => {
    const updated = timelineData.filter((_, i) => i !== index);
    handleInputChange('timeline', JSON.stringify(updated));
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
        rows={4}
        value={formData.description || ''}
        onChange={(value) => handleInputChange('description', value)}
        error={errors.description}
      />

      {/* Timeline Items */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Timeline Items
        </label>
        <div className="space-y-4">
          {timelineData.map((item: any, index: number) => (
            <div key={index} className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold text-gray-700">Timeline Item {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeTimelineItem(index)}
                  className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-md transition-colors text-sm"
                >
                  <i className="ri-delete-bin-line"></i> Remove
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  label="Year"
                  name={`timeline-${index}-year`}
                  value={item.year || ''}
                  onChange={(value) => handleTimelineItemChange(index, 'year', value)}
                  error={errors[`timeline-${index}-year`]}
                />
                <FormField
                  label="Title"
                  name={`timeline-${index}-title`}
                  value={item.title || ''}
                  onChange={(value) => handleTimelineItemChange(index, 'title', value)}
                  error={errors[`timeline-${index}-title`]}
                />
                <FormField
                  label="Description"
                  name={`timeline-${index}-description`}
                  type="textarea"
                  value={item.description || ''}
                  onChange={(value) => handleTimelineItemChange(index, 'description', value)}
                  error={errors[`timeline-${index}-description`]}
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addTimelineItem}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            <i className="ri-add-line"></i>
            Add Timeline Item
          </button>
        </div>
      </div>

      {/* Timeline Image */}
      {uploadImage && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Timeline Image
          </label>
          <ImageUpload
            label=""
            value={formData.timelineImage || formData.timelineImageId || ''}
            onChange={(mediaId) => handleInputChange('timelineImage', mediaId)}
            onUpload={uploadImage}
            uploading={uploadingImage}
            error={errors.timelineImage}
          />
          {errors.timelineImage && (
            <p className="mt-1 text-sm text-red-600">{errors.timelineImage}</p>
          )}
          
          {/* Image Position Control */}
          {(formData.timelineImage || formData.timelineImageId) && (
            <div className="mt-4">
              <ImagePositionControl
                label="Timeline Image Position"
                positionX={formData.timelinePositionX}
                positionY={formData.timelinePositionY}
                onChangeX={(value) => handleInputChange('timelinePositionX', value)}
                onChangeY={(value) => handleInputChange('timelinePositionY', value)}
                imageMediaId={formData.timelineImage || formData.timelineImageId}
                helpText="Adjust X and Y position (0-100%) to control which part of the image is visible"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

