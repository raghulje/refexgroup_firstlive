import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';
import { useState, useEffect } from 'react';
import { galleryEventsService } from '../../../../services/apiService';

interface GalleryImageFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage: (file: File) => Promise<number | null>;
  uploadingImage: boolean;
  errors?: Record<string, string>;
}

export const GalleryImageForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {}
}: GalleryImageFormProps) => {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Try to get events - if we have an albumId, use it
        if (formData.albumId) {
          const data = await galleryEventsService.getByAlbumId(formData.albumId);
          setEvents(data);
        } else {
          // Otherwise, try to get all events (may need to fetch from all albums)
          setEvents([]);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        setEvents([]);
      }
    };
    fetchEvents();
  }, [formData.albumId]);

  return (
    <div className="space-y-4">
      <FormField
        label="Event"
        name="eventId"
        type="select"
        value={formData.eventId || ''}
        onChange={(value) => handleInputChange('eventId', parseInt(value))}
        required
        error={errors.eventId}
        options={[
          { value: '', label: 'Select an event' },
          ...events.map(event => ({ value: event.id.toString(), label: event.name || event.title || 'Untitled' }))
        ]}
      />
      
      <ImageUpload
        label="Image"
        value={formData.imageId || formData.image?.id || ''}
        onChange={(value) => handleInputChange('imageId', typeof value === 'number' ? value : null)}
        onUpload={uploadImage}
        uploading={uploadingImage}
        error={errors.imageId}
        fieldName="imageId"
      />
      
      <FormField
        label="Caption"
        name="caption"
        type="textarea"
        rows={3}
        value={formData.caption || ''}
        onChange={(value) => handleInputChange('caption', value)}
        error={errors.caption}
      />
      
      <FormField
        label="Order Index"
        name="orderIndex"
        type="number"
        value={formData.orderIndex || 0}
        onChange={(value) => handleInputChange('orderIndex', parseInt(value) || 0)}
        error={errors.orderIndex}
      />
      
      <FormField
        label="Active"
        name="isActive"
        type="checkbox"
        value={formData.isActive}
        onChange={(value) => handleInputChange('isActive', value)}
      />
    </div>
  );
};

