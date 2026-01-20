import { useState, useEffect } from 'react';
import { DataTable } from '../../shared/DataTable';
import { getAssetPath } from '../../shared/utils';
import type { CMSComponentProps } from '../../shared/types';
import { pagesService, sectionsService, heroSlidesService, businessCardsService, awardsService, homeVideoSectionService, homeAboutSectionService, homeCareersSectionService, homeCTASectionService, newsroomService } from '../../../../services/apiService';

// Helper function to extract image path from various data structures
const getImagePath = (item: any, fieldName: string = 'image'): string => {
  if (!item) return '';
  
  // Handle Sequelize dataValues wrapper
  const unwrapSequelize = (obj: any): any => {
    if (obj && typeof obj === 'object' && obj.dataValues) {
      return obj.dataValues;
    }
    return obj;
  };
  
  // Try direct field access (e.g., item.image, item.backgroundImage)
  let field = item[fieldName];
  field = unwrapSequelize(field);
  
  // If it's already a string path
  if (typeof field === 'string' && field && field.trim()) {
    return field;
  }
  
  // If it's a media object (from Sequelize relationship)
  if (field && typeof field === 'object' && !Array.isArray(field)) {
    // Try common media object properties
    if (field.url && typeof field.url === 'string' && field.url.trim()) return field.url;
    if (field.filePath && typeof field.filePath === 'string' && field.filePath.trim()) return field.filePath;
    if (field.path && typeof field.path === 'string' && field.path.trim()) return field.path;
    // Try dataValues (Sequelize models sometimes wrap in dataValues)
    const unwrapped = unwrapSequelize(field);
    if (unwrapped !== field) {
      if (unwrapped.url && typeof unwrapped.url === 'string' && unwrapped.url.trim()) return unwrapped.url;
      if (unwrapped.filePath && typeof unwrapped.filePath === 'string' && unwrapped.filePath.trim()) return unwrapped.filePath;
    }
  }
  
  // Try with "Id" suffix to get the related media object (e.g., backgroundImageId -> backgroundImage)
  const idFieldName = `${fieldName}Id`;
  if (item[idFieldName] !== undefined && item[idFieldName] !== null) {
    // If it's a number, the media might be included as a relationship with the same name
    if (typeof item[idFieldName] === 'number') {
      // The media might be included as a relationship (e.g., backgroundImageId: 5, backgroundImage: { url: ... })
      const relatedField = fieldName; // e.g., backgroundImage
      let relatedObj = item[relatedField];
      relatedObj = unwrapSequelize(relatedObj);
      
      if (relatedObj && typeof relatedObj === 'object' && !Array.isArray(relatedObj)) {
        if (relatedObj.url && typeof relatedObj.url === 'string' && relatedObj.url.trim()) return relatedObj.url;
        if (relatedObj.filePath && typeof relatedObj.filePath === 'string' && relatedObj.filePath.trim()) return relatedObj.filePath;
        if (relatedObj.path && typeof relatedObj.path === 'string' && relatedObj.path.trim()) return relatedObj.path;
      }
    } else if (typeof item[idFieldName] === 'object') {
      // It's already a media object
      let mediaObj = unwrapSequelize(item[idFieldName]);
      if (mediaObj.url && typeof mediaObj.url === 'string' && mediaObj.url.trim()) return mediaObj.url;
      if (mediaObj.filePath && typeof mediaObj.filePath === 'string' && mediaObj.filePath.trim()) return mediaObj.filePath;
      if (mediaObj.path && typeof mediaObj.path === 'string' && mediaObj.path.trim()) return mediaObj.path;
    }
  }
  
  // Try capitalized version (e.g., BackgroundImage)
  const capitalizedField = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
  let capField = item[capitalizedField];
  capField = unwrapSequelize(capField);
  if (capField && typeof capField === 'object' && !Array.isArray(capField)) {
    if (capField.url && typeof capField.url === 'string' && capField.url.trim()) return capField.url;
    if (capField.filePath && typeof capField.filePath === 'string' && capField.filePath.trim()) return capField.filePath;
    if (capField.path && typeof capField.path === 'string' && capField.path.trim()) return capField.path;
  }
  
  // Try to access via toJSON() if it's a Sequelize instance
  if (item && typeof item.toJSON === 'function') {
    try {
      const json = item.toJSON();
      return getImagePath(json, fieldName);
    } catch (e) {
      // Ignore errors
    }
  }
  
  return '';
};

