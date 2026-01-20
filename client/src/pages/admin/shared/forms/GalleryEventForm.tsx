import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';
import { useState, useEffect } from 'react';
import { galleryAlbumsService, galleryImagesService } from '../../../../services/apiService';
import { getAssetPath } from '../utils';

interface GalleryEventFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImageUtil?: (file: File) => Promise<number | null>;
  uploadingImage?: boolean;
  errors?: Record<string, string>;
  editingItem?: any; // Event being edited
}

export const GalleryEventForm = ({
  formData,
  handleInputChange,
  uploadImageUtil,
  uploadingImage = false,
  errors = {},
  editingItem
}: GalleryEventFormProps) => {
  const [albums, setAlbums] = useState<any[]>([]);
  const [eventImages, setEventImages] = useState<any[]>([]);
  const [bulkUploading, setBulkUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ uploaded: number; total: number }>({ uploaded: 0, total: 0 });

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const data = await galleryAlbumsService.getAll();
        setAlbums(data);
      } catch (error) {
        console.error('Error fetching albums:', error);
      }
    };
    fetchAlbums();
  }, []);

  // Fetch images for this event when editing
  useEffect(() => {
    const fetchEventImages = async () => {
      if (editingItem?.id) {
        try {
          const images = await galleryImagesService.getByEventId(editingItem.id, true);
          setEventImages(images || []);
        } catch (error) {
          console.error('Error fetching event images:', error);
          setEventImages([]);
        }
      } else {
        setEventImages([]);
      }
    };
    fetchEventImages();
  }, [editingItem?.id]);

  return (
    <div className="space-y-4">
      <FormField
        label="Album"
        name="albumId"
        type="select"
        value={formData.albumId || ''}
        onChange={(value) => handleInputChange('albumId', parseInt(value))}
        required
        error={errors.albumId}
        options={[
          { value: '', label: 'Select an album' },
          ...albums.map(album => ({ value: album.id.toString(), label: album.name || album.title || 'Untitled' }))
        ]}
      />
      
      <FormField
        label="Name"
        name="name"
        value={formData.name || ''}
        onChange={(value) => handleInputChange('name', value)}
        required
        error={errors.name}
      />
      
      <FormField
        label="Slug"
        name="slug"
        value={formData.slug || ''}
        onChange={(value) => handleInputChange('slug', value)}
        required
        error={errors.slug}
        helpText="URL-friendly identifier"
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
      
      <FormField
        label="Event Date"
        name="eventDate"
        type="date"
        value={formData.eventDate ? formData.eventDate.split('T')[0] : ''}
        onChange={(value) => handleInputChange('eventDate', value)}
        error={errors.eventDate}
      />
      
      <FormField
        label="Location"
        name="location"
        value={formData.location || ''}
        onChange={(value) => handleInputChange('location', value)}
        error={errors.location}
      />
      
      {/* Bulk Upload Section - Only show when editing an existing event */}
      {editingItem?.id && uploadImageUtil && (
        <div className="space-y-3 border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Bulk Upload Images</label>
            {bulkUploading && (
              <span className="text-xs text-gray-500">
                Uploading {uploadProgress.uploaded} of {uploadProgress.total}...
              </span>
            )}
          </div>
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <i className="ri-upload-cloud-2-line text-3xl text-gray-400 mb-2"></i>
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">Multiple images (max 200MB each)</p>
            </div>
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              disabled={bulkUploading}
              onChange={async (e) => {
                if (!e.target.files || e.target.files.length === 0) return;
                if (!editingItem?.id) return;

                const files = Array.from(e.target.files);
                setBulkUploading(true);
                setUploadProgress({ uploaded: 0, total: files.length });

                try {
                  const uploadPromises = files.map(async (file, index) => {
                    try {
                    const imageId = await uploadImageUtil(file);
                      if (!imageId || (typeof imageId === 'number' && imageId <= 0)) {
                        console.error(`Failed to upload image ${file.name}: invalid imageId`, imageId);
                        throw new Error(`Failed to upload ${file.name}: Invalid image ID`);
                      }
                      
                      console.log(`Creating gallery image for file ${file.name} with imageId:`, imageId);
                      const result = await galleryImagesService.create({
                        eventId: editingItem.id,
                        title: file.name.replace(/\.[^/.]+$/, ''),
                        imageId: typeof imageId === 'number' ? imageId : parseInt(imageId),
                        orderIndex: eventImages.length + index,
                        isActive: true
                      });
                      console.log(`Successfully created gallery image:`, result);
                      setUploadProgress(prev => ({ ...prev, uploaded: prev.uploaded + 1 }));
                      return result;
                    } catch (fileError: any) {
                      console.error(`Error uploading file ${file.name}:`, fileError);
                      throw new Error(`Failed to upload ${file.name}: ${fileError.message || 'Unknown error'}`);
                    }
                  });

                  await Promise.all(uploadPromises);
                  
                  // Refresh event images
                  const updatedImages = await galleryImagesService.getByEventId(editingItem.id, true);
                  setEventImages(updatedImages || []);
                  
                  // Clear file input
                  e.target.value = '';
                  
                  alert(`Successfully uploaded ${files.length} image(s)`);
                } catch (error: any) {
                  console.error('Bulk upload error:', error);
                  const errorMessage = error.response?.data?.message || error.message || 'Failed to upload some images';
                  alert(errorMessage);
                } finally {
                  setBulkUploading(false);
                  setUploadProgress({ uploaded: 0, total: 0 });
                }
              }}
            />
          </label>
        </div>
      )}

      {/* Cover Image Section */}
      <div className="space-y-3 border-t border-gray-200 pt-4">
        <label className="text-sm font-medium text-gray-700">Cover Image</label>
        
        {/* Show uploaded images for selection if editing */}
        {editingItem?.id && eventImages.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2">Select from uploaded images:</p>
            <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto p-2 border border-gray-200 rounded-lg bg-gray-50">
              {eventImages.map((img: any) => {
                const imagePath = img.image?.filePath || img.image?.url || '';
                const isSelected = formData.coverImageId === img.imageId;
                return (
                  <div
                    key={img.id}
                    onClick={() => handleInputChange('coverImageId', img.imageId)}
                    className={`relative cursor-pointer border-2 rounded-lg overflow-hidden transition-all ${
                      isSelected ? 'border-blue-600 ring-2 ring-blue-300' : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {imagePath ? (
                      <img
                        src={getAssetPath(imagePath)}
                        alt={img.title || 'Event image'}
                        className="w-full h-20 object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect fill="%23ddd" width="80" height="80"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="10"%3ENo Image%3C/text%3E%3C/svg%3E';
                        }}
                      />
                    ) : (
                      <div className="w-full h-20 bg-gray-200 flex items-center justify-center">
                        <i className="ri-image-line text-gray-400"></i>
                      </div>
                    )}
                    {isSelected && (
                      <div className="absolute top-1 right-1 bg-blue-600 rounded-full p-1">
                        <i className="ri-check-line text-white text-xs"></i>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Upload new cover image */}
        {uploadImageUtil && (
          <ImageUpload
            label={editingItem?.id && eventImages.length > 0 ? "Or upload a new cover image" : "Cover Image"}
            value={formData.coverImageId || formData.coverImage?.id || ''}
            onChange={(value) => handleInputChange('coverImageId', typeof value === 'number' ? value : null)}
            onUpload={uploadImageUtil}
            uploading={uploadingImage}
            error={errors.coverImageId}
            fieldName="coverImageId"
          />
        )}
      </div>
      
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

