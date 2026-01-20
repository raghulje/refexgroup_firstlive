import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from '../../shared/DataTable';
import { getAssetPath } from '../../shared/utils';
import type { CMSComponentProps } from '../../shared/types';
import { galleryAlbumsService, galleryEventsService, galleryImagesService, pagesService, sectionsService } from '../../../../services/apiService';
import { GalleryAlbumForm } from '../../shared/forms/GalleryAlbumForm';
import { GalleryEventForm } from '../../shared/forms/GalleryEventForm';
import { GalleryImageForm } from '../../shared/forms/GalleryImageForm';
import { GalleryHeroSectionForm, GalleryWelcomeSectionForm, GalleryCTASectionForm } from '../../shared/forms';
import { NotificationToast, useNotification } from '../../shared/NotificationToast';
import { LoadingSkeleton } from '../../shared/LoadingSkeleton';
import { ImageUpload } from '../../shared/ImageUpload';

interface GalleryProps extends Partial<CMSComponentProps> {
  token: string;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  modalType: 'add' | 'edit';
  setModalType: (type: 'add' | 'edit') => void;
  editingItem: any;
  setEditingItem: (item: any) => void;
  formData: any;
  setFormData: (data: any) => void;
  handleInputChange: (key: string, value: any) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleDelete: (item: any, entityType?: string) => void;
  uploadImageUtil: (file: File) => Promise<number | null>;
  uploadingImage: boolean;
  setUploadingImage: (uploading: boolean) => void;
  setCurrentEntityType: (type: string) => void;
}

type ViewMode = 'albums' | 'events' | 'images';
type SelectedAlbum = number | null;
type SelectedEvent = number | null;
type MainTab = 'sections' | 'galleries';