interface HomePageProps extends Partial<CMSComponentProps> {
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

export default function HomePage_cms({
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
}: HomePageProps) {
  const [activeSection, setActiveSection] = useState('hero-slides');
  const [activePageSection, setActivePageSection] = useState<string | null>(null);
  const [homePage, setHomePage] = useState<any>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [heroSlides, setHeroSlides] = useState<any[]>([]);
  const [businessCards, setBusinessCards] = useState<any[]>([]);
  const [awards, setAwards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedSlide, setDraggedSlide] = useState<number | null>(null);
  const [savingOrder, setSavingOrder] = useState(false);
  const [draggedAward, setDraggedAward] = useState<number | null>(null);
  const [savingAwardOrder, setSavingAwardOrder] = useState(false);
  const [draggedNewsroomItem, setDraggedNewsroomItem] = useState<number | null>(null);
  const [savingNewsroomOrder, setSavingNewsroomOrder] = useState(false);

  // New State Variables
  const [videoSection, setVideoSection] = useState<any>(null);
  const [aboutSection, setAboutSection] = useState<any>(null);
  const [careersSection, setCareersSection] = useState<any>(null);
  const [newsroomItems, setNewsroomItems] = useState<any[]>([]);
  const [ctaSections, setCtaSections] = useState<any[]>([]);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      const page = await pagesService.getBySlug('home');
      setHomePage(page);

      const pageSections = await sectionsService.getByPageId(page.id);
      setSections(pageSections);

      const slides = await heroSlidesService.getByPageId(page.id);
      // Sort by orderIndex
      const sortedSlides = slides.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
      setHeroSlides(sortedSlides);

      const cards = await businessCardsService.getAll();
      setBusinessCards(cards);

      const awardsData = await awardsService.getAll();
      const sortedAwards = awardsData.sort((a: any, b: any) => (a.orderIndex || a.order || 0) - (b.orderIndex || b.order || 0));
      setAwards(sortedAwards);

      // Fetch new sections
      try {
        const video = await homeVideoSectionService.get();
        setVideoSection(video);
      } catch (e) { console.warn('Video fetch failed', e); }

      try {
        const about = await homeAboutSectionService.get();
        setAboutSection(about);
      } catch (e) { console.warn('About fetch failed', e); }

      try {
        const careers = await homeCareersSectionService.get();
        setCareersSection(careers);
      } catch (e) { console.warn('Careers fetch failed', e); }

      try {
        const news = await newsroomService.getAll();
        // Sort by orderIndex
        const sortedNews = news.sort((a: any, b: any) => (a.orderIndex || 0) - (b.orderIndex || 0));
        setNewsroomItems(sortedNews);
      } catch (e) { console.warn('Newsroom fetch failed', e); }

      try {
        const ctas = await homeCTASectionService.getAll();
        setCtaSections(ctas);
      } catch (e) { console.warn('CTA fetch failed', e); }
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleRefresh = () => {
      fetchHomeData();
    };
    window.addEventListener('cms-refresh', handleRefresh);
    return () => window.removeEventListener('cms-refresh', handleRefresh);
  }, []);

  const handleAddHeroSlide = () => {
    setEditingItem(null);
    setFormData({
      pageId: homePage?.id,
      title: '',
      subtitle: '',
      description: '',
      buttonText: '',
      buttonLink: '',
      linkType: 'internal',
      backgroundImage: '',
      orderIndex: heroSlides.length + 1,
      isActive: true
    });
    setModalType('add');
    setCurrentEntityType('hero-slide');
    setShowModal(true);
  };

  const handleEditHeroSlide = (slide: any) => {
    setEditingItem(slide);
    // Determine link type based on buttonLink
    const isInternal = slide.buttonLink && !slide.buttonLink.startsWith('http');
    const linkType = isInternal ? 'internal' : (slide.buttonLink ? 'external' : 'internal');

    setFormData({
      ...slide,
      buttonText: slide.buttonText || '',
      buttonLink: slide.buttonLink || '',
      linkType: linkType,
      backgroundImage: slide.backgroundImageId || slide.backgroundImage?.id || slide.backgroundImage?.url || slide.backgroundImage || ''
    });
    setModalType('edit');
    setCurrentEntityType('hero-slide');
    setShowModal(true);
  };

  const handleAddBusinessCard = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      description: '',
      link: '',
      image: '',
      orderIndex: businessCards.length + 1,
      isActive: true
    });
    setModalType('add');
    setCurrentEntityType('business-card');
    setShowModal(true);
  };

  const handleEditBusinessCard = (card: any) => {
    setEditingItem(card);
    setFormData({
      ...card,
      image: card.imageId || card.image?.id || card.image?.url || card.image || ''
    });
    setModalType('edit');
    setCurrentEntityType('business-card');
    setShowModal(true);
  };

  const handleEditSectionContent = (section: any) => {
    // Prepare form data with all content fields
    const contentData: any = {
      sectionId: section.id,
      _section: section // Store section object for handleSubmit
    };

    section.content?.forEach((item: any) => {
      if (item.contentType === 'json') {
        try {
          contentData[item.contentKey] = JSON.parse(item.contentValue);
        } catch {
          contentData[item.contentKey] = item.contentValue;
        }
      } else {
        contentData[item.contentKey] = item.contentValue;
      }
    });

    setEditingItem(section);
    setFormData(contentData);
    setModalType('edit');
    setCurrentEntityType(`section-content-${section.sectionKey}`);
    setShowModal(true);
  };

  const handleAddAward = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      image: '',
      type: 'standard',
      year: '',
      recipient: '',
      order: awards.length + 1,
      isActive: true
    });
    setModalType('add');
    setCurrentEntityType('award');
    setShowModal(true);
  };

  const handleEditAward = (award: any) => {
    setEditingItem(award);
    // Explicitly handle showAwardName - preserve false, default to true if undefined/null
    let showAwardNameValue = true; // Default
    if (award.showAwardName === false) {
      showAwardNameValue = false;
    } else if (award.showAwardName === true) {
      showAwardNameValue = true;
    }
    setFormData({
      ...award,
      image: award.imageId || award.image?.id || award.image?.url || award.image || '',
      order: award.order || award.orderIndex || 0,
      showAwardName: showAwardNameValue
    });
    setModalType('edit');
    setCurrentEntityType('award');
    setShowModal(true);
  };

  const handleDragDrop = (draggedId: number, targetId: number) => {
    const draggedIndex = heroSlides.findIndex(s => s.id === draggedId);
    const targetIndex = heroSlides.findIndex(s => s.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newSlides = [...heroSlides];
    const [draggedSlide] = newSlides.splice(draggedIndex, 1);
    newSlides.splice(targetIndex, 0, draggedSlide);

    // Update orderIndex for all slides
    const updatedSlides = newSlides.map((slide, index) => ({
      ...slide,
      orderIndex: index + 1
    }));

    setHeroSlides(updatedSlides);
  };

  const handleSaveOrder = async () => {
    try {
      setSavingOrder(true);
      // Use the current order of slides (already sorted by orderIndex)
      const sortedSlides = [...heroSlides].sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
      const slidesToUpdate = sortedSlides.map((slide, index) => ({
        id: slide.id,
        orderIndex: index + 1
      }));

      // Update each slide individually since bulk reorder endpoint might not exist
      // This ensures compatibility even if the backend doesn't have a reorder endpoint
      await Promise.all(
        slidesToUpdate.map(slide =>
          heroSlidesService.update(slide.id, { orderIndex: slide.orderIndex })
        )
      );

      // Refresh data
      const slides = await heroSlidesService.getByPageId(homePage.id);
      const refreshedSorted = slides.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
      setHeroSlides(refreshedSorted);

      // Show success message
      window.dispatchEvent(new CustomEvent('cms-refresh'));
      showNotification('Order saved successfully!', 'success');
    } catch (error: any) {
      console.error('Error saving order:', error);
      showNotification('Failed to save order. Please try again.', 'error');
    } finally {
      setSavingOrder(false);
    }
  };

  const handleDragDropAward = (draggedId: number, targetId: number) => {
    const draggedIndex = awards.findIndex(a => a.id === draggedId);
    const targetIndex = awards.findIndex(a => a.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newAwards = [...awards];
    const [draggedAward] = newAwards.splice(draggedIndex, 1);
    newAwards.splice(targetIndex, 0, draggedAward);

    // Update orderIndex for all awards
    const updatedAwards = newAwards.map((award, index) => ({
      ...award,
      orderIndex: index + 1
    }));

    setAwards(updatedAwards);
  };

  const handleSaveAwardOrder = async () => {
    try {
      setSavingAwardOrder(true);
      // Use the current order of awards (already sorted by orderIndex)
      const sortedAwards = [...awards].sort((a, b) => (a.orderIndex || a.order || 0) - (b.orderIndex || b.order || 0));
      const awardsToUpdate = sortedAwards.map((award, index) => ({
        id: award.id,
        orderIndex: index + 1
      }));

      // Update each award individually
      await Promise.all(
        awardsToUpdate.map(award =>
          awardsService.update(award.id, { orderIndex: award.orderIndex } as any)
        )
      );

      // Refresh data
      const awardsData = await awardsService.getAll();
      const refreshedSorted = awardsData.sort((a: any, b: any) => (a.orderIndex || a.order || 0) - (b.orderIndex || b.order || 0));
      setAwards(refreshedSorted);

      // Show success message
      window.dispatchEvent(new CustomEvent('cms-refresh'));
      showNotification('Award order saved successfully!', 'success');
    } catch (error: any) {
      console.error('Error saving award order:', error);
      showNotification('Failed to save award order. Please try again.', 'error');
    } finally {
      setSavingAwardOrder(false);
    }
  };

  // Video Section Handlers
  const handleEditVideoSection = () => {
    setEditingItem(videoSection);
    setFormData({
      videoUrl: videoSection?.videoUrl || '',
      title: videoSection?.title || '',
      description: videoSection?.description || '',
      thumbnailImageId: videoSection?.thumbnailImageId || videoSection?.thumbnailImage?.id || ''
    });
    setModalType('edit');
    setCurrentEntityType('home-video-section');
    setShowModal(true);
  };

  // About Section Handlers
  const handleEditAboutSection = () => {
    setEditingItem(aboutSection);
    
    // Map database fields to form fields
    // DB has: content_paragraph_1, content_paragraph_2, content_paragraph_3, content_paragraph_4
    // Form expects: content_paragraphs (array)
    const paragraphs = [
      aboutSection?.content_paragraph_1 || '',
      aboutSection?.content_paragraph_2 || '',
      aboutSection?.content_paragraph_3 || '',
      aboutSection?.content_paragraph_4 || ''
    ].filter(p => p); // Remove empty paragraphs

    // Build a single text block for the form textarea (blank lines between paragraphs)
    const contentText = paragraphs.length > 0 ? paragraphs.join('\n\n') : '';

    setFormData({
      title: aboutSection?.title || '',
      tagline: aboutSection?.tagline || '',
      content_text: contentText,
      button_text: aboutSection?.button_text || '',
      button_link: aboutSection?.button_link || '',
      logo_image_id: aboutSection?.logo_image_id || aboutSection?.logoImage?.id || '',
      main_image_id: aboutSection?.main_image_id || aboutSection?.mainImage?.id || ''
    });
    setModalType('edit');
    setCurrentEntityType('home-about-section');
    setShowModal(true);
  };

  // Careers Section Handlers
  const handleEditCareersSection = () => {
    setEditingItem(careersSection);
    setFormData({
      tagline: careersSection?.tagline || '',
      title: careersSection?.title || '',
      description: careersSection?.description || '',
      primaryButtonText: careersSection?.primaryButtonText || '',
      primaryButtonLink: careersSection?.primaryButtonLink || '',
      secondaryButtonText: careersSection?.secondaryButtonText || '',
      secondaryButtonLink: careersSection?.secondaryButtonLink || '',
      imageId: careersSection?.imageId || careersSection?.image?.id || ''
    });
    setModalType('edit');
    setCurrentEntityType('home-careers-section');
    setShowModal(true);
  };

  // Newsroom Handlers
  const handleAddNewsroomItem = () => {
    setEditingItem(null);
    setFormData({
      type: 'press',
      title: '',
      excerpt: '',
      link: '',
      badge: 'PRESS RELEASE',
      category: 'press',
      isActive: true,
      isFeatured: false,
      orderIndex: newsroomItems.length + 1,
      publishedAt: new Date().toISOString().split('T')[0],
      featuredImageId: '',
      logo: ''
    });
    setModalType('add');
    setCurrentEntityType('newsroom');
    setShowModal(true);
  };

  const handleEditNewsroomItem = (item: any) => {
    setEditingItem(item);
    setFormData({
      ...item,
      type: item.type || 'press',
      title: item.title || '',
      excerpt: item.excerpt || '',
      link: item.link || '',
      badge: item.badge || 'PRESS RELEASE',
      category: item.category || 'press',
      featuredImageId: item.featuredImageId || item.featuredImage?.id || '',
      logo: item.logo || '',
      image: item.image || item.featuredImageId || '',
      isActive: item.isActive !== undefined ? item.isActive : true,
      isFeatured: item.isFeatured !== undefined ? item.isFeatured : false,
      orderIndex: item.orderIndex || 0,
      publishedAt: item.publishedAt ? new Date(item.publishedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
    });
    setModalType('edit');
    setCurrentEntityType('newsroom');
    setShowModal(true);
  };

  const handleDragDropNewsroom = (draggedId: number, targetId: number) => {
    const draggedIndex = newsroomItems.findIndex((item: any) => item.id === draggedId);
    const targetIndex = newsroomItems.findIndex((item: any) => item.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newItems = [...newsroomItems];
    const [draggedItem] = newItems.splice(draggedIndex, 1);
    newItems.splice(targetIndex, 0, draggedItem);

    // Update orderIndex for all items
    const updatedItems = newItems.map((item: any, index: number) => ({
      ...item,
      orderIndex: index + 1
    }));

    setNewsroomItems(updatedItems);
  };

  const handleSaveNewsroomOrder = async () => {
    try {
      setSavingNewsroomOrder(true);
      // Use the current order of items (already sorted by orderIndex)
      const sortedItems = [...newsroomItems].sort((a: any, b: any) => (a.orderIndex || 0) - (b.orderIndex || 0));
      const itemsToUpdate = sortedItems.map((item: any, index: number) => ({
        id: item.id,
        orderIndex: index + 1
      }));

      // Update each item individually
      await Promise.all(
        itemsToUpdate.map((item: any) =>
          newsroomService.update(item.id, { orderIndex: item.orderIndex })
        )
      );

      // Refresh data
      const news = await newsroomService.getAll();
      const refreshedSorted = news.sort((a: any, b: any) => (a.orderIndex || 0) - (b.orderIndex || 0));
      setNewsroomItems(refreshedSorted);

      // Show success message
      window.dispatchEvent(new CustomEvent('cms-refresh'));
      showNotification('Newsroom order saved successfully!', 'success');
    } catch (error: any) {
      console.error('Error saving newsroom order:', error);
      showNotification('Failed to save newsroom order. Please try again.', 'error');
    } finally {
      setSavingNewsroomOrder(false);
    }
  };

  // CTA Section Handlers
  const handleAddCTASection = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      description: '',
      buttonText: '',
      buttonLink: '',
      variant: 'default',
      isActive: true,
      orderIndex: ctaSections.length + 1
    });
    setModalType('add');
    setCurrentEntityType('home-cta-section');
    setShowModal(true);
  };

  const handleEditCTASection = (item: any) => {
    setEditingItem(item);
    setFormData({
      ...item,
      image: item.imageId || item.image?.id || ''
    });
    setModalType('edit');
    setCurrentEntityType('home-cta-section');
    setShowModal(true);
  };

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    // Create a notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] ${type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
      }`;
    notification.style.transition = 'all 0.3s ease-out';
    notification.style.transform = 'translateX(400px)';
    notification.innerHTML = `
      <i class="ri-${type === 'success' ? 'check-line' : 'error-warning-line'} text-xl"></i>
      <span class="font-medium">${message}</span>
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 10);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.transform = 'translateX(400px)';
      notification.style.opacity = '0';
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 3000);
  };


  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Home Page Management</h2>
        <button
          onClick={() => window.open('/', '_blank')}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          <i className="ri-eye-line"></i>
          Preview Page
        </button>
      </div>

      {/* Home Page Sections Navigation */}
      <div className="bg-white rounded-xl shadow-lg px-4 py-3">
        <div
          className="flex space-x-2 overflow-x-auto items-center"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Hero Slides Tab */}
          <button
            onClick={() => setActiveSection('hero-slides')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'hero-slides'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-image-line text-base"></i>
            <span className="font-medium">Hero Slides</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'hero-slides'
              ? 'bg-blue-200 text-blue-800'
              : 'bg-gray-200 text-gray-600'
              }`}>
              {heroSlides.length}
            </span>
          </button>

          {/* Our Businesses Tab */}
          <button
            onClick={() => setActiveSection('business-cards')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'business-cards'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-star-line text-base"></i>
            <span className="font-medium">Our Businesses</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'business-cards'
              ? 'bg-blue-200 text-blue-800'
              : 'bg-gray-200 text-gray-600'
              }`}>
              {businessCards.length}
            </span>
          </button>

          {/* Awards Tab */}
          <button
            onClick={() => setActiveSection('awards')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'awards'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-award-line text-base"></i>
            <span className="font-medium">Awards</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'awards'
              ? 'bg-blue-200 text-blue-800'
              : 'bg-gray-200 text-gray-600'
              }`}>
              {awards.length}
            </span>
          </button>

          {/* Video Section Tab */}
          <button
            onClick={() => setActiveSection('video-section')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'video-section'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-video-line text-base"></i>
            <span className="font-medium">Video Section</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'video-section'
              ? 'bg-blue-200 text-blue-800'
              : 'bg-gray-200 text-gray-600'
              }`}>
              1
            </span>
          </button>

          {/* About Section Tab */}
          <button
            onClick={() => setActiveSection('about-section')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'about-section'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-information-line text-base"></i>
            <span className="font-medium">About Section</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'about-section'
              ? 'bg-blue-200 text-blue-800'
              : 'bg-gray-200 text-gray-600'
              }`}>
              1
            </span>
          </button>

          {/* Careers Section Tab */}
          <button
            onClick={() => setActiveSection('careers-section')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'careers-section'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-briefcase-line text-base"></i>
            <span className="font-medium">Careers Section</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'careers-section'
              ? 'bg-blue-200 text-blue-800'
              : 'bg-gray-200 text-gray-600'
              }`}>
              1
            </span>
          </button>

          {/* Newsroom Section Tab */}
          <button
            onClick={() => setActiveSection('newsroom-section')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'newsroom-section'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-newspaper-line text-base"></i>
            <span className="font-medium">Newsroom Section</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'newsroom-section'
              ? 'bg-blue-200 text-blue-800'
              : 'bg-gray-200 text-gray-600'
              }`}>
              1
            </span>
          </button>

          {/* CTA Section Tab */}
          <button
            onClick={() => setActiveSection('cta-section')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'cta-section'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-arrow-right-circle-line text-base"></i>
            <span className="font-medium">CTA Section</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'cta-section'
              ? 'bg-blue-200 text-blue-800'
              : 'bg-gray-200 text-gray-600'
              }`}>
              1
            </span>
          </button>

          {/* Dynamic Page Sections Tabs */}
          {sections
            .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))
            .map((section) => (
              <button
                key={section.id}
                onClick={() => {
                  setActiveSection('page-section');
                  setActivePageSection(section.sectionKey);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'page-section' && activePageSection === section.sectionKey
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
              >
                <i className="ri-file-list-line text-base"></i>
                <span className="font-medium capitalize">
                  {section.sectionKey?.replace(/-/g, ' ') || 'Untitled Section'}
                </span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'page-section' && activePageSection === section.sectionKey
                  ? 'bg-blue-200 text-blue-800'
                  : 'bg-gray-200 text-gray-600'
                  }`}>
                  {section.content?.length || 0}
                </span>
              </button>
            ))}
        </div>
      </div>

      {activeSection === 'hero-slides' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-800">Hero Slides Management</h3>
            <div className="flex gap-2">
              <button
                onClick={handleAddHeroSlide}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <i className="ri-add-line"></i>
                Add Slide
              </button>
              {heroSlides.length > 1 && (
                <button
                  onClick={handleSaveOrder}
                  disabled={savingOrder}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i className={savingOrder ? 'ri-loader-4-line animate-spin' : 'ri-save-line'}></i>
                  {savingOrder ? 'Saving...' : 'Save Order'}
                </button>
              )}
            </div>
          </div>

          {/* Drag and Drop Hero Slides List */}
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-12"></th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">PREVIEW</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">TITLE</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">BUTTON TEXT</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ORDER</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">STATUS</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {heroSlides
                    .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))
                    .map((slide) => {
                      // Try multiple ways to get the image path
                      const imagePath = 
                        getImagePath(slide, 'backgroundImage') ||
                        (slide.backgroundImage?.url || slide.backgroundImage?.filePath || '') ||
                        (typeof slide.backgroundImage === 'string' ? slide.backgroundImage : '');

                      return (
                        <tr
                          key={slide.id}
                          draggable
                          onDragStart={(e) => {
                            setDraggedSlide(slide.id);
                            e.dataTransfer.effectAllowed = 'move';
                          }}
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.dataTransfer.dropEffect = 'move';
                            const target = e.currentTarget;
                            if (draggedSlide !== slide.id) {
                              target.classList.add('opacity-50');
                            }
                          }}
                          onDragLeave={(e) => {
                            e.currentTarget.classList.remove('opacity-50');
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            e.currentTarget.classList.remove('opacity-50');
                            if (draggedSlide !== null && draggedSlide !== slide.id) {
                              handleDragDrop(draggedSlide, slide.id);
                            }
                            setDraggedSlide(null);
                          }}
                          onDragEnd={() => {
                            setDraggedSlide(null);
                            document.querySelectorAll('tr').forEach(row => {
                              row.classList.remove('opacity-50');
                            });
                          }}
                          className={`cursor-move hover:bg-gray-50 transition-colors ${draggedSlide === slide.id ? 'opacity-50' : ''}`}
                        >
                          <td className="px-4 py-4 whitespace-nowrap">
                            <i className="ri-drag-move-2-line text-gray-400 text-xl"></i>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <img
                              src={getAssetPath(imagePath)}
                              alt={slide.title || 'Preview'}
                              className="w-20 h-20 object-cover rounded border border-gray-200"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect fill="%23ddd" width="80" height="80"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="12"%3ENo Image%3C/text%3E%3C/svg%3E';
                              }}
                            />
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="font-medium text-gray-900">{slide.title || 'Untitled'}</span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="text-gray-600">{slide.buttonText || '-'}</span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="text-gray-600">{slide.orderIndex || 0}</span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${slide.isActive
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-600'
                              }`}>
                              {slide.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditHeroSlide(slide)}
                                className="text-blue-600 hover:text-blue-900"
                                title="Edit"
                              >
                                <i className="ri-edit-line"></i>
                              </button>
                              <button
                                onClick={() => handleDelete(slide)}
                                className="text-red-600 hover:text-red-900"
                                title="Delete"
                              >
                                <i className="ri-delete-bin-line"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
            {heroSlides.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <i className="ri-image-line text-4xl mb-2"></i>
                <p>No hero slides yet. Click "Add Slide" to create one.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeSection === 'business-cards' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-800">Our Businesses Management</h3>
            <button
              onClick={handleAddBusinessCard}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <i className="ri-add-line"></i>
              Add Card
            </button>
          </div>
          <DataTable
            data={businessCards}
            columns={[
              {
                key: 'title',
                header: 'TITLE',
                render: (value) => <span className="font-medium text-gray-900">{value || 'Untitled'}</span>
              },
              {
                key: 'image',
                header: 'PREVIEW',
                render: (value, item) => {
                  const imagePath = getImagePath(item, 'image') || 
                    (typeof item.image === 'string' ? item.image : '') ||
                    (item.image?.url || item.image?.filePath || '');
                  return (
                    <img
                      src={getAssetPath(imagePath)}
                      alt={item.title || 'Preview'}
                      className="w-20 h-20 object-cover rounded border border-gray-200"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect fill="%23ddd" width="80" height="80"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="12"%3ENo Image%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  );
                }
              },
              {
                key: 'orderIndex',
                header: 'ORDER',
                render: (value) => <span className="text-gray-600">{value || 0}</span>
              },
              {
                key: 'isActive',
                header: 'STATUS',
                render: (value) => (
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${value
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600'
                    }`}>
                    {value ? 'Active' : 'Inactive'}
                  </span>
                )
              }
            ]}
            onEdit={handleEditBusinessCard}
            onDelete={(item) => handleDelete(item, 'business-card')}
          />
        </div>
      )}

      {/* Page Section Content Management */}
      {activeSection === 'page-section' && activePageSection && (
        <div className="space-y-4">
          {(() => {
            const selectedSection = sections.find(s => s.sectionKey === activePageSection);
            if (!selectedSection) return null;

            return (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 capitalize">
                      {selectedSection.sectionKey?.replace(/-/g, ' ')}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                      Type: <span className="capitalize">{selectedSection.sectionType}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => handleEditSectionContent(selectedSection)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <i className="ri-edit-line"></i>
                    Edit Content
                  </button>
                </div>

                {/* Section Contents */}
                {selectedSection.content && selectedSection.content.length > 0 ? (
                  <DataTable
                    data={selectedSection.content}
                    columns={[
                      {
                        key: 'contentKey',
                        header: 'KEY',
                        render: (value) => <span className="font-medium text-gray-900">{value}</span>
                      },
                      {
                        key: 'contentType',
                        header: 'TYPE',
                        render: (value) => <span className="text-gray-600 capitalize">{value || 'text'}</span>
                      },
                      {
                        key: 'contentValue',
                        header: 'VALUE',
                        render: (value, item) => {
                          if (item.contentType === 'json') {
                            try {
                              const parsed = JSON.parse(value || '{}');
                              return <span className="text-gray-600 text-sm">{JSON.stringify(parsed).substring(0, 50)}...</span>;
                            } catch {
                              return <span className="text-gray-600 text-sm">{String(value || '').substring(0, 50)}...</span>;
                            }
                          }
                          return <span className="text-gray-600 text-sm">{String(value || '').substring(0, 100)}</span>;
                        }
                      },
                      {
                        key: 'media',
                        header: 'MEDIA',
                        render: (value, item) => {
                          const mediaPath = getImagePath(item, 'media') ||
                            (item.media?.url || item.media?.filePath || '') ||
                            (item.mediaId && typeof item.mediaId === 'object' ? (item.mediaId.url || item.mediaId.filePath || '') : '');
                          
                          if (mediaPath) {
                            return (
                              <img
                                src={getAssetPath(mediaPath)}
                                alt={item.contentKey || 'Media'}
                                className="w-16 h-16 object-cover rounded border border-gray-200"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64"%3E%3Crect fill="%23ddd" width="64" height="64"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="10"%3ENo Image%3C/text%3E%3C/svg%3E';
                                }}
                              />
                            );
                          }
                          return (
                            <div className="w-16 h-16 bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                              <i className="ri-image-line text-gray-400 text-xs"></i>
                            </div>
                          );
                        }
                      }
                    ]}
                    onEdit={(item) => {
                      // Edit section content
                      handleEditSectionContent(selectedSection);
                    }}
                  />
                ) : (
                  <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <i className="ri-file-list-line text-4xl text-gray-400 mb-2"></i>
                    <p className="text-gray-600 mb-4">No content items in this section</p>
                    <button
                      onClick={() => handleEditSectionContent(selectedSection)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Add Content
                    </button>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* Awards Section */}
      {activeSection === 'awards' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-800">Awards & Accolades Management</h3>
            <div className="flex gap-2">
              <button
                onClick={handleAddAward}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <i className="ri-add-line"></i>
                Add Award
              </button>
              {awards.length > 1 && (
                <button
                  onClick={handleSaveAwardOrder}
                  disabled={savingAwardOrder}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i className={savingAwardOrder ? 'ri-loader-4-line animate-spin' : 'ri-save-line'}></i>
                  {savingAwardOrder ? 'Saving...' : 'Save Order'}
                </button>
              )}
            </div>
          </div>

          {/* Drag and Drop Awards List */}
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-12"></th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">PREVIEW</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">TITLE</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">TYPE</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ORDER</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">STATUS</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {awards
                    .sort((a: any, b: any) => (a.orderIndex || a.order || 0) - (b.orderIndex || b.order || 0))
                    .map((award: any) => {
                      const imagePath = getImagePath(award, 'image') ||
                        (typeof award.image === 'string' ? award.image : '') ||
                        (award.image?.url || award.image?.filePath || '');

                      return (
                        <tr
                          key={award.id}
                          draggable
                          onDragStart={(e) => {
                            setDraggedAward(award.id);
                            e.dataTransfer.effectAllowed = 'move';
                          }}
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.dataTransfer.dropEffect = 'move';
                            const target = e.currentTarget;
                            if (draggedAward !== award.id) {
                              target.classList.add('opacity-50');
                            }
                          }}
                          onDragLeave={(e) => {
                            e.currentTarget.classList.remove('opacity-50');
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            e.currentTarget.classList.remove('opacity-50');
                            if (draggedAward !== null && draggedAward !== award.id) {
                              handleDragDropAward(draggedAward, award.id);
                            }
                            setDraggedAward(null);
                          }}
                          onDragEnd={() => {
                            setDraggedAward(null);
                            document.querySelectorAll('tr').forEach(row => {
                              row.classList.remove('opacity-50');
                            });
                          }}
                          className={`cursor-move hover:bg-gray-50 transition-colors ${draggedAward === award.id ? 'opacity-50' : ''}`}
                        >
                          <td className="px-4 py-4 whitespace-nowrap">
                            <i className="ri-drag-move-2-line text-gray-400 text-xl"></i>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <img
                              src={getAssetPath(imagePath)}
                              alt={award.title || 'Preview'}
                              className="w-20 h-20 object-cover rounded border border-gray-200"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect fill="%23ddd" width="80" height="80"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="12"%3ENo Image%3C/text%3E%3C/svg%3E';
                              }}
                            />
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span 
                              className="font-medium text-gray-900" 
                              dangerouslySetInnerHTML={{ __html: award.title || 'Untitled' }}
                            />
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 rounded text-xs font-semibold capitalize bg-blue-100 text-blue-700">
                              {award.type || award.awardType || 'standard'}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="text-gray-600">{award.orderIndex || award.order || 0}</span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${award.isActive
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-600'
                              }`}>
                              {award.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditAward(award)}
                                className="text-blue-600 hover:text-blue-900"
                                title="Edit"
                              >
                                <i className="ri-edit-line"></i>
                              </button>
                              <button
                                onClick={() => handleDelete(award, 'award')}
                                className="text-red-600 hover:text-red-900"
                                title="Delete"
                              >
                                <i className="ri-delete-bin-line"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
            {awards.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <i className="ri-award-line text-4xl mb-2"></i>
                <p>No awards yet. Click "Add Award" to create one.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Video Section */}
      {activeSection === 'video-section' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-800">Video Section Management</h3>
            <button
              onClick={handleEditVideoSection}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <i className="ri-edit-line"></i>
              Edit Section
            </button>
          </div>
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
            {videoSection ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 font-medium uppercase mb-1">Title</p>
                    <p className="text-gray-900 font-medium text-lg mb-4">{videoSection.title || '-'}</p>
                    <p className="text-sm text-gray-500 font-medium uppercase mb-1">Description</p>
                    <p className="text-gray-900 mb-4 text-sm leading-relaxed">{videoSection.description || '-'}</p>
                    <p className="text-sm text-gray-500 font-medium uppercase mb-1">Video URL</p>
                    <div className="bg-gray-100 p-3 rounded text-sm text-gray-700 break-all mb-4">
                      {videoSection.videoUrl || 'No video URL set'}
                    </div>
                    {videoSection.videoUrl && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-500 font-medium uppercase mb-2">Video Preview</p>
                        <div className="aspect-video bg-gray-100 rounded border border-gray-200 overflow-hidden">
                          <iframe
                            src={videoSection.videoUrl}
                            className="w-full h-full"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title="Video Preview"
                          ></iframe>
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium uppercase mb-2">Thumbnail Image</p>
                    {(() => {
                      const thumbnailPath = getImagePath(videoSection, 'thumbnailImage') ||
                        (videoSection.thumbnailImage?.url || videoSection.thumbnailImage?.filePath || '');
                      const assetPath = thumbnailPath ? getAssetPath(thumbnailPath) : '';
                      return assetPath && assetPath.trim() !== '' ? (
                        <img
                          src={assetPath}
                          alt="Video Thumbnail"
                          className="w-full max-w-md h-64 object-cover rounded border border-gray-200"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="256"%3E%3Crect fill="%23ddd" width="400" height="256"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="14"%3ENo Thumbnail%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      ) : (
                        <div className="w-full max-w-md h-64 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-gray-400">
                          <div className="text-center">
                            <i className="ri-image-line text-4xl mb-2"></i>
                            <p className="text-sm">No thumbnail image</p>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <i className="ri-video-line text-4xl text-gray-400 mb-2"></i>
                <p className="text-gray-500 italic">No video section data found. Click "Edit Section" to create one.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* About Section */}
      {activeSection === 'about-section' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-800">About Section Management</h3>
            <button
              onClick={handleEditAboutSection}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <i className="ri-edit-line"></i>
              Edit Section
            </button>
          </div>
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
            {aboutSection ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 font-medium uppercase mb-1">Title</p>
                    <p className="text-gray-900 font-medium text-lg mb-4">{aboutSection.title || '-'}</p>
                    <p className="text-sm text-gray-500 font-medium uppercase mb-1">Tagline</p>
                    <p className="text-gray-900 mb-4">{aboutSection.tagline || '-'}</p>
                    <p className="text-sm text-gray-500 font-medium uppercase mb-1">Button Text</p>
                    <p className="text-gray-900 mb-4">{aboutSection.button_text || '-'}</p>
                    <p className="text-sm text-gray-500 font-medium uppercase mb-1">Button Link</p>
                    <p className="text-gray-900 mb-4">{aboutSection.button_link || '-'}</p>
                  </div>
                  <div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500 font-medium uppercase mb-2">Logo Image</p>
                        {(() => {
                          const logoPath = getImagePath(aboutSection, 'logoImage') ||
                            (aboutSection.logoImage?.url || aboutSection.logoImage?.filePath || '');
                          return logoPath ? (
                            <img
                              src={getAssetPath(logoPath)}
                              alt="Logo"
                              className="w-32 h-32 object-contain rounded border border-gray-200 bg-white p-2"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="128" height="128"%3E%3Crect fill="%23ddd" width="128" height="128"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="12"%3ENo Logo%3C/text%3E%3C/svg%3E';
                              }}
                            />
                          ) : (
                            <div className="w-32 h-32 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-gray-400 text-xs">
                              No Logo
                            </div>
                          );
                        })()}
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium uppercase mb-2">Main Image</p>
                        {(() => {
                          const mainImagePath = getImagePath(aboutSection, 'mainImage') ||
                            (aboutSection.mainImage?.url || aboutSection.mainImage?.filePath || '');
                          return mainImagePath ? (
                            <img
                              src={getAssetPath(mainImagePath)}
                              alt="Main Image"
                              className="w-full max-w-md h-48 object-cover rounded border border-gray-200"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="200"%3E%3Crect fill="%23ddd" width="400" height="200"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="14"%3ENo Image%3C/text%3E%3C/svg%3E';
                              }}
                            />
                          ) : (
                            <div className="w-full max-w-md h-48 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-gray-400">
                              No Image
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium uppercase mb-2">Content Paragraphs</p>
                  <div className="space-y-2">
                    {aboutSection.content_paragraph_1 && (
                      <p className="text-gray-700 text-sm leading-relaxed p-3 bg-gray-50 rounded border border-gray-200">
                        <span className="font-semibold text-gray-600">Paragraph 1:</span> {aboutSection.content_paragraph_1}
                      </p>
                    )}
                    {aboutSection.content_paragraph_2 && (
                      <p className="text-gray-700 text-sm leading-relaxed p-3 bg-gray-50 rounded border border-gray-200">
                        <span className="font-semibold text-gray-600">Paragraph 2:</span> {aboutSection.content_paragraph_2}
                      </p>
                    )}
                    {aboutSection.content_paragraph_3 && (
                      <p className="text-gray-700 text-sm leading-relaxed p-3 bg-gray-50 rounded border border-gray-200">
                        <span className="font-semibold text-gray-600">Paragraph 3:</span> {aboutSection.content_paragraph_3}
                      </p>
                    )}
                    {aboutSection.content_paragraph_4 && (
                      <p className="text-gray-700 text-sm leading-relaxed p-3 bg-gray-50 rounded border border-gray-200">
                        <span className="font-semibold text-gray-600">Paragraph 4:</span> {aboutSection.content_paragraph_4}
                      </p>
                    )}
                    {!aboutSection.content_paragraph_1 && !aboutSection.content_paragraph_2 && 
                     !aboutSection.content_paragraph_3 && !aboutSection.content_paragraph_4 && (
                      <p className="text-gray-500 italic text-sm">No paragraphs added yet.</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <i className="ri-file-text-line text-4xl text-gray-400 mb-2"></i>
                <p className="text-gray-500 italic">No about section data found. Click "Edit Section" to create one.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Careers Section */}
      {activeSection === 'careers-section' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-800">Careers Section Management</h3>
            <button
              onClick={handleEditCareersSection}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <i className="ri-edit-line"></i>
              Edit Section
            </button>
          </div>
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
            {careersSection ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 font-medium uppercase mb-1">Tagline</p>
                    <p className="text-gray-900 font-medium text-sm mb-4">{careersSection.tagline || '-'}</p>
                    <p className="text-sm text-gray-500 font-medium uppercase mb-1">Title</p>
                    <div className="text-gray-900 font-medium text-lg mb-4" dangerouslySetInnerHTML={{ __html: careersSection.title || '-' }}></div>
                    <p className="text-sm text-gray-500 font-medium uppercase mb-1">Description</p>
                    <p className="text-gray-900 mb-4 text-sm leading-relaxed">{careersSection.description || '-'}</p>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-sm text-gray-500 font-medium uppercase mb-1">Primary Button</p>
                        <p className="text-gray-900 text-sm mb-1">{careersSection.primaryButtonText || '-'}</p>
                        <p className="text-gray-600 text-xs break-all">{careersSection.primaryButtonLink || '-'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium uppercase mb-1">Secondary Button</p>
                        <p className="text-gray-900 text-sm mb-1">{careersSection.secondaryButtonText || '-'}</p>
                        <p className="text-gray-600 text-xs break-all">{careersSection.secondaryButtonLink || '-'}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium uppercase mb-2">Side Image</p>
                    {(() => {
                      const imagePath = getImagePath(careersSection, 'image') ||
                        (careersSection.image?.url || careersSection.image?.filePath || '');
                      return imagePath ? (
                        <img
                          src={getAssetPath(imagePath)}
                          alt="Careers Section"
                          className="w-full max-w-md h-64 object-cover rounded border border-gray-200"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="256"%3E%3Crect fill="%23ddd" width="400" height="256"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="14"%3ENo Image%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      ) : (
                        <div className="w-full max-w-md h-64 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-gray-400">
                          <div className="text-center">
                            <i className="ri-image-line text-4xl mb-2"></i>
                            <p className="text-sm">No image</p>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <i className="ri-briefcase-line text-4xl text-gray-400 mb-2"></i>
                <p className="text-gray-500 italic">No careers section data found. Click "Edit Section" to create one.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Newsroom Section - Drag and Drop */}
      {activeSection === 'newsroom-section' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-800">Newsroom Management</h3>
            <div className="flex gap-2">
              <button
                onClick={handleAddNewsroomItem}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <i className="ri-add-line"></i>
                Add Item
              </button>
              {newsroomItems.length > 1 && (
                <button
                  onClick={handleSaveNewsroomOrder}
                  disabled={savingNewsroomOrder}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i className={savingNewsroomOrder ? 'ri-loader-4-line animate-spin' : 'ri-save-line'}></i>
                  {savingNewsroomOrder ? 'Saving...' : 'Save Order'}
                </button>
              )}
            </div>
          </div>

          {/* Drag and Drop Newsroom Items List */}
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-12"></th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">PREVIEW</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">TITLE</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">TYPE</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">DATE</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ORDER</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">STATUS</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {newsroomItems
                    .sort((a: any, b: any) => (a.orderIndex || 0) - (b.orderIndex || 0))
                    .map((item: any) => {
                      const imagePath = getImagePath(item, 'featuredImage') ||
                        (item.featuredImage?.url || item.featuredImage?.filePath || '');

                      return (
                        <tr
                          key={item.id}
                          draggable
                          onDragStart={(e) => {
                            setDraggedNewsroomItem(item.id);
                            e.dataTransfer.effectAllowed = 'move';
                          }}
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.dataTransfer.dropEffect = 'move';
                            const target = e.currentTarget;
                            if (draggedNewsroomItem !== item.id) {
                              target.classList.add('opacity-50');
                            }
                          }}
                          onDragLeave={(e) => {
                            e.currentTarget.classList.remove('opacity-50');
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            e.currentTarget.classList.remove('opacity-50');
                            if (draggedNewsroomItem !== null && draggedNewsroomItem !== item.id) {
                              handleDragDropNewsroom(draggedNewsroomItem, item.id);
                            }
                            setDraggedNewsroomItem(null);
                          }}
                          onDragEnd={() => {
                            setDraggedNewsroomItem(null);
                            document.querySelectorAll('tr').forEach(row => {
                              row.classList.remove('opacity-50');
                            });
                          }}
                          className={`cursor-move hover:bg-gray-50 transition-colors ${draggedNewsroomItem === item.id ? 'opacity-50' : ''}`}
                        >
                          <td className="px-4 py-4 whitespace-nowrap">
                            <i className="ri-drag-move-2-line text-gray-400 text-xl"></i>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            {imagePath ? (
                              <img
                                src={getAssetPath(imagePath)}
                                alt={item.title || 'Preview'}
                                className="w-20 h-20 object-cover rounded border border-gray-200"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect fill="%23ddd" width="80" height="80"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="12"%3ENo Image%3C/text%3E%3C/svg%3E';
                                }}
                              />
                            ) : (
                              <div className="w-20 h-20 bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                                <i className="ri-image-line text-gray-400 text-xl"></i>
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="font-medium text-gray-900">{item.title || 'Untitled'}</span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded text-xs font-semibold capitalize ${item.type === 'press' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                              }`}>
                              {item.type || 'press'}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="text-gray-600">{item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : '-'}</span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="text-gray-600">{item.orderIndex || 0}</span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${item.isActive
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-600'
                              }`}>
                              {item.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditNewsroomItem(item)}
                                className="text-blue-600 hover:text-blue-900"
                                title="Edit"
                              >
                                <i className="ri-edit-line"></i>
                              </button>
                              <button
                                onClick={() => handleDelete(item, 'newsroom')}
                                className="text-red-600 hover:text-red-900"
                                title="Delete"
                              >
                                <i className="ri-delete-bin-line"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
            {newsroomItems.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <i className="ri-newspaper-line text-4xl mb-2"></i>
                <p>No newsroom items yet. Click "Add Item" to create one.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CTA Section - Placeholder */}
      {activeSection === 'cta-section' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-800">CTA Cards Management</h3>
            <button
              onClick={handleAddCTASection}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <i className="ri-add-line"></i>
              Add Card
            </button>
          </div>

          <DataTable
            data={ctaSections}
            columns={[
              {
                key: 'title',
                header: 'TITLE',
                render: (value) => <span className="font-medium text-gray-900">{value || 'Untitled'}</span>
              },
              {
                key: 'buttonText',
                header: 'BUTTON',
              },
              {
                key: 'image',
                header: 'PREVIEW',
                render: (value, item) => {
                  const imagePath = getImagePath(item, 'image') ||
                    (item.image?.url || item.image?.filePath || '');
                  return imagePath ? (
                    <img
                      src={getAssetPath(imagePath)}
                      alt=""
                      className="w-12 h-12 object-cover rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="48" height="48"%3E%3Crect fill="%23ddd" width="48" height="48"/%3E%3C/svg%3E';
                      }}
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                      <i className="ri-image-line text-gray-400"></i>
                    </div>
                  );
                }
              },
              {
                key: 'orderIndex',
                header: 'ORDER',
              },
              {
                key: 'isActive',
                header: 'STATUS',
                render: (value) => (
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${value
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600'
                    }`}>
                    {value ? 'Active' : 'Inactive'}
                  </span>
                )
              }
            ]}
            onEdit={handleEditCTASection}
            onDelete={(item) => handleDelete(item, 'home-cta-section')}
          />
        </div>
      )}
    </div>
  );
}

