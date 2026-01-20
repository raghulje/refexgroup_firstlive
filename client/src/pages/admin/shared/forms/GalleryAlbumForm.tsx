import { useState, useEffect } from 'react';
import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';
import { galleryEventsService, galleryImagesService } from '../../../../services/apiService';
import { getAssetPath } from '../utils';

interface GalleryAlbumFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage: (file: File) => Promise<number | null>;
  uploadingImage: boolean;
  errors?: Record<string, string>;
  editingItem?: any; // Added to access album ID when editing
}

export const GalleryAlbumForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {},
  editingItem
}: GalleryAlbumFormProps) => {
  const [albumImages, setAlbumImages] = useState<any[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);

  // Fetch all images from all events in this album when editing
  useEffect(() => {
    const fetchAlbumImages = async () => {
      if (!editingItem?.id) {
        setAlbumImages([]);
        return;
      }

      setLoadingImages(true);
      try {
        // Get all events for this album
        const events = await galleryEventsService.getByAlbumId(editingItem.id, true);
        
        // Get all images from all events
        const allImages: any[] = [];
        for (const event of events) {
          try {
            const eventImages = await galleryImagesService.getByEventId(event.id, true);
            allImages.push(...eventImages);
          } catch (error) {
            console.error(`Error fetching images for event ${event.id}:`, error);
          }
        }
        
        setAlbumImages(allImages);
      } catch (error) {
        console.error('Error fetching album images:', error);
        setAlbumImages([]);
      } finally {
        setLoadingImages(false);
      }
    };

    fetchAlbumImages();
  }, [editingItem?.id]);

  return (
    <div className="space-y-4">
      <FormField
        label="Name"
        name="name"
        value={formData.name || ''}
        onChange={(value) => {
          handleInputChange('name', value);
          // Auto-generate slug from name if it's a year (e.g., "2026" -> "2026")
          // or if slug is empty and name looks like a year
          if (formData.albumType === 'year' && (!formData.slug || formData.slug === '')) {
            const yearMatch = value.match(/^\s*(\d{4})\s*$/);
            if (yearMatch) {
              handleInputChange('slug', yearMatch[1]);
            } else {
              // Generate slug from name (lowercase, replace spaces with hyphens)
              const slug = value.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
              handleInputChange('slug', slug);
            }
          }
        }}
        required
        error={errors.name}
        helpText={formData.albumType === 'year' ? "Enter the year (e.g., '2026')" : "Enter the album name"}
      />
      
      <FormField
        label="Slug"
        name="slug"
        value={formData.slug || ''}
        onChange={(value) => handleInputChange('slug', value)}
        required
        error={errors.slug}
        helpText={formData.albumType === 'year' ? "URL-friendly identifier (e.g., '2026')" : "URL-friendly identifier (e.g., 'annual-meet-2024')"}
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
      
      {/* Cover Image Section */}
      <div className="space-y-3 border-t border-gray-200 pt-4">
        <label className="text-sm font-medium text-gray-700">Cover Image</label>
        
        {/* Show uploaded images for selection if editing */}
        {editingItem?.id && albumImages.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2">Select from images in this album's events:</p>
            {loadingImages ? (
              <div className="text-center py-4 text-gray-500 text-sm">Loading images...</div>
            ) : (
              <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto p-2 border border-gray-200 rounded-lg bg-gray-50">
                {albumImages.map((img: any) => {
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
                          alt={img.title || 'Album image'}
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
            )}
          </div>
        )}

        {/* Upload new cover image */}
        <ImageUpload
          label={editingItem?.id && albumImages.length > 0 ? "Or upload a new cover image" : "Cover Image"}
          value={formData.coverImageId || formData.coverImage?.id || ''}
          onChange={(value) => handleInputChange('coverImageId', typeof value === 'number' ? value : null)}
          onUpload={uploadImage}
          uploading={uploadingImage}
          error={errors.coverImageId}
          fieldName="coverImageId"
        />
      </div>
      
      <FormField
        label="Album Type"
        name="albumType"
        type="select"
        value={formData.albumType || 'custom'}
        onChange={(value) => handleInputChange('albumType', value)}
        options={[
          { value: 'year', label: 'Year' },
          { value: 'month', label: 'Month' },
          { value: 'category', label: 'Category' },
          { value: 'custom', label: 'Custom' }
        ]}
        error={errors.albumType}
        helpText={formData.albumType === 'year' ? 'Year albums will be published as separate pages (e.g., /gallery-2026). Each year can only be used once.' : 'Select the type of album'}
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