export default function Gallery_cms({
  token,
  showModal,
  setShowModal,
  modalType,
  setModalType,
  editingItem,
  setEditingItem,
  formData,
  setFormData,
  handleInputChange,
  handleSubmit,
  handleDelete,
  uploadImageUtil,
  uploadingImage,
  setUploadingImage,
  setCurrentEntityType
}: GalleryProps) {
  const [mainTab, setMainTab] = useState<MainTab>('sections');
  const [viewMode, setViewMode] = useState<ViewMode>('albums');
  const [selectedAlbum, setSelectedAlbum] = useState<SelectedAlbum>(null);
  const [selectedEvent, setSelectedEvent] = useState<SelectedEvent>(null);
  const [albums, setAlbums] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [bulkUploading, setBulkUploading] = useState(false);
  const [currentEntityType, setCurrentEntityTypeLocal] = useState<string>('');
  const { notification, showNotification, hideNotification } = useNotification();
  const bulkUploadInputRef = useRef<HTMLInputElement>(null);
  const [draggedImage, setDraggedImage] = useState<number | null>(null);
  const [reordering, setReordering] = useState(false);
  const [selectedImages, setSelectedImages] = useState<Set<number>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);
  const [coverImageModal, setCoverImageModal] = useState<{ event: any; images: any[] } | null>(null);
  
  // Section management state
  const [galleryPage, setGalleryPage] = useState<any>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    if (mainTab === 'galleries') {
      fetchGalleryData();
    } else {
      fetchGalleryPageData();
    }
  }, [mainTab]);
  
  useEffect(() => {
    const handleRefresh = () => {
      if (mainTab === 'sections') {
        fetchGalleryPageData();
      } else {
        fetchGalleryData();
        // If viewing events, refresh events list
        if (viewMode === 'events' && selectedAlbum) {
          fetchEvents(selectedAlbum);
        }
        // If viewing images, refresh images list
        if (viewMode === 'images' && selectedEvent) {
          fetchImages(selectedEvent);
        }
      }
    };
    window.addEventListener('cms-refresh', handleRefresh);
    return () => window.removeEventListener('cms-refresh', handleRefresh);
  }, [mainTab, viewMode, selectedAlbum, selectedEvent]);

  useEffect(() => {
    if (selectedAlbum && viewMode === 'events') {
      fetchEvents(selectedAlbum);
    }
  }, [selectedAlbum, viewMode]);

  useEffect(() => {
    if (selectedEvent && viewMode === 'images') {
      fetchImages(selectedEvent);
    }
  }, [selectedEvent, viewMode]);

  const fetchGalleryPageData = async () => {
    try {
      setLoading(true);
      const page = await pagesService.getBySlug('gallery');
      setGalleryPage(page);

      if (page?.id) {
        const pageSections = await sectionsService.getByPageId(page.id);
        setSections(pageSections);
      }
    } catch (error: any) {
      console.error('Error fetching gallery page data:', error);
      showNotification(error.message || 'Failed to load gallery page sections', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchGalleryData = async () => {
    try {
      setLoading(true);
      // Fetch all albums (no type filter) including inactive ones for CMS
      // This ensures we get all albums regardless of type
      const albumsData = await galleryAlbumsService.getAll(undefined, true);
      console.log('📦 Fetched all albums in CMS:', albumsData);
      console.log('📦 Album details:', albumsData.map((a: any) => ({
        id: a.id,
        name: a.name,
        slug: a.slug,
        albumType: a.albumType,
        isActive: a.isActive
      })));
      // Filter to only show year-type albums for the Year Galleries tab
      const yearAlbums = albumsData.filter((album: any) => album.albumType === 'year');
      console.log('📦 Filtered year albums:', yearAlbums);
      console.log('📦 Filtered year albums count:', yearAlbums.length);
      
      // If no year albums found but we have albums, show all albums with a warning
      if (yearAlbums.length === 0 && albumsData.length > 0) {
        console.warn('⚠️ No year-type albums found, but found', albumsData.length, 'total albums. Showing all albums.');
        showNotification(
          `Found ${albumsData.length} album(s) but none are marked as "year" type. Showing all albums. Please set albumType to "year" for year galleries.`,
          'warning'
        );
        setAlbums(albumsData); // Show all albums as fallback
      } else {
        setAlbums(yearAlbums);
      }
    } catch (error: any) {
      console.error('Error fetching gallery data:', error);
      showNotification(error.message || 'Failed to load galleries', 'error');
      setAlbums([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };
  
  const getSectionByKey = (key: string) => {
    return sections.find((s: any) => s.sectionKey === key);
  };
  
  const getContentValue = (section: any, contentKey: string): any => {
    if (!section?.content) return null;
    const contentItem = section.content.find((c: any) => c.contentKey === contentKey);
    if (!contentItem) return null;
    
    if (contentItem.contentType === 'json') {
      try {
        return JSON.parse(contentItem.contentValue || '{}');
      } catch {
        return contentItem.contentValue;
      }
    }
    
    return contentItem.contentValue || null;
  };
  
  const handleEditFixedSection = async (sectionKey: string) => {
    const section = getSectionByKey(sectionKey);
    if (!section) {
      showNotification(`Section ${sectionKey} not found. Please create it in the database.`, 'warning');
      return;
    }

    // Fetch fresh section data
    const freshSection = await sectionsService.getById(section.id);
    if (!freshSection) {
      showNotification('Failed to load section data', 'error');
      return;
    }

    const contentData: any = {};
    
    if (freshSection.content && Array.isArray(freshSection.content)) {
      freshSection.content.forEach((item: any) => {
        if (item.contentType === 'json') {
          try {
            contentData[item.contentKey] = JSON.parse(item.contentValue);
          } catch {
            contentData[item.contentKey] = item.contentValue;
          }
        } else {
          // For image fields, prefer mediaId or contentValue
          if (item.contentKey === 'backgroundImage' || item.contentKey === 'image') {
            if (item.mediaId) {
              contentData[item.contentKey] = item.mediaId;
            } else if (item.media?.id) {
              contentData[item.contentKey] = item.media.id;
            } else if (item.contentValue && (item.contentValue.startsWith('/') || item.contentValue.startsWith('http'))) {
              contentData[item.contentKey] = item.contentValue;
            } else {
              contentData[item.contentKey] = item.contentValue || '';
            }
          } else if (item.contentKey === 'cards' && item.contentType === 'json') {
            // Handle cards JSON properly
            try {
              contentData[item.contentKey] = JSON.parse(item.contentValue || '[]');
            } catch {
              contentData[item.contentKey] = item.contentValue || '';
            }
          } else {
            contentData[item.contentKey] = item.contentValue || '';
          }
        }
      });
    }

    setFormData(contentData);
    setEditingItem({ ...freshSection, _section: freshSection });
    setModalType('edit');
    setCurrentEntityTypeLocal(`section-content-${sectionKey}-gallery`);
    setCurrentEntityType(`section-content-${sectionKey}-gallery`);
    setShowModal(true);
  };
  
  const handleCreateFixedSection = async (sectionKey: string, sectionType: string) => {
    if (!galleryPage?.id) {
      showNotification('Gallery page not found', 'error');
      return;
    }

    try {
      const newSection = await sectionsService.create({
        pageId: galleryPage.id,
        sectionType: sectionType,
        sectionKey: sectionKey,
        orderIndex: sections.length,
        isActive: true
      });
      
      showNotification('Section created successfully', 'success');
      fetchGalleryPageData();
      handleEditFixedSection(sectionKey);
    } catch (error: any) {
      showNotification(error.message || 'Failed to create section', 'error');
    }
  };

  const fetchEvents = async (albumId: number) => {
    try {
      setLoading(true);
      // Fetch all events including inactive ones for CMS
      const eventsData = await galleryEventsService.getByAlbumId(albumId, true);
      console.log('📅 Fetched events for album', albumId, ':', eventsData);
      console.log('📅 Events count:', eventsData?.length || 0);
      setEvents(eventsData || []);
    } catch (error: any) {
      console.error('Error fetching events:', error);
      showNotification(error.message || 'Failed to load events', 'error');
      setEvents([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const fetchImages = async (eventId: number) => {
    try {
      setLoading(true);
      const imagesData = await galleryImagesService.getByEventId(eventId, true);
      // Sort by orderIndex to ensure proper display order
      const sortedImages = (imagesData || []).sort((a: any, b: any) => {
        const orderA = a.orderIndex !== undefined ? a.orderIndex : 0;
        const orderB = b.orderIndex !== undefined ? b.orderIndex : 0;
        return orderA - orderB;
      });
      setImages(sortedImages);
      // Clear selection when images are refreshed (in case some were deleted)
      setSelectedImages(new Set());
    } catch (error: any) {
      console.error('Error fetching images:', error);
      showNotification(error.message || 'Failed to load images', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAlbum = () => {
    setEditingItem(null);
    // Default to 'year' type when adding from Year Galleries tab
    // Default to unpublished (isActive: false) so it can be published later
    setFormData({
      name: '',
      slug: '',
      description: '',
      coverImageId: null,
      albumType: mainTab === 'galleries' ? 'year' : 'custom',
      orderIndex: albums.length,
      isActive: false // Default to unpublished
    });
    setModalType('add');
    const entityType = 'gallery-album';
    setCurrentEntityTypeLocal(entityType);
    setCurrentEntityType(entityType);
    setShowModal(true);
  };

  const handleEditAlbum = (album: any) => {
    setEditingItem(album);
    setFormData({
      name: album.name || '',
      slug: album.slug || '',
      description: album.description || '',
      coverImageId: album.coverImageId || album.coverImage?.id || null,
      albumType: album.albumType || 'custom',
      orderIndex: album.orderIndex || 0,
      isActive: album.isActive !== undefined ? album.isActive : true
    });
    setModalType('edit');
    const entityType = 'gallery-album';
    setCurrentEntityTypeLocal(entityType);
    setCurrentEntityType(entityType);
    setShowModal(true);
  };

  const handleViewAlbumEvents = (album: any) => {
    setSelectedAlbum(album.id);
    setViewMode('events');
    fetchEvents(album.id);
  };

  const handleAddEvent = () => {
    if (!selectedAlbum) {
      showNotification('Please select an album first', 'warning');
      return;
    }
    setEditingItem(null);
    setFormData({
      albumId: selectedAlbum,
      name: '',
      slug: '',
      description: '',
      coverImageId: null,
      eventDate: '',
      location: '',
      orderIndex: events.length,
      isActive: true
    });
    setModalType('add');
    const entityType = 'gallery-event';
    setCurrentEntityTypeLocal(entityType);
    setCurrentEntityType(entityType);
    setShowModal(true);
  };

  const handleEditEvent = (event: any) => {
    setEditingItem(event);
    setFormData({
      albumId: event.albumId || selectedAlbum,
      name: event.name || '',
      slug: event.slug || '',
      description: event.description || '',
      coverImageId: event.coverImageId || event.coverImage?.id || null,
      eventDate: event.eventDate ? event.eventDate.split('T')[0] : '',
      location: event.location || '',
      orderIndex: event.orderIndex || 0,
      isActive: event.isActive !== undefined ? event.isActive : true
    });
    setModalType('edit');
    const entityType = 'gallery-event';
    setCurrentEntityTypeLocal(entityType);
    setCurrentEntityType(entityType);
    setShowModal(true);
  };

  const handleViewEventImages = (event: any) => {
    setSelectedEvent(event.id);
    setViewMode('images');
    setSelectedImages(new Set()); // Clear selection when switching events
    fetchImages(event.id);
  };

  const handleAddImage = () => {
    if (!selectedEvent) {
      showNotification('Please select an event first', 'warning');
      return;
    }
    setEditingItem(null);
    setFormData({
      eventId: selectedEvent,
      title: '',
      imageId: null,
      orderIndex: images.length,
      isActive: true
    });
    setModalType('add');
    const entityType = 'gallery-image';
    setCurrentEntityTypeLocal(entityType);
    setCurrentEntityType(entityType);
    setShowModal(true);
  };

  const handleEditImage = (image: any) => {
    setEditingItem(image);
    setFormData({
      eventId: image.eventId || selectedEvent,
      title: image.title || '',
      imageId: image.imageId || image.image?.id || null,
      orderIndex: image.orderIndex || 0,
      isActive: image.isActive !== undefined ? image.isActive : true
    });
    setModalType('edit');
    const entityType = 'gallery-image';
    setCurrentEntityTypeLocal(entityType);
    setCurrentEntityType(entityType);
    setShowModal(true);
  };

  const handleReorderImages = async (newOrder: { id: number; orderIndex: number }[]) => {
    if (!selectedEvent) return;
    
    try {
      setReordering(true);
      await galleryImagesService.reorder(selectedEvent, newOrder);
      showNotification('Images reordered successfully', 'success');
      fetchImages(selectedEvent);
    } catch (error: any) {
      console.error('Error reordering images:', error);
      showNotification(error.message || 'Failed to reorder images', 'error');
    } finally {
      setReordering(false);
    }
  };

  const handleDragStart = (imageId: number) => {
    setDraggedImage(imageId);
  };

  const handleDragOver = (e: React.DragEvent, targetImageId: number) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, targetImageId: number) => {
    e.preventDefault();
    if (!draggedImage || draggedImage === targetImageId || !selectedEvent) return;

    const draggedIndex = images.findIndex(img => img.id === draggedImage);
    const targetIndex = images.findIndex(img => img.id === targetImageId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    // Create new order
    const newImages = [...images];
    const [removed] = newImages.splice(draggedIndex, 1);
    newImages.splice(targetIndex, 0, removed);

    // Update orderIndex for all affected images
    const reorderData = newImages.map((img, index) => ({
      id: img.id,
      orderIndex: index
    }));

    await handleReorderImages(reorderData);
    setDraggedImage(null);
  };

  const handleBulkImageUpload = async (files: FileList) => {
    if (!selectedEvent) {
      showNotification('Please select an event first', 'warning');
      return;
    }

    setBulkUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file, index) => {
        try {
        const imageId = await uploadImageUtil(file);
          if (!imageId || (typeof imageId === 'number' && imageId <= 0)) {
            console.error(`Failed to upload image ${file.name}: invalid imageId`, imageId);
            throw new Error(`Failed to upload ${file.name}: Invalid image ID`);
          }
          
          console.log(`Creating gallery image for file ${file.name} with imageId:`, imageId);
          const result = await galleryImagesService.create({
            eventId: selectedEvent,
            title: file.name.replace(/\.[^/.]+$/, ''),
            imageId: typeof imageId === 'number' ? imageId : parseInt(imageId),
            orderIndex: images.length + index,
            isActive: true
          });
          console.log(`Successfully created gallery image:`, result);
          return result;
        } catch (fileError: any) {
          console.error(`Error uploading file ${file.name}:`, fileError);
          throw new Error(`Failed to upload ${file.name}: ${fileError.response?.data?.message || fileError.message || 'Unknown error'}`);
        }
      });

      const results = await Promise.all(uploadPromises);
      const successful = results.filter(r => r !== null);
      
      showNotification(`Successfully uploaded ${successful.length} image(s)`, 'success');
      fetchImages(selectedEvent);
    } catch (error: any) {
      console.error('Bulk upload error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to upload images';
      showNotification(errorMessage, 'error');
    } finally {
      setBulkUploading(false);
    }
  };

  const handleTogglePublish = async (item: any, entityType: string) => {
    try {
      const newStatus = !item.isActive;
      let updatedItem;

      if (entityType === 'gallery-album') {
        updatedItem = await galleryAlbumsService.update(item.id, { isActive: newStatus });
        setAlbums(albums.map(a => a.id === item.id ? updatedItem : a));
      } else if (entityType === 'gallery-event') {
        updatedItem = await galleryEventsService.update(item.id, { isActive: newStatus });
        setEvents(events.map(e => e.id === item.id ? updatedItem : e));
      } else if (entityType === 'gallery-image') {
        updatedItem = await galleryImagesService.update(item.id, { isActive: newStatus });
        setImages(images.map(img => img.id === item.id ? updatedItem : img));
      }

      showNotification(
        `${entityType.replace('gallery-', '').replace('-', ' ')} ${newStatus ? 'published' : 'unpublished'} successfully`,
        'success'
      );
    } catch (error: any) {
      showNotification(error.message || 'Failed to update status', 'error');
    }
  };

  const handleBack = () => {
    if (viewMode === 'images') {
      setViewMode('events');
      setSelectedEvent(null);
      setImages([]);
    } else if (viewMode === 'events') {
      setViewMode('albums');
      setSelectedAlbum(null);
      setEvents([]);
    }
  };

  const getCurrentAlbum = () => albums.find(a => a.id === selectedAlbum);
  const getCurrentEvent = () => events.find(e => e.id === selectedEvent);

  // Breadcrumb navigation handlers
  const handleBreadcrumbAlbums = () => {
    setViewMode('albums');
    setSelectedAlbum(null);
    setSelectedEvent(null);
    setEvents([]);
    setImages([]);
  };

  const handleBreadcrumbAlbum = () => {
    if (selectedAlbum) {
      setViewMode('events');
      setSelectedEvent(null);
      setImages([]);
      fetchEvents(selectedAlbum);
    }
  };

  const handleBreadcrumbEvent = () => {
    if (selectedEvent) {
      setViewMode('images');
      fetchImages(selectedEvent);
    }
  };

  if (loading && albums.length === 0) {
    return (
      <div className="p-8">
        <LoadingSkeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <NotificationToast notification={notification} onClose={hideNotification} />

      {/* Main Tabs */}
      <div className="bg-white rounded-xl shadow-lg p-1">
        <div className="flex gap-2">
          <button
            onClick={() => setMainTab('sections')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              mainTab === 'sections'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Page Sections
          </button>
          <button
            onClick={() => setMainTab('galleries')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              mainTab === 'galleries'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Year Galleries
          </button>
        </div>
      </div>

      {/* Page Sections Tab */}
      {mainTab === 'sections' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Gallery Page Sections</h2>
            
            {/* Section Navigation */}
            <div className="flex gap-2 mb-6 border-b border-gray-200">
              <button
                onClick={() => setActiveSection('hero')}
                className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                  activeSection === 'hero'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Hero Section
              </button>
              <button
                onClick={() => setActiveSection('welcome')}
                className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                  activeSection === 'welcome'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Welcome Section
              </button>
              <button
                onClick={() => setActiveSection('cta')}
                className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                  activeSection === 'cta'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                CTA Section
              </button>
            </div>

            {/* Hero Section */}
            {activeSection === 'hero' && (() => {
              const heroSection = getSectionByKey('hero');
              if (!heroSection) {
                return (
                  <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">No Hero section found. Please create one in the database.</p>
                    <button
                      onClick={() => handleCreateFixedSection('hero', 'hero')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Create Hero Section
                    </button>
                  </div>
                );
              }
              
              const heroTitle = getContentValue(heroSection, 'title') || 'Gallery';
              const heroDescription = getContentValue(heroSection, 'description') || '';
              const overlayOpacity = getContentValue(heroSection, 'overlayOpacity') || '';
              const blurOverlay = getContentValue(heroSection, 'blurOverlay') || '';
              const overlayColor = getContentValue(heroSection, 'overlayColor') || '';
              const gradientOverlay = getContentValue(heroSection, 'gradientOverlay') || '';
              const bgImage = heroSection.content?.find((c: any) => c.contentKey === 'backgroundImage');
              const bgImagePath = bgImage?.media?.filePath || bgImage?.contentValue || '';
              
              return (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Hero Section</h3>
                      <p className="text-sm text-gray-500 mt-1">Manage hero section content</p>
                    </div>
                    <button
                      onClick={() => handleEditFixedSection('hero')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                      <i className="ri-edit-line"></i>
                      Edit Content
                    </button>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Title</label>
                        <p className="text-gray-900 mt-1">{heroTitle}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Description</label>
                        <p className="text-gray-600 mt-1">{heroDescription || 'No description'}</p>
                      </div>
                      {overlayOpacity && (
                        <div>
                          <label className="text-sm font-medium text-gray-700">Overlay Opacity</label>
                          <p className="text-gray-600 mt-1">{overlayOpacity}%</p>
                        </div>
                      )}
                      {blurOverlay && (
                        <div>
                          <label className="text-sm font-medium text-gray-700">Blur Overlay</label>
                          <p className="text-gray-600 mt-1">{blurOverlay}px</p>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Background Image</label>
                      {bgImagePath ? (
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                          <img src={getAssetPath(bgImagePath)} alt="Hero background" className="w-full h-48 object-cover" />
                        </div>
                      ) : (
                        <div className="border border-gray-200 rounded-lg p-8 bg-gray-50 text-center">
                          <p className="text-gray-400 text-sm">No image set</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Welcome Section */}
            {activeSection === 'welcome' && (() => {
              const welcomeSection = getSectionByKey('welcome');
              if (!welcomeSection) {
                return (
                  <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">No Welcome section found. Please create one in the database.</p>
                    <button
                      onClick={() => handleCreateFixedSection('welcome', 'content')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Create Welcome Section
                    </button>
                  </div>
                );
              }
              
              const welcomeTitle = getContentValue(welcomeSection, 'title') || '';
              const welcomeDescription = getContentValue(welcomeSection, 'description') || '';
              const welcomeImage = welcomeSection.content?.find((c: any) => c.contentKey === 'image');
              const imagePath = welcomeImage?.media?.filePath || welcomeImage?.contentValue || '';
              
              return (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Welcome Section</h3>
                      <p className="text-sm text-gray-500 mt-1">Manage welcome section content</p>
                    </div>
                    <button
                      onClick={() => handleEditFixedSection('welcome')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                      <i className="ri-edit-line"></i>
                      Edit Content
                    </button>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Title</label>
                        <p className="text-gray-900 mt-1">{welcomeTitle || 'No title'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Description</label>
                        <p className="text-gray-600 mt-1">{welcomeDescription || 'No description'}</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Image</label>
                      {imagePath ? (
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                          <img src={getAssetPath(imagePath)} alt="Welcome image" className="w-full h-48 object-cover" />
                        </div>
                      ) : (
                        <div className="border border-gray-200 rounded-lg p-8 bg-gray-50 text-center">
                          <p className="text-gray-400 text-sm">No image set</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* CTA Section */}
            {activeSection === 'cta' && (() => {
              const ctaSection = getSectionByKey('cta');
              if (!ctaSection) {
                return (
                  <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">No CTA section found. Please create one in the database.</p>
                    <button
                      onClick={() => handleCreateFixedSection('cta', 'cta')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Create CTA Section
                    </button>
                  </div>
                );
              }
              
              const bgGradientFrom = getContentValue(ctaSection, 'bgGradientFrom') || '#3b9dd6';
              const bgGradientTo = getContentValue(ctaSection, 'bgGradientTo') || '#4db3e8';
              const cardsJson = getContentValue(ctaSection, 'cards');
              
              let cardsArray: any[] = [];
              if (cardsJson) {
                if (Array.isArray(cardsJson)) {
                  cardsArray = cardsJson;
                } else if (typeof cardsJson === 'string') {
                  try {
                    cardsArray = JSON.parse(cardsJson);
                  } catch {
                    cardsArray = [];
                  }
                }
              }
              
              return (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">CTA Section</h3>
                      <p className="text-sm text-gray-500 mt-1">Manage CTA section content</p>
                    </div>
                    <button
                      onClick={() => handleEditFixedSection('cta')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                      <i className="ri-edit-line"></i>
                      Edit Content
                    </button>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Background Gradient From</label>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-12 h-8 rounded border border-gray-300" style={{ backgroundColor: bgGradientFrom }}></div>
                          <p className="text-gray-900">{bgGradientFrom}</p>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Background Gradient To</label>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-12 h-8 rounded border border-gray-300" style={{ backgroundColor: bgGradientTo }}></div>
                          <p className="text-gray-900">{bgGradientTo}</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">CTA Cards ({cardsArray.length})</label>
                      {cardsArray.length > 0 ? (
                        <div className="space-y-2">
                          {cardsArray.map((card: any, index: number) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                              <p className="font-medium text-gray-900">{card.title || `Card ${index + 1}`}</p>
                              <p className="text-sm text-gray-600">{card.buttonText} → {card.buttonLink}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="border border-gray-200 rounded-lg p-8 bg-gray-50 text-center">
                          <p className="text-gray-400 text-sm">No cards configured</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Year galleries are managed in the "Year Galleries" tab.
            </p>
          </div>
        </div>
      )}

      {/* Year Galleries Tab */}
      {mainTab === 'galleries' && (
        <div className="space-y-6">
      {/* Header with Breadcrumb */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {viewMode !== 'albums' && (
            <button
              onClick={handleBack}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2"
            >
              <i className="ri-arrow-left-line"></i>
              Back
            </button>
          )}
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Gallery Management</h2>
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
              <button
                onClick={handleBreadcrumbAlbums}
                className={`hover:text-blue-600 transition-colors ${
                  viewMode === 'albums' ? 'text-gray-800 font-semibold' : 'text-gray-600 cursor-pointer'
                }`}
              >
                Albums
              </button>
              {viewMode === 'events' && selectedAlbum && (
                <>
                  <i className="ri-arrow-right-s-line text-gray-400"></i>
                  <button
                    onClick={handleBreadcrumbAlbum}
                    className="text-gray-800 font-semibold hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    {getCurrentAlbum()?.name || 'Events'}
                  </button>
                </>
              )}
              {viewMode === 'images' && selectedEvent && selectedAlbum && (
                <>
                  <i className="ri-arrow-right-s-line text-gray-400"></i>
                  <button
                    onClick={handleBreadcrumbAlbum}
                    className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    {getCurrentAlbum()?.name || 'Events'}
                  </button>
                  <i className="ri-arrow-right-s-line text-gray-400"></i>
                  <button
                    onClick={handleBreadcrumbEvent}
                    className="text-gray-800 font-semibold hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    {getCurrentEvent()?.name || 'Images'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {viewMode === 'albums' && (
            <button
              onClick={handleAddAlbum}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <i className="ri-add-line"></i>
              Create Gallery
            </button>
          )}
          {viewMode === 'events' && selectedAlbum && (
            <button
              onClick={handleAddEvent}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <i className="ri-add-line"></i>
              Add Event
            </button>
          )}
          {viewMode === 'images' && selectedEvent && (
            <>
              <label className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                <i className={`ri-upload-cloud-2-line ${bulkUploading ? 'animate-pulse' : ''}`}></i>
                {bulkUploading ? 'Uploading...' : 'Bulk Upload'}
                <input
                  ref={bulkUploadInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleBulkImageUpload(e.target.files);
                    }
                  }}
                  disabled={bulkUploading}
                />
              </label>
              <button
                onClick={handleAddImage}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <i className="ri-add-line"></i>
                Add Image
              </button>
            </>
          )}
        </div>
      </div>

      {/* Albums View */}
      {viewMode === 'albums' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          {albums.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <i className="ri-folder-line text-6xl mb-4"></i>
              <p className="text-lg mb-2">No year galleries yet</p>
              <p className="text-sm mb-4">Create your first year gallery to get started</p>
              <button
                onClick={handleAddAlbum}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
              >
                <i className="ri-add-line"></i>
                Create Year Gallery
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {albums.map((album) => {
                console.log('🎨 Rendering album:', { id: album.id, name: album.name, slug: album.slug, albumType: album.albumType, isActive: album.isActive });
                return (
                <div
                  key={album.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative aspect-video bg-gray-100">
                    {album.coverImage?.filePath ? (
                      <img
                        src={getAssetPath(album.coverImage.filePath)}
                        alt={album.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999"%3ENo Cover Image%3C/text%3E%3C/svg%3E';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <i className="ri-image-line text-4xl"></i>
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        album.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {album.isActive ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1">{album.name}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{album.description || 'No description'}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {album.events?.length || 0} event{album.events?.length !== 1 ? 's' : ''}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleTogglePublish(album, 'gallery-album')}
                          className={`p-1.5 rounded transition-colors ${
                            album.isActive
                              ? 'text-green-600 hover:bg-green-50'
                              : 'text-gray-400 hover:bg-gray-50'
                          }`}
                          title={album.isActive ? 'Unpublish' : 'Publish'}
                        >
                          <i className={`ri-${album.isActive ? 'eye' : 'eye-off'}-line`}></i>
                        </button>
                        <button
                          onClick={() => handleViewAlbumEvents(album)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="View Events"
                        >
                          <i className="ri-folder-open-line"></i>
                        </button>
                        <button
                          onClick={() => handleEditAlbum(album)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Edit"
                        >
                          <i className="ri-pencil-line"></i>
                        </button>
                        <button
                          onClick={() => handleDelete(album, 'gallery-album')}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
              })}
            </div>
          )}
        </div>
      )}

      {/* Events View */}
      {viewMode === 'events' && selectedAlbum && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          {loading ? (
            <LoadingSkeleton className="h-64" />
          ) : events.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <i className="ri-calendar-event-line text-6xl mb-4"></i>
              <p className="text-lg mb-2">No events yet</p>
              <p className="text-sm">Add events to organize your gallery images</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-white"
                >
                  <div className="relative aspect-video bg-gray-100">
                    {event.coverImage?.filePath ? (
                      <img
                        src={getAssetPath(event.coverImage.filePath)}
                        alt={event.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999"%3ENo Cover Image%3C/text%3E%3C/svg%3E';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <i className="ri-image-line text-4xl"></i>
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        event.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {event.isActive ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>
                  <div className="p-2">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1" title={event.name}>{event.name}</h3>
                    {event.eventDate && (
                      <p className="text-xs text-gray-500 mb-1">
                        <i className="ri-calendar-line"></i> {new Date(event.eventDate).toLocaleDateString()}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-2 gap-1">
                      <button
                        onClick={() => handleViewEventImages(event)}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                        title="View Images"
                      >
                        <i className="ri-image-line"></i>
                        <span className="hidden sm:inline">View</span>
                      </button>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={async () => {
                            try {
                              const eventImages = await galleryImagesService.getByEventId(event.id, true);
                              if (!eventImages || eventImages.length === 0) {
                                showNotification('No images available. Please upload images first.', 'warning');
                                return;
                              }
                              setCoverImageModal({ event, images: eventImages });
                            } catch (error: any) {
                              console.error('Error loading images:', error);
                              showNotification(error.message || 'Failed to load images', 'error');
                            }
                          }}
                          className="p-1.5 text-purple-600 hover:bg-purple-50 rounded transition-colors"
                          title="Set Cover Image"
                        >
                          <i className="ri-image-add-line"></i>
                        </button>
                        <button
                          onClick={() => handleTogglePublish(event, 'gallery-event')}
                          className={`p-1.5 rounded transition-colors ${
                            event.isActive
                              ? 'text-green-600 hover:bg-green-50'
                              : 'text-gray-400 hover:bg-gray-50'
                          }`}
                          title={event.isActive ? 'Unpublish' : 'Publish'}
                        >
                          <i className={`ri-${event.isActive ? 'eye' : 'eye-off'}-line`}></i>
                        </button>
                        <button
                          onClick={() => handleEditEvent(event)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Edit"
                        >
                          <i className="ri-pencil-line"></i>
                        </button>
                        <button
                          onClick={() => handleDelete(event, 'gallery-event')}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Images View */}
      {viewMode === 'images' && selectedEvent && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          {loading ? (
            <LoadingSkeleton className="h-64" />
          ) : images.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <i className="ri-image-line text-6xl mb-4"></i>
              <p className="text-lg mb-2">No images yet</p>
              <p className="text-sm">Upload images to this event</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <div className="flex items-center gap-4">
                  <p className="text-sm text-gray-600">
                    Drag and drop images to reorder • Click buttons to edit, publish/unpublish, or delete
                  </p>
                  {selectedImages.size > 0 && (
                    <span className="text-sm font-semibold text-blue-600">
                      {selectedImages.size} selected
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {selectedImages.size > 0 && (
                    <>
                      <button
                        onClick={() => setSelectedImages(new Set())}
                        className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                      >
                        Clear Selection
                      </button>
                      <button
                        onClick={async () => {
                          if (isDeleting) return;
                          const count = selectedImages.size;
                          if (window.confirm(`Are you sure you want to delete ${count} image${count > 1 ? 's' : ''}? This action cannot be undone.`)) {
                            setIsDeleting(true);
                            try {
                              const imagesToDelete = images.filter(img => selectedImages.has(img.id));
                              for (const img of imagesToDelete) {
                                await handleDelete(img, 'gallery-image');
                              }
                              setSelectedImages(new Set());
                              if (selectedEvent) {
                                await fetchImages(selectedEvent);
                              }
                              showNotification(`Successfully deleted ${count} image${count > 1 ? 's' : ''}`, 'success');
                            } catch (error: any) {
                              console.error('Error deleting images:', error);
                              showNotification(error.message || 'Failed to delete images', 'error');
                            } finally {
                              setIsDeleting(false);
                            }
                          }
                        }}
                        disabled={isDeleting}
                        className="px-4 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {isDeleting ? (
                          <>
                            <i className="ri-loader-4-line animate-spin"></i>
                            Deleting...
                          </>
                        ) : (
                          <>
                            <i className="ri-delete-bin-line"></i>
                            Delete Selected ({selectedImages.size})
                          </>
                        )}
                      </button>
                    </>
                  )}
                  {images.length > 0 && selectedImages.size === 0 && (
                    <button
                      onClick={() => {
                        if (selectedImages.size === images.length) {
                          setSelectedImages(new Set());
                        } else {
                          setSelectedImages(new Set(images.map(img => img.id)));
                        }
                      }}
                      className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                    >
                      {selectedImages.size === images.length ? 'Deselect All' : 'Select All'}
                    </button>
                  )}
                  {reordering && (
                    <span className="text-sm text-blue-600 flex items-center gap-2">
                      <i className="ri-loader-4-line animate-spin"></i>
                      Reordering...
                    </span>
                  )}
                </div>
              </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {images.map((image, index) => (
                <div
                  key={image.id}
                    draggable={!selectedImages.size}
                    onDragStart={() => handleDragStart(image.id)}
                    onDragOver={(e) => handleDragOver(e, image.id)}
                    onDrop={(e) => handleDrop(e, image.id)}
                    className={`group relative aspect-square border-2 rounded-lg overflow-hidden hover:shadow-lg transition-all ${
                      selectedImages.has(image.id) 
                        ? 'border-blue-500 ring-2 ring-blue-300' 
                        : draggedImage === image.id 
                          ? 'border-blue-500 opacity-50' 
                          : 'border-gray-200'
                    } ${reordering ? 'pointer-events-none' : selectedImages.size > 0 ? 'cursor-pointer' : 'cursor-move'}`}
                    onClick={(e) => {
                      if (selectedImages.size > 0 && !(e.target as HTMLElement).closest('button')) {
                        e.stopPropagation();
                        const newSelected = new Set(selectedImages);
                        if (newSelected.has(image.id)) {
                          newSelected.delete(image.id);
                        } else {
                          newSelected.add(image.id);
                        }
                        setSelectedImages(newSelected);
                      }
                    }}
                  >
                    {/* Selection Checkbox */}
                    <div 
                      className={`absolute top-2 left-2 z-20 ${selectedImages.size > 0 ? 'block' : 'hidden group-hover:block'}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={selectedImages.has(image.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          const newSelected = new Set(selectedImages);
                          if (e.target.checked) {
                            newSelected.add(image.id);
                          } else {
                            newSelected.delete(image.id);
                          }
                          setSelectedImages(newSelected);
                        }}
                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </div>
                    {/* Order indicator */}
                    <div className="absolute top-2 right-2 z-10 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded">
                      #{index + 1}
                    </div>
                  {image.image?.filePath ? (
                    <img
                      src={getAssetPath(image.image.filePath)}
                      alt={image.title || 'Gallery image'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                      <i className="ri-image-line text-3xl"></i>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2">
                      <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTogglePublish(image, 'gallery-image');
                            }}
                        className={`p-2 rounded transition-colors ${
                          image.isActive
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-gray-600 text-white hover:bg-gray-700'
                        }`}
                        title={image.isActive ? 'Unpublish' : 'Publish'}
                      >
                        <i className={`ri-${image.isActive ? 'eye' : 'eye-off'}-line`}></i>
                      </button>
                      <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditImage(image);
                            }}
                        className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        title="Edit"
                      >
                        <i className="ri-pencil-line"></i>
                      </button>
                      <button
                            onClick={async (e) => {
                              e.stopPropagation();
                              if (isDeleting) return;
                              
                              // Use a more reliable confirmation approach
                              const confirmed = window.confirm('Are you sure you want to delete this image? This action cannot be undone.');
                              if (!confirmed) return;
                              
                              setIsDeleting(true);
                              try {
                                await handleDelete(image, 'gallery-image');
                                // Remove from selection if it was selected
                                if (selectedImages.has(image.id)) {
                                  const newSelected = new Set(selectedImages);
                                  newSelected.delete(image.id);
                                  setSelectedImages(newSelected);
                                }
                                // Refresh images after deletion
                                if (selectedEvent) {
                                  await fetchImages(selectedEvent);
                                }
                                showNotification('Image deleted successfully', 'success');
                              } catch (error: any) {
                                console.error('Error deleting image:', error);
                                showNotification(error.message || 'Failed to delete image', 'error');
                              } finally {
                                setIsDeleting(false);
                              }
                            }}
                            disabled={isDeleting}
                            className="p-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete"
                      >
                        <i className="ri-delete-bin-line"></i>
                      </button>
                        </div>
                        <div className="text-white text-xs mt-1">
                          <i className="ri-drag-move-2-line mr-1"></i>
                          Drag to reorder
                        </div>
                    </div>
                  </div>
                  {!image.isActive && (
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
                        Draft
                      </span>
                    </div>
                  )}
                </div>
              ))}
              </div>
            </div>
          )}
        </div>
      )}
        </div>
      )}

      {/* Cover Image Selection Modal */}
      {coverImageModal && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setCoverImageModal(null)}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Select Cover Image for "{coverImageModal.event.name}"
              </h3>
              <button
                onClick={() => setCoverImageModal(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex-1">
              {coverImageModal.images.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <i className="ri-image-line text-4xl mb-2"></i>
                  <p>No images available</p>
                </div>
              ) : (
                <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                  {coverImageModal.images.map((img: any) => {
                    const imagePath = img.image?.filePath || img.image?.url || '';
                    const isSelected = coverImageModal.event.coverImageId === img.imageId;
                    return (
                      <div
                        key={img.id}
                        onClick={async () => {
                          try {
                            await galleryEventsService.update(coverImageModal.event.id, { 
                              coverImageId: img.imageId 
                            });
                            showNotification('Cover image updated successfully', 'success');
                            if (selectedAlbum) {
                              await fetchEvents(selectedAlbum);
                            }
                            setCoverImageModal(null);
                          } catch (error: any) {
                            console.error('Error updating cover image:', error);
                            showNotification(error.message || 'Failed to update cover image', 'error');
                          }
                        }}
                        className={`relative cursor-pointer border-2 rounded-lg overflow-hidden transition-all ${
                          isSelected 
                            ? 'border-blue-600 ring-2 ring-blue-300' 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {imagePath ? (
                          <img
                            src={getAssetPath(imagePath)}
                            alt={img.title || 'Event image'}
                            className="w-full aspect-square object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="10"%3ENo Image%3C/text%3E%3C/svg%3E';
                            }}
                          />
                        ) : (
                          <div className="w-full aspect-square bg-gray-200 flex items-center justify-center">
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
          </div>
        </div>
      )}

    </div>
  );
}
