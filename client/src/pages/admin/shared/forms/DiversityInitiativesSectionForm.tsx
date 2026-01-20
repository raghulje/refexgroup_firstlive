import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';
import { useState } from 'react';
import { getAssetPath } from '../utils';
import { getApiBaseUrl } from '../../../../config/env';

interface DiversityInitiativesSectionFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage?: (file: File) => Promise<number | null>;
  uploadingImage?: boolean;
  errors?: Record<string, string>;
}

export const DiversityInitiativesSectionForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {}
}: DiversityInitiativesSectionFormProps) => {
  // Parse JSON data
  const sliderImages = Array.isArray(formData.sliderImages) 
    ? formData.sliderImages 
    : (typeof formData.sliderImages === 'string' ? JSON.parse(formData.sliderImages || '[]') : []);

  // Parse initiatives - support both old format and new format
  let initiatives: any[] = [];
  if (formData.initiatives) {
    if (Array.isArray(formData.initiatives)) {
      initiatives = formData.initiatives;
    } else if (typeof formData.initiatives === 'string') {
      try {
        initiatives = JSON.parse(formData.initiatives || '[]');
      } catch {
        initiatives = [];
      }
    }
  }
  
  // If no initiatives array, try to convert from old format (vamika/kravMaga)
  if (initiatives.length === 0) {
    if (formData.vamika || formData.kravMaga) {
      if (formData.vamika) {
        const vamika = typeof formData.vamika === 'string' ? JSON.parse(formData.vamika || '{}') : formData.vamika;
        initiatives.push({
          name: 'Vamika',
          logo: vamika.logo || '',
          description: vamika.description || '',
          images: vamika.images || [],
          coverImage: vamika.coverImage || '',
          orderIndex: 0
        });
      }
      if (formData.kravMaga) {
        const kravMaga = typeof formData.kravMaga === 'string' ? JSON.parse(formData.kravMaga || '{}') : formData.kravMaga;
        initiatives.push({
          name: 'Krav Maga',
          logo: kravMaga.logo || '',
          description: kravMaga.description || '',
          images: kravMaga.images || [],
          coverImage: kravMaga.coverImage || '',
          orderIndex: 1
        });
      }
    }
  }

  // Sort by orderIndex
  initiatives.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));

  const updateInitiatives = (updated: any[]) => {
    handleInputChange('initiatives', JSON.stringify(updated));
  };

  const updateInitiative = (index: number, field: string, value: any) => {
    const updated = [...initiatives];
    if (!updated[index]) {
      updated[index] = { name: '', logo: '', description: '', images: [], coverImage: '', orderIndex: index };
    }
    updated[index][field] = value;
    updateInitiatives(updated);
  };

  const addInitiative = () => {
    const newInitiative = {
      name: '',
      logo: '',
      description: '',
      images: [],
      coverImage: '',
      orderIndex: initiatives.length
    };
    updateInitiatives([...initiatives, newInitiative]);
  };

  const removeInitiative = (index: number) => {
    const updated = initiatives.filter((_: any, i: number) => i !== index);
    // Reorder remaining initiatives
    updated.forEach((init, i) => {
      init.orderIndex = i;
    });
    updateInitiatives(updated);
  };

  const moveInitiative = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === initiatives.length - 1) return;
    
    const updated = [...initiatives];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    // Update orderIndex
    updated.forEach((init, i) => {
      init.orderIndex = i;
    });
    updateInitiatives(updated);
  };

  const updateInitiativeImages = (initiativeIndex: number, images: any[]) => {
    updateInitiative(initiativeIndex, 'images', images);
  };

  const addInitiativeImage = (initiativeIndex: number, imagePath: string) => {
    const initiative = initiatives[initiativeIndex];
    const updatedImages = [...(initiative.images || []), imagePath];
    updateInitiativeImages(initiativeIndex, updatedImages);
  };

  const removeInitiativeImage = (initiativeIndex: number, imageIndex: number) => {
    const initiative = initiatives[initiativeIndex];
    const updatedImages = (initiative.images || []).filter((_: any, i: number) => i !== imageIndex);
    updateInitiativeImages(initiativeIndex, updatedImages);
  };

  const setCoverImage = (initiativeIndex: number, imagePath: string) => {
    updateInitiative(initiativeIndex, 'coverImage', imagePath);
  };

  const handleBulkImageUpload = async (initiativeIndex: number, files: FileList | null) => {
    if (!files || !uploadImage) return;
    
    const fileArray = Array.from(files);
    const uploadedPaths: string[] = [];
    
    for (const file of fileArray) {
      try {
        const mediaId = await uploadImage(file);
        if (mediaId) {
          // Fetch the media record to get the filePath
          try {
            const { mediaService } = await import('../../../../services/apiService');
            const media = await mediaService.getById(mediaId);
            if (media?.filePath) {
              uploadedPaths.push(media.filePath);
            } else {
              console.warn('Media record found but no filePath:', media);
            }
          } catch (fetchError) {
            console.error('Error fetching media record:', fetchError);
            // Fallback: try to construct path (not ideal but better than nothing)
            uploadedPaths.push(`/uploads/diversity-inclusion/initiatives/${file.name}`);
          }
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
    
    if (uploadedPaths.length > 0) {
      const initiative = initiatives[initiativeIndex];
      const updatedImages = [...(initiative.images || []), ...uploadedPaths];
      updateInitiativeImages(initiativeIndex, updatedImages);
    }
  };

  // Get all images from all initiatives for slider selection
  const getAllInitiativeImages = (): string[] => {
    const allImages: string[] = [];
    initiatives.forEach((init) => {
      if (init.images && Array.isArray(init.images)) {
        allImages.push(...init.images);
      }
    });
    return allImages;
  };

  const updateSliderImages = (index: number, value: string | number) => {
    const updated = [...sliderImages];
    updated[index] = value;
    handleInputChange('sliderImages', JSON.stringify(updated));
  };

  const addSliderImage = (imagePath?: string) => {
    const updated = [...sliderImages, imagePath || ''];
    handleInputChange('sliderImages', JSON.stringify(updated));
  };

  const removeSliderImage = (index: number) => {
    const updated = sliderImages.filter((_: any, i: number) => i !== index);
    handleInputChange('sliderImages', JSON.stringify(updated));
  };

  const moveSliderImage = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === sliderImages.length - 1) return;
    
    const updated = [...sliderImages];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    handleInputChange('sliderImages', JSON.stringify(updated));
  };

  return (
    <div className="space-y-6">
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
        rows={3}
        value={formData.description || ''}
        onChange={(value) => handleInputChange('description', value)}
        error={errors.description}
      />

      {/* Slider Images Section */}
      <div className="border-2 border-purple-200 rounded-lg p-4 bg-purple-50">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Slider Images</h3>
        <p className="text-sm text-gray-600 mb-4">Select images from initiatives to display in the slider. You can reorder them.</p>
        
        <div className="space-y-4">
          {sliderImages.map((img: string | number, index: number) => (
            <div key={index} className="bg-white p-4 rounded border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Image {index + 1}</span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => moveSliderImage(index, 'up')}
                    disabled={index === 0}
                    className="text-blue-600 hover:bg-blue-50 px-2 py-1 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Move up"
                  >
                    <i className="ri-arrow-up-line"></i>
                  </button>
                  <button
                    type="button"
                    onClick={() => moveSliderImage(index, 'down')}
                    disabled={index === sliderImages.length - 1}
                    className="text-blue-600 hover:bg-blue-50 px-2 py-1 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Move down"
                  >
                    <i className="ri-arrow-down-line"></i>
                  </button>
                  <button
                    type="button"
                    onClick={() => removeSliderImage(index)}
                    className="text-red-600 hover:bg-red-50 px-2 py-1 rounded transition-colors"
                    title="Remove"
                  >
                    <i className="ri-delete-bin-line"></i>
                  </button>
                </div>
              </div>
              {uploadImage ? (
                <ImageUpload
                  label=""
                  value={img}
                  onChange={(value) => updateSliderImages(index, value)}
                  onUpload={uploadImage}
                  uploading={uploadingImage || false}
                  pageName="diversity-inclusion"
                  sectionName="initiatives"
                  allowUrl={true}
                  fileType="image"
                />
              ) : (
                <input
                  type="text"
                  value={typeof img === 'string' ? img : ''}
                  onChange={(e) => updateSliderImages(index, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Image URL or path"
                />
              )}
            </div>
          ))}
          
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => addSliderImage()}
              className="px-4 py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:border-gray-400 transition-colors"
            >
              <i className="ri-add-line mr-2"></i>
              Add Slider Image
            </button>
            {/* Quick add from initiatives */}
            <select
              onChange={(e) => {
                if (e.target.value) {
                  addSliderImage(e.target.value);
                  e.target.value = '';
                }
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white"
            >
              <option value="">Quick Add from Initiatives</option>
              {getAllInitiativeImages().map((img, idx) => (
                <option key={idx} value={img}>{img.split('/').pop()}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Initiatives Section */}
      <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Initiatives</h3>
          <button
            type="button"
            onClick={addInitiative}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <i className="ri-add-line"></i>
            Add Initiative
          </button>
        </div>

        <div className="space-y-4">
          {initiatives.map((initiative, index) => (
            <div key={index} className="bg-white rounded-lg p-4 border-2 border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold text-gray-900">
                  Initiative {index + 1}: {initiative.name || 'Unnamed Initiative'}
                </h4>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => moveInitiative(index, 'up')}
                    disabled={index === 0}
                    className="text-blue-600 hover:bg-blue-50 px-2 py-1 rounded transition-colors disabled:opacity-50"
                    title="Move up"
                  >
                    <i className="ri-arrow-up-line"></i>
                  </button>
                  <button
                    type="button"
                    onClick={() => moveInitiative(index, 'down')}
                    disabled={index === initiatives.length - 1}
                    className="text-blue-600 hover:bg-blue-50 px-2 py-1 rounded transition-colors disabled:opacity-50"
                    title="Move down"
                  >
                    <i className="ri-arrow-down-line"></i>
                  </button>
                  <button
                    type="button"
                    onClick={() => removeInitiative(index)}
                    className="text-red-600 hover:bg-red-50 px-2 py-1 rounded transition-colors"
                    title="Remove initiative"
                  >
                    <i className="ri-delete-bin-line"></i>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <FormField
                  label="Name"
                  name={`initiative-${index}-name`}
                  value={initiative.name || ''}
                  onChange={(value) => updateInitiative(index, 'name', value)}
                  required
                />

                <ImageUpload
                  label="Logo"
                  value={initiative.logo || ''}
                  onChange={(value) => updateInitiative(index, 'logo', value)}
                  onUpload={uploadImage}
                  uploading={uploadingImage || false}
                  pageName="diversity-inclusion"
                  sectionName="initiatives"
                  allowUrl={true}
                />

                <FormField
                  label="Description"
                  name={`initiative-${index}-description`}
                  type="textarea"
                  rows={3}
                  value={initiative.description || ''}
                  onChange={(value) => updateInitiative(index, 'description', value)}
                />

                {/* Images Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Images
                  </label>
                  
                  {/* Bulk Upload */}
                  <div className="mb-3">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleBulkImageUpload(index, e.target.files)}
                      className="hidden"
                      id={`bulk-upload-${index}`}
                    />
                    <label
                      htmlFor={`bulk-upload-${index}`}
                      className="inline-block px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors cursor-pointer"
                    >
                      <i className="ri-upload-cloud-line mr-2"></i>
                      Bulk Upload Images
                    </label>
                  </div>

                  {/* Images Grid - Visual Only */}
                  <div className="grid grid-cols-4 gap-3">
                    {(initiative.images || []).map((img: any, imgIndex: number) => {
                      // Resolve image URL - handle media IDs, paths, and URLs
                      let imgUrl = '';
                      if (typeof img === 'number') {
                        // Media ID - will be resolved by getAssetPath if it's a path
                        imgUrl = getAssetPath(`/uploads/media/${img}`);
                      } else if (typeof img === 'string') {
                        if (img.startsWith('/uploads/')) {
                          imgUrl = getAssetPath(img);
                        } else if (img.startsWith('http://') || img.startsWith('https://')) {
                          imgUrl = img;
                        } else {
                          imgUrl = getAssetPath(img);
                        }
                      } else if (img?.filePath) {
                        imgUrl = getAssetPath(img.filePath);
                      } else if (img?.url) {
                        imgUrl = img.url;
                      }
                      
                      const isCover = initiative.coverImage === img || 
                                     (typeof initiative.coverImage === 'string' && typeof img === 'string' && initiative.coverImage === img) ||
                                     (typeof initiative.coverImage === 'number' && typeof img === 'number' && initiative.coverImage === img);
                      
                      return (
                        <div key={imgIndex} className="relative group">
                          {/* Order Badge */}
                          <div className="absolute top-2 left-2 z-10 bg-black/70 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                            {imgIndex + 1}
                          </div>
                          
                          {/* Cover Image Badge */}
                          {isCover && (
                            <div className="absolute top-2 right-2 z-10 bg-green-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                              <i className="ri-image-line text-xs"></i>
                            </div>
                          )}
                          
                          {/* Image */}
                          <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-400 transition-colors">
                            <img 
                              src={imgUrl} 
                              alt={`Image ${imgIndex + 1}`} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%23ddd"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy=".3em" fill="%23999"%3EImage%3C/text%3E%3C/svg%3E';
                              }}
                            />
                          </div>
                          
                          {/* Action Buttons - Show on Hover */}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => setCoverImage(index, img)}
                              className={`p-2 rounded-full transition-colors ${
                                isCover
                                  ? 'bg-green-600 text-white'
                                  : 'bg-white text-gray-700 hover:bg-green-50'
                              }`}
                              title={isCover ? "Cover Image" : "Set as cover image"}
                            >
                              <i className={`ri-image-${isCover ? 'fill' : 'line'}`}></i>
                            </button>
                            <button
                              type="button"
                              onClick={() => removeInitiativeImage(index, imgIndex)}
                              className="p-2 bg-white text-red-600 rounded-full hover:bg-red-50 transition-colors"
                              title="Remove image"
                            >
                              <i className="ri-delete-bin-line"></i>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                    
                    {/* Add Image Button */}
                    <div className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors flex items-center justify-center cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file && uploadImage) {
                            try {
                              const mediaId = await uploadImage(file);
                              if (mediaId) {
                                try {
                                  const { mediaService } = await import('../../../../services/apiService');
                                  const media = await mediaService.getById(mediaId);
                                  if (media?.filePath) {
                                    addInitiativeImage(index, media.filePath);
                                  }
                                } catch (fetchError) {
                                  console.error('Error fetching media:', fetchError);
                                }
                              }
                            } catch (error) {
                              console.error('Error uploading image:', error);
                            }
                          }
                          // Reset input
                          e.target.value = '';
                        }}
                        className="hidden"
                        id={`add-image-${index}`}
                      />
                      <label
                        htmlFor={`add-image-${index}`}
                        className="w-full h-full flex items-center justify-center cursor-pointer"
                      >
                        <i className="ri-add-line text-2xl text-gray-400"></i>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {initiatives.length === 0 && (
            <p className="text-center text-gray-500 py-8">No initiatives yet. Click "Add Initiative" to create one.</p>
          )}
        </div>
      </div>
    </div>
  );
};
