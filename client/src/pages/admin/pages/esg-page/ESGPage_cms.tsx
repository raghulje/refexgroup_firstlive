import { useState, useEffect } from 'react';
import { DataTable } from '../../shared/DataTable';
import { getAssetPath } from '../../shared/utils';

import type { CMSComponentProps } from '../../shared/types';
import { pagesService, sectionsService, sectionContentService, sdgCardsService } from '../../../../services/apiService';

interface ESGPageProps extends Partial<CMSComponentProps> {
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
  uploadImageUtil: (file: File) => Promise<string | null>;
  uploadingImage: boolean;
  setUploadingImage: (uploading: boolean) => void;
  setCurrentEntityType: (type: string) => void;
}

export default function ESGPage_cms({
  setShowModal,
  setModalType,
  setEditingItem,
  setFormData,
  handleDelete,
  setCurrentEntityType
}: ESGPageProps) {
  const [activeSection, setActiveSection] = useState('hero');
  const [esgPage, setEsgPage] = useState<any>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [sdgCards, setSdgCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [threePillars, setThreePillars] = useState<any[]>([]);
  const [tabsData, setTabsData] = useState<any[]>([]);
  const [policies, setPolicies] = useState<any[]>([]);

  const [savingPillarsOrder, setSavingPillarsOrder] = useState(false);
  const [savingPolicies, setSavingPolicies] = useState(false);

  useEffect(() => {
    fetchESGData();
  }, []);

  useEffect(() => {
    const handleRefresh = async () => {
      // Add a delay to ensure database has been updated and committed
      await new Promise(resolve => setTimeout(resolve, 300));
      // Force a fresh fetch of all data
      await fetchESGData();
    };
    window.addEventListener('cms-refresh', handleRefresh);
    return () => window.removeEventListener('cms-refresh', handleRefresh);
  }, []);

  const fetchESGData = async () => {
    try {
      setLoading(true);
      const page = await pagesService.getBySlug('esg');
      setEsgPage(page);

      const pageSections = await sectionsService.getByPageId(page.id);
      // Create a new array reference to ensure React detects the change
      setSections([...pageSections]);

      try {
        const cards = await sdgCardsService.getAll();
        console.log('SDG Cards fetched:', cards);
        console.log('SDG Cards type:', typeof cards, 'Is Array:', Array.isArray(cards));
        if (Array.isArray(cards)) {
          console.log('Setting SDG cards:', cards.length, 'items');
          setSdgCards(cards);
        } else if (cards && typeof cards === 'object') {
          // Handle case where API returns { data: [...] } or wrapped response
          const dataArray = (cards as any).data || (cards as any).cards || [];
          console.log('Extracted data array:', dataArray.length, 'items');
          setSdgCards(Array.isArray(dataArray) ? dataArray : []);
        } else {
          console.warn('Unexpected SDG cards format:', cards);
          setSdgCards([]);
        }
      } catch (error) {
        console.error('Error fetching SDG cards:', error);
        setSdgCards([]);
      }

      // Parse Three Pillars
      const pillarsSection = pageSections.find(s => s.sectionKey === 'three-pillars');
      if (pillarsSection?.content) {
        const pillarsContent = pillarsSection.content.find((c: any) => c.contentKey === 'pillars');
        if (pillarsContent && pillarsContent.contentType === 'json') {
          try {
            const parsed = JSON.parse(pillarsContent.contentValue);
            const pillarsArray = Array.isArray(parsed) ? parsed : [];
            
            // Process images to resolve media IDs to actual filePaths for preview (if needed)
            const { mediaService } = await import('../../../../services/apiService');
            const processedPillars = await Promise.all(pillarsArray.map(async (pillar: any) => {
              if (pillar.image) {
                // If image is already a direct path (starts with /uploads/images/), use it as-is
                if (typeof pillar.image === 'string' && pillar.image.startsWith('/uploads/images/')) {
                  return pillar; // Already a direct path, no need to fetch
                }
                // If image is a number (media ID), fetch the actual filePath
                if (typeof pillar.image === 'number' && pillar.image > 0) {
                  try {
                    const media = await mediaService.getById(pillar.image);
                    if (media?.filePath) {
                      return { ...pillar, image: media.filePath };
                    }
                  } catch (error) {
                    console.warn(`Could not fetch media filePath for ID ${pillar.image}:`, error);
                  }
                }
                // If image is /uploads/media/{id}, extract ID and fetch filePath
                else if (typeof pillar.image === 'string' && pillar.image.startsWith('/uploads/media/')) {
                  const mediaIdMatch = pillar.image.match(/\/uploads\/media\/(\d+)/);
                  if (mediaIdMatch) {
                    try {
                      const mediaId = parseInt(mediaIdMatch[1]);
                      const media = await mediaService.getById(mediaId);
                      if (media?.filePath) {
                        return { ...pillar, image: media.filePath };
                      }
                    } catch (error) {
                      console.warn(`Could not fetch media filePath for ${pillar.image}:`, error);
                    }
                  }
                }
              }
              return pillar;
            }));
            // Ensure each pillar has an id and proper orderIndex (use processedPillars with resolved images)
            const pillarsWithIds = processedPillars.map((pillar: any, index: number) => ({
              ...pillar,
              id: pillar.id || `pillar-${index}-${Date.now()}`,
              order: pillar.order !== undefined ? pillar.order : index,
              orderIndex: pillar.orderIndex !== undefined ? pillar.orderIndex : index
            }));
            // Sort by orderIndex
            const sortedPillars = pillarsWithIds.sort((a: any, b: any) => {
              const orderA = a.orderIndex !== undefined ? a.orderIndex : (a.order !== undefined ? a.order : 0);
              const orderB = b.orderIndex !== undefined ? b.orderIndex : (b.order !== undefined ? b.order : 0);
              return orderA - orderB;
            });
            setThreePillars(sortedPillars);
          } catch (e) {
            console.error('Error parsing pillars:', e);
            setThreePillars([]);
          }
        }
      }

      // Parse Tabs
      const tabsSection = pageSections.find(s => s.sectionKey === 'tabs');
      if (tabsSection?.content) {
        const tabsContent = tabsSection.content.find((c: any) => c.contentKey === 'tabs');
        if (tabsContent && tabsContent.contentType === 'json') {
          try {
            const parsed = JSON.parse(tabsContent.contentValue);
            const tabsArray = Array.isArray(parsed) ? parsed : [];
            // Process tabs - convert image paths to format for display
            // For display, we keep paths as-is (they'll be resolved by getAssetPath)
            setTabsData(tabsArray);
          } catch (e) {
            console.error('Error parsing tabs:', e);
            setTabsData([]);
          }
        }
      }

      // Parse Policies
      const policiesSection = pageSections.find(s => s.sectionKey === 'policies');
      if (policiesSection?.content) {
        const policiesContent = policiesSection.content.find((c: any) => c.contentKey === 'policies');
        if (policiesContent && policiesContent.contentType === 'json') {
          try {
            const parsed = JSON.parse(policiesContent.contentValue);
            // Ensure all policies have stable IDs for drag-drop
            const policiesWithIds = Array.isArray(parsed)
              ? parsed.map((policy: any, index: number) => ({
                ...policy,
                id: policy.id || `policy-${index}-${Date.now()}`,
                order: policy.order || index + 1
              }))
              : [];
            setPolicies(policiesWithIds);
          } catch (e) {
            console.error('Error parsing policies:', e);
            setPolicies([]);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching ESG data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSectionByKey = (key: string) => {
    return sections.find(s => s.sectionKey === key);
  };

  const getContentValue = (section: any, key: string) => {
    if (!section?.content) return '';
    const contentItem = section.content.find((c: any) => c.contentKey === key);
    return contentItem?.contentValue || '';
  };



  const handleEditSectionContent = async (section: any) => {
    if (!esgPage?.id) return;

    try {
      // Find section if not provided
      let targetSection = section;
      if (!targetSection) {
        targetSection = getSectionByKey(section);
      }

      // If not found, create it
      if (!targetSection) {
        targetSection = await sectionsService.create({
          pageId: esgPage.id,
          sectionKey: section.sectionKey || section,
          sectionType: 'content',
          isActive: true,
          orderIndex: 0
        });

        // Refresh sections
        const updatedSections = await sectionsService.getByPageId(esgPage.id);
        setSections(updatedSections);
        targetSection = updatedSections.find((s: any) => s.sectionKey === (section.sectionKey || section));
      }

      if (!targetSection) return;

      // Prepare form data from section content
      const contentData: any = {
        sectionId: targetSection.id,
        _section: targetSection
      };

      // Populate form data from content items
      if (targetSection.content && targetSection.content.length > 0) {
        targetSection.content.forEach((item: any) => {
          // If it's JSON content, parse it and process images within
          if (item.contentType === 'json') {
            try {
              const parsed = JSON.parse(item.contentValue);
              
              // Special handling for tabs - convert image paths to format ImageUpload expects
              if (item.contentKey === 'tabs' && Array.isArray(parsed)) {
                const processedTabs = parsed.map((tab: any) => {
                  const processedTab = { ...tab };
                  
                  // Convert stored image path to format ImageUpload expects
                  if (processedTab.image) {
                    if (typeof processedTab.image === 'number' && processedTab.image > 0) {
                      // Already a media ID - keep as-is
                      processedTab.image = processedTab.image;
                    } else if (typeof processedTab.image === 'string') {
                      const imageStr = processedTab.image.trim();
                      
                      if (imageStr === '') {
                        processedTab.image = '';
                      } else if (imageStr.startsWith('/uploads/media/')) {
                        // Extract media ID from /uploads/media/{id} format
                        const mediaIdMatch = imageStr.match(/\/uploads\/media\/(\d+)/);
                        if (mediaIdMatch) {
                          processedTab.image = parseInt(mediaIdMatch[1]);
                        } else {
                          processedTab.image = imageStr; // Keep as path if can't extract
                        }
                      } else if (imageStr.startsWith('/uploads/images/') || 
                                 imageStr.startsWith('http://') || 
                                 imageStr.startsWith('https://')) {
                        // Direct path or URL - use as string
                        processedTab.image = imageStr;
                      } else if (/^\d+$/.test(imageStr)) {
                        // Numeric string - convert to number
                        processedTab.image = parseInt(imageStr);
                      } else if (imageStr.startsWith('/assets/')) {
                        // Old /assets/ path - clear it
                        processedTab.image = '';
                      } else {
                        // Other string - use as-is
                        processedTab.image = imageStr;
                      }
                    }
                  }
                  
                  return processedTab;
                });
                
                contentData[item.contentKey] = processedTabs;
              } else {
                // For other JSON content, parse normally
                contentData[item.contentKey] = parsed;
              }
            } catch {
              contentData[item.contentKey] = item.contentValue;
            }
          } else {
            // For image fields, prioritize mediaId over contentValue
            const imageFields = ['backgroundImage', 'image', 'logo', 'backgroundPattern', 'timelineImage', 'coverImage'];
            if (imageFields.includes(item.contentKey)) {
              // Check for mediaId first (from relationship)
              if (item.mediaId) {
                contentData[item.contentKey] = item.mediaId;
              }
              // Check if media relationship exists
              else if (item.media && item.media.id) {
                contentData[item.contentKey] = item.media.id;
              }
              // Check if contentValue is a path like /uploads/media/123 and extract ID
              else if (item.contentValue && typeof item.contentValue === 'string' && item.contentValue.startsWith('/uploads/media/')) {
                const mediaIdMatch = item.contentValue.match(/\/uploads\/media\/(\d+)/);
                if (mediaIdMatch) {
                  contentData[item.contentKey] = parseInt(mediaIdMatch[1]);
                } else {
                  contentData[item.contentKey] = item.contentValue;
                }
              } else {
                // For text content or other values, use the contentValue
                contentData[item.contentKey] = item.contentValue;
              }
            } else {
              // For text content, use the contentValue
              contentData[item.contentKey] = item.contentValue;
            }
          }
        });
      }

      setEditingItem(targetSection);
      setFormData(contentData);
      setModalType('edit');

      // Special handling for ESG CTA section
      if (targetSection.sectionKey === 'cta') {
        setCurrentEntityType('section-content-cta-esg');
      } else {
        setCurrentEntityType(`section-content-${targetSection.sectionKey}`);
      }

      setShowModal(true);
    } catch (error) {
      console.error('Error handling section:', error);
    }
  };

  // Helper function to get image path from content value or media object
  const getImagePath = (section: any, key: string) => {
    if (!section?.content) return '';
    const contentItem = section.content.find((c: any) => c.contentKey === key);
    if (!contentItem) return '';

    // If there's a media relationship, use it
    if (contentItem.media?.filePath) {
      return contentItem.media.filePath;
    }
    if (contentItem.media?.url) {
      return contentItem.media.url;
    }

    // Otherwise use contentValue
    return contentItem.contentValue || '';
  };

  const handleDragDropPillars = (draggedId: number | string, targetId: number | string) => {
    // Find items by id or by index if id doesn't exist
    const draggedIndex = threePillars.findIndex(p =>
      p.id === draggedId ||
      p.id === String(draggedId) ||
      (typeof draggedId === 'number' && threePillars.indexOf(p) === draggedId)
    );
    const targetIndex = threePillars.findIndex(p =>
      p.id === targetId ||
      p.id === String(targetId) ||
      (typeof targetId === 'number' && threePillars.indexOf(p) === targetId)
    );

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newPillars = [...threePillars];
    const [draggedItem] = newPillars.splice(draggedIndex, 1);
    newPillars.splice(targetIndex, 0, draggedItem);

    // Update order indices (starting from 0, matching home page pattern)
    const updatedPillars = newPillars.map((pillar, index) => ({
      ...pillar,
      order: index,
      orderIndex: index // Add orderIndex for consistency
    }));

    setThreePillars(updatedPillars);
  };

  const handleSavePillarsOrder = async () => {
    if (!esgPage?.id || !pillarsSection?.id) return;

    try {
      setSavingPillarsOrder(true);

      // Sort pillars by order/orderIndex to ensure correct order
      const sortedPillars = [...threePillars].sort((a, b) => {
        const orderA = a.orderIndex !== undefined ? a.orderIndex : (a.order !== undefined ? a.order : 0);
        const orderB = b.orderIndex !== undefined ? b.orderIndex : (b.order !== undefined ? b.order : 0);
        return orderA - orderB;
      });

      // Update order indices to be sequential (0, 1, 2, ...)
      const updatedPillars = sortedPillars.map((pillar, index) => ({
        ...pillar,
        order: index,
        orderIndex: index
      }));

      const pillarsContent = pillarsSection.content?.find((c: any) => c.contentKey === 'pillars');

      // We need to update the existing content
      if (pillarsContent) {
        await sectionContentService.update(pillarsContent.id, {
          contentValue: JSON.stringify(updatedPillars),
          contentType: 'json'
        });

        // Update local state
        setThreePillars(updatedPillars);

        // Refresh data to ensure consistency
        await fetchESGData();

        // Show success notification
        window.dispatchEvent(new CustomEvent('cms-refresh'));
        showNotification('Pillars order saved successfully!', 'success');
      }
    } catch (error) {
      console.error('Error saving pillars order:', error);
      showNotification('Failed to save pillars order. Please try again.', 'error');
    } finally {
      setSavingPillarsOrder(false);
    }
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

  const handleAddThreePillar = () => {
    setEditingItem({ section: pillarsSection });
    // Generate a unique ID for the new pillar
    const newId = `pillar-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setFormData({
      id: newId,
      title: '',
      description: '',
      image: '',
      link: '',
      order: threePillars.length,
      orderIndex: threePillars.length
    });
    setModalType('add');
    setCurrentEntityType('three-pillar-card');
    setShowModal(true);
  };

  const handleEditThreePillar = (pillar: any, index?: number) => {
    const idx = index !== undefined ? index : threePillars.findIndex(p => p.id === pillar.id || p === pillar);
    // Ensure pillar has an id
    const pillarWithId = {
      ...pillar,
      id: pillar.id || `pillar-${idx}-${Date.now()}`
    };
    setEditingItem({ ...pillarWithId, index: idx, section: pillarsSection });

    // Convert stored image to format ImageUpload expects
    // ImageUpload accepts: number (media ID) or string (path/URL)
    // We now store media IDs as numbers, but handle legacy string paths too
    let imageValueForForm: string | number = '';

    if (pillar.image !== undefined && pillar.image !== null && pillar.image !== '') {
      if (typeof pillar.image === 'number' && pillar.image > 0) {
        // Already a media ID - use as-is (preferred format)
        imageValueForForm = pillar.image;
      } else if (typeof pillar.image === 'string') {
        const imageStr = pillar.image.trim();
        
        if (imageStr === '') {
          imageValueForForm = '';
        } else if (imageStr.startsWith('/uploads/media/')) {
          // Extract media ID from /uploads/media/{id} format
          const mediaIdMatch = imageStr.match(/\/uploads\/media\/(\d+)/);
          if (mediaIdMatch) {
            imageValueForForm = parseInt(mediaIdMatch[1]);
          } else {
            // Can't extract ID, use path as-is (ImageUpload supports allowUrl={true})
            imageValueForForm = imageStr;
          }
        } else if (imageStr.startsWith('/uploads/images/') || 
                   imageStr.startsWith('/uploads/') ||
                   imageStr.startsWith('http://') || 
                   imageStr.startsWith('https://')) {
          // Direct path or URL - use as string (ImageUpload supports allowUrl={true})
          imageValueForForm = imageStr;
        } else if (/^\d+$/.test(imageStr)) {
          // Numeric string - convert to number
          imageValueForForm = parseInt(imageStr);
        } else if (imageStr.startsWith('/assets/')) {
          // Old /assets/ path - clear it to force re-upload
          imageValueForForm = '';
        } else {
          // Other string - use as-is
          imageValueForForm = imageStr;
        }
      }
    }

    setFormData({
      ...pillarWithId,
      image: imageValueForForm,
      link: pillar.link || '',
      order: pillar.order !== undefined ? pillar.order : idx,
      orderIndex: pillar.orderIndex !== undefined ? pillar.orderIndex : idx
    });
    setModalType('edit');
    setCurrentEntityType('three-pillar-card');
    setShowModal(true);
  };

  const handleAddSDGCard = () => {
    setEditingItem(null);
    setFormData({
      sdgNumber: '',
      title: '',
      description: '',
      contribution: '',
      icon: '',
      iconId: '',
      banner: '',
      bannerId: '',
      image: '',
      imageId: '',
      color: '#7cb342',
      orderIndex: sdgCards.length,
      isActive: true
    });
    setModalType('add');
    setCurrentEntityType('sdg-card');
    setShowModal(true);
  };

  const handleEditSDGCard = (card: any) => {
    setEditingItem(card);
    setFormData({
      ...card,
      icon: card.iconId || card.icon?.id || card.icon?.filePath || card.icon?.url || '',
      iconId: card.iconId || card.icon?.id || '',
      banner: card.bannerId || card.banner?.id || card.banner?.filePath || card.banner?.url || card.image || card.imageId || '',
      bannerId: card.bannerId || card.banner?.id || card.imageId || '',
      image: card.bannerId || card.banner?.id || card.banner?.filePath || card.banner?.url || card.image || card.imageId || '',
      imageId: card.bannerId || card.banner?.id || card.imageId || ''
    });
    setModalType('edit');
    setCurrentEntityType('sdg-card');
    setShowModal(true);
  };

  const handleAddPolicy = () => {
    // Determine new order index and generate unique ID
    const maxOrder = policies.length > 0 ? Math.max(...policies.map(p => p.order || 0)) : 0;
    const newId = `policy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    setFormData({
      id: newId,
      title: '',
      link: '',
      label: '',
      order: maxOrder + 1,
      mediaId: null
    });
    setEditingItem(null);
    setModalType('add');
    setCurrentEntityType('policy');
    setShowModal(true);
  };

  const handleEditPolicy = (policy: any, index?: number) => {
    const idx = index !== undefined ? index : policies.indexOf(policy);
    setEditingItem({ ...policy, index: idx, section: policiesSection });
    setFormData({
      ...policy,
      title: policy.title || '',
      link: policy.link || '', // Use link or ID
      label: policy.label || '',
      fileId: policy.mediaId || null,
      mediaId: policy.mediaId || null
    });
    setModalType('edit');
    setCurrentEntityType('policy');
    setShowModal(true);
  };

  const handleSavePoliciesOrder = async () => {
    if (!esgPage?.id || !policiesSection?.content) return;

    const policiesContent = policiesSection.content.find((c: any) => c.contentKey === 'policies');
    // If no content, can't save order (unless we create it, but usually order save implies list exists)
    if (!policiesContent) return;

    try {
      setSavingPolicies(true);

      const updatedPolicies = policies.map((item, index) => ({
        ...item,
        order: index + 1
      }));

      setPolicies(updatedPolicies);

      await sectionContentService.update(policiesContent.id, {
        contentValue: JSON.stringify(updatedPolicies),
        contentType: 'json'
      });

      alert('Policies order saved successfully!');

      // Refresh to ensure sync
      await fetchESGData();
    } catch (error) {
      console.error('Error saving policies order:', error);
      alert('Failed to save order');
    } finally {
      setSavingPolicies(false);
    }
  };

  const handleDragDropPolicies = (draggedId: number | string, targetId: number | string) => {
    // Find items by ID (DataTable passes the id field)
    const draggedIndex = policies.findIndex(p => String(p.id) === String(draggedId));
    const targetIndex = policies.findIndex(p => String(p.id) === String(targetId));

    if (draggedIndex === -1 || targetIndex === -1 || draggedIndex === targetIndex) return;

    const items = [...policies];
    const [draggedItem] = items.splice(draggedIndex, 1);
    items.splice(targetIndex, 0, draggedItem);

    // Update order indices
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index + 1
    }));

    setPolicies(updatedItems);
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  const heroSection = getSectionByKey('hero');
  const introSection = getSectionByKey('intro');
  const championingSection = getSectionByKey('championing-change');
  const pillarsSection = getSectionByKey('three-pillars');
  const policiesSection = getSectionByKey('policies');
  const tabsSection = getSectionByKey('tabs');
  const sustainabilityReportSection = getSectionByKey('sustainability-report');
  const sdgSection = getSectionByKey('sdg');
  const governanceSection = getSectionByKey('governance');
  const ctaSection = getSectionByKey('cta') || getSectionByKey('cta-bottom');

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">ESG Page Management</h2>
        <button
          onClick={() => window.open('/esg', '_blank')}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          <i className="ri-eye-line"></i>
          Preview Page
        </button>
      </div>

      {/* Section Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-lg px-4 py-3">
        <div
          className="flex space-x-2 overflow-x-auto items-center"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Hero Section Tab */}
          <button
            onClick={() => setActiveSection('hero')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'hero'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-image-line text-base"></i>
            <span className="font-medium">Hero</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'hero'
              ? 'bg-blue-200 text-blue-800'
              : 'bg-gray-200 text-gray-600'
              }`}>
              1
            </span>
          </button>

          {/* Intro Section Tab */}
          <button
            onClick={() => setActiveSection('intro')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'intro'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-file-text-line text-base"></i>
            <span className="font-medium">Intro</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'intro'
              ? 'bg-blue-200 text-blue-800'
              : 'bg-gray-200 text-gray-600'
              }`}>
              1
            </span>
          </button>

          {/* Championing Change Tab */}
          <button
            onClick={() => setActiveSection('championing-change')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'championing-change'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-lightbulb-line text-base"></i>
            <span className="font-medium">Championing Change</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'championing-change'
              ? 'bg-blue-200 text-blue-800'
              : 'bg-gray-200 text-gray-600'
              }`}>
              1
            </span>
          </button>

          {/* Three Pillars Tab */}
          <button
            onClick={() => setActiveSection('three-pillars')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'three-pillars'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-layout-grid-line text-base"></i>
            <span className="font-medium">Three Pillars</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'three-pillars'
              ? 'bg-blue-200 text-blue-800'
              : 'bg-gray-200 text-gray-600'
              }`}>
              {threePillars.length}
            </span>
          </button>

          {/* Policies Tab */}
          <button
            onClick={() => setActiveSection('policies')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'policies'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-file-list-line text-base"></i>
            <span className="font-medium">Policies</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'policies'
              ? 'bg-blue-200 text-blue-800'
              : 'bg-gray-200 text-gray-600'
              }`}>
              {policies.length}
            </span>
          </button>

          {/* Tabbed Content Tab */}
          <button
            onClick={() => setActiveSection('tabs')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'tabs'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-folder-line text-base"></i>
            <span className="font-medium">Tabbed Content</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'tabs'
              ? 'bg-blue-200 text-blue-800'
              : 'bg-gray-200 text-gray-600'
              }`}>
              {tabsData.length}
            </span>
          </button>

          {/* Sustainability Report Tab */}
          <button
            onClick={() => setActiveSection('sustainability-report')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'sustainability-report'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-file-paper-line text-base"></i>
            <span className="font-medium">Sustainability Report</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'sustainability-report'
              ? 'bg-blue-200 text-blue-800'
              : 'bg-gray-200 text-gray-600'
              }`}>
              1
            </span>
          </button>

          {/* SDG Section Tab */}
          <button
            onClick={() => setActiveSection('sdg')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'sdg'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-global-line text-base"></i>
            <span className="font-medium">SDG Section</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'sdg'
              ? 'bg-blue-200 text-blue-800'
              : 'bg-gray-200 text-gray-600'
              }`}>
              1
            </span>
          </button>

          {/* Governance Tab */}
          <button
            onClick={() => setActiveSection('governance')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'governance'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-government-line text-base"></i>
            <span className="font-medium">Governance</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'governance'
              ? 'bg-blue-200 text-blue-800'
              : 'bg-gray-200 text-gray-600'
              }`}>
              1
            </span>
          </button>

          {/* CTA Tab */}
          <button
            onClick={() => setActiveSection('cta')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'cta'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-customer-service-line text-base"></i>
            <span className="font-medium">CTA</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'cta'
              ? 'bg-blue-200 text-blue-800'
              : 'bg-gray-200 text-gray-600'
              }`}>
              1
            </span>
          </button>

          {/* SDG Cards Tab */}
          <button
            onClick={() => setActiveSection('sdg-cards')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'sdg-cards'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-stack-line text-base"></i>
            <span className="font-medium">UN SDGs Cards</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'sdg-cards'
              ? 'bg-blue-200 text-blue-800'
              : 'bg-gray-200 text-gray-600'
              }`}>
              {sdgCards.length}
            </span>
          </button>
        </div>
      </div>

      {/* Hero Section Content */}
      {activeSection === 'hero' && heroSection && (
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Hero Section</h3>
              <p className="text-sm text-gray-500 mt-1">Manage hero section content</p>
            </div>
            <button
              onClick={() => handleEditSectionContent(heroSection)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <i className="ri-edit-line"></i>
              Edit Content
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Title</label>
              <p className="text-gray-900">{getContentValue(heroSection, 'title') || 'Not set'}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Subtitle</label>
              <p className="text-gray-600">{getContentValue(heroSection, 'subtitle') || 'Not set'}</p>
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium text-gray-700">Background Image</label>
              {getImagePath(heroSection, 'backgroundImage') ? (
                <img
                  src={getAssetPath(getImagePath(heroSection, 'backgroundImage'))}
                  alt="Hero background"
                  className="w-full h-48 object-cover rounded-lg border border-gray-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="300"%3E%3Crect fill="%23ddd" width="800" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="14"%3ENo Image%3C/text%3E%3C/svg%3E';
                  }}
                />
              ) : (
                <p className="text-gray-400">No image set</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Intro Section Content */}
      {activeSection === 'intro' && introSection && (
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Intro Section</h3>
              <p className="text-sm text-gray-500 mt-1">Manage intro section content</p>
            </div>
            <button
              onClick={() => handleEditSectionContent(introSection)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <i className="ri-edit-line"></i>
              Edit Content
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Image</label>
              {getImagePath(introSection, 'image') ? (
                <img
                  src={getAssetPath(getImagePath(introSection, 'image'))}
                  alt="Intro"
                  className="w-full h-48 object-cover rounded-lg border border-gray-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="12"%3ENo Image%3C/text%3E%3C/svg%3E';
                  }}
                />
              ) : (
                <p className="text-gray-400">No image set</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Logo</label>
              {getImagePath(introSection, 'logo') ? (
                <img
                  src={getAssetPath(getImagePath(introSection, 'logo'))}
                  alt="Logo"
                  className="h-20 object-contain rounded-lg border border-gray-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="80"%3E%3Crect fill="%23ddd" width="200" height="80"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="10"%3ENo Logo%3C/text%3E%3C/svg%3E';
                  }}
                />
              ) : (
                <p className="text-gray-400">No logo set</p>
              )}
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium text-gray-700">Heading</label>
              <p className="text-gray-900">{getContentValue(introSection, 'heading') || 'Not set'}</p>
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <p className="text-gray-600">{getContentValue(introSection, 'description') || 'Not set'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Championing Change Section */}
      {activeSection === 'championing-change' && championingSection && (
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Championing for Change</h3>
              <p className="text-sm text-gray-500 mt-1">Manage championing section content</p>
            </div>
            <button
              onClick={() => handleEditSectionContent(championingSection)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <i className="ri-edit-line"></i>
              Edit Content
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Title</label>
              <p className="text-gray-900">{getContentValue(championingSection, 'title') || 'Not set'}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Background Color</label>
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded border border-gray-300"
                  style={{ backgroundColor: getContentValue(championingSection, 'backgroundColor') || '#7DC144' }}
                ></div>
                <span className="text-gray-600">{getContentValue(championingSection, 'backgroundColor') || '#7DC144'}</span>
              </div>
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <p className="text-gray-600">{getContentValue(championingSection, 'description') || 'Not set'}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Background Pattern</label>
              {getImagePath(championingSection, 'backgroundPattern') ? (
                <img
                  src={getAssetPath(getImagePath(championingSection, 'backgroundPattern'))}
                  alt="Pattern"
                  className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="128" height="128"%3E%3Crect fill="%23ddd" width="128" height="128"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="11"%3ENo Image%3C/text%3E%3C/svg%3E';
                  }}
                />
              ) : (
                <p className="text-gray-400">No pattern set</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Text Color</label>
              <p className="text-gray-600">{getContentValue(championingSection, 'textColor') || 'white'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Three Pillars Section */}
      {activeSection === 'three-pillars' && pillarsSection && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-800">Three Pillars Cards</h3>
            <div className="flex gap-2">
              <button
                onClick={handleAddThreePillar}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <i className="ri-add-line"></i>
                Add Pillar Card
              </button>
              {threePillars.length > 1 && (
                <button
                  onClick={handleSavePillarsOrder}
                  disabled={savingPillarsOrder}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i className={savingPillarsOrder ? 'ri-loader-4-line animate-spin' : 'ri-save-line'}></i>
                  {savingPillarsOrder ? 'Saving...' : 'Save Order'}
                </button>
              )}
            </div>
          </div>
          <DataTable
            data={threePillars}
            draggable={true}
            onDragDrop={handleDragDropPillars}
            columns={[
              {
                key: 'image',
                header: 'PREVIEW',
                render: (_: any, item: any) => {
                  // Resolve image - handle media IDs, paths, and objects
                  let imagePath = '';
                  if (item.image) {
                    // If it's a number (media ID), construct path
                    if (typeof item.image === 'number' && item.image > 0) {
                      imagePath = getAssetPath(`/uploads/media/${item.image}`);
                    }
                    // If it's a string path
                    else if (typeof item.image === 'string') {
                      const path = item.image.trim();
                      // Handle all /uploads/ paths (including /uploads/images/ and /uploads/media/)
                      if (path.startsWith('/uploads/')) {
                        imagePath = getAssetPath(path);
                      } else if (path.startsWith('http://') || path.startsWith('https://')) {
                        imagePath = path;
                      }
                      // Ignore /assets/ paths - they are old hardcoded paths
                    }
                    // If it's an object with filePath or path
                    else if (typeof item.image === 'object' && item.image !== null) {
                      if (item.image.filePath) {
                        const path = item.image.filePath;
                        if (path.startsWith('/uploads/')) {
                          imagePath = getAssetPath(path);
                        } else if (path.startsWith('http://') || path.startsWith('https://')) {
                          imagePath = path;
                        }
                      } else if (item.image.path) {
                        const path = item.image.path;
                        if (path.startsWith('/uploads/')) {
                          imagePath = getAssetPath(path);
                        } else if (path.startsWith('http://') || path.startsWith('https://')) {
                          imagePath = path;
                        }
                      } else if (item.image.url) {
                        imagePath = item.image.url;
                      }
                    }
                  }
                  return imagePath && imagePath.trim() !== '' ? (
                    <img
                      src={imagePath}
                      alt={item.title}
                      className="w-20 h-20 object-cover rounded border border-gray-200"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect fill="%23ddd" width="80" height="80"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="10"%3ENo Image%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  ) : (
                    <div className="w-20 h-20 rounded border border-gray-200 bg-gray-100 flex items-center justify-center">
                      <i className="ri-image-line text-xl text-gray-400"></i>
                    </div>
                  );
                }
              },
              {
                key: 'title',
                header: 'TITLE',
                render: (value) => <span className="font-medium text-gray-900">{value || 'Untitled'}</span>
              },
              {
                key: 'description',
                header: 'DESCRIPTION',
                render: (value) => <span className="text-gray-600 text-sm">{String(value || '').substring(0, 100)}...</span>
              },
              {
                key: 'link',
                header: 'LINK',
                render: (value) => <span className="text-blue-600 text-sm">{value || '-'}</span>
              },
              {
                key: 'order',
                header: 'ORDER',
                render: (_: any, item: any) => {
                  const orderValue = item.orderIndex !== undefined ? item.orderIndex : (item.order !== undefined ? item.order : threePillars.indexOf(item));
                  return (
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
                      {orderValue + 1}
                    </span>
                  );
                }
              }
            ]}
            onEdit={(item) => handleEditThreePillar(item)}
            onDelete={async (item) => {
              if (window.confirm('Are you sure you want to delete this pillar?')) {
                const updatedPillars = threePillars.filter(p => {
                  // Match by id if available, otherwise by reference
                  if (item.id && p.id) {
                    return p.id !== item.id;
                  }
                  return p !== item;
                });

                // Reorder remaining pillars
                const reorderedPillars = updatedPillars.map((pillar, index) => ({
                  ...pillar,
                  order: index,
                  orderIndex: index
                }));

                setThreePillars(reorderedPillars);

                // Trigger save
                const pillarsContent = pillarsSection?.content?.find((c: any) => c.contentKey === 'pillars');
                if (pillarsContent) {
                  try {
                    await sectionContentService.update(pillarsContent.id, {
                      contentValue: JSON.stringify(reorderedPillars),
                      contentType: 'json'
                    });
                    await fetchESGData();
                    showNotification('Pillar deleted successfully!', 'success');
                  } catch (error) {
                    console.error('Error deleting pillar:', error);
                    showNotification('Failed to delete pillar', 'error');
                  }
                }
              }
            }}
          />
        </div>
      )}

      {/* Policies Section */}
      {activeSection === 'policies' && policiesSection && (
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">ESG Policies</h3>
              <p className="text-sm text-gray-500 mt-1">Manage policies section content</p>
            </div>
            <button
              onClick={() => handleEditSectionContent(policiesSection)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <i className="ri-edit-line"></i>
              Edit Content
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Heading</label>
              <p className="text-gray-900">{getContentValue(policiesSection, 'heading') || 'Not set'}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Quality Policy</label>
              <p className="text-gray-600 text-sm break-all">{getContentValue(policiesSection, 'qualityPolicyUrl') || 'Not set'}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">EHS Policy</label>
              <p className="text-gray-600 text-sm break-all">{getContentValue(policiesSection, 'ehsPolicyUrl') || 'Not set'}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Sustainability Policy</label>
              <p className="text-gray-600 text-sm break-all">{getContentValue(policiesSection, 'sustainabilityPolicyUrl') || 'Not set'}</p>
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium text-gray-700">Other Policies Heading</label>
              <p className="text-gray-900">{getContentValue(policiesSection, 'otherPoliciesHeading') || 'Not set'}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Grievance Policy</label>
              <p className="text-gray-600 text-sm break-all">{getContentValue(policiesSection, 'grievancePolicyUrl') || 'Not set'}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">ABAC Policy</label>
              <p className="text-gray-600 text-sm break-all">{getContentValue(policiesSection, 'abacPolicyUrl') || 'Not set'}</p>
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium text-gray-700">Vendor Code of Conduct</label>
              <p className="text-gray-600 text-sm break-all">{getContentValue(policiesSection, 'vendorCodeUrl') || 'Not set'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs Section */}
      {activeSection === 'tabs' && tabsSection && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-800">ESG Tabs</h3>
            <button
              onClick={() => handleEditSectionContent(tabsSection)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <i className="ri-edit-line"></i>
              Edit Tabs
            </button>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-4">
              Tabs are managed as JSON content. Click "Edit Tabs" to modify tab data.
            </p>
            <div className="space-y-2">
              {tabsData.map((tab, index) => (
                <div key={index} className="bg-white p-3 rounded border border-gray-200">
                  <h4 className="font-semibold text-gray-900">{tab.title || tab.tabId}</h4>
                  <p className="text-sm text-gray-600 mt-1">{tab.description?.substring(0, 100)}...</p>
                  <p className="text-xs text-gray-500 mt-2">Items: {tab.items?.length || 0}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sustainability Report Section */}
      {activeSection === 'sustainability-report' && sustainabilityReportSection && (
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Sustainability Report</h3>
              <p className="text-sm text-gray-500 mt-1">Manage sustainability report section</p>
            </div>
            <button
              onClick={() => handleEditSectionContent(sustainabilityReportSection)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <i className="ri-edit-line"></i>
              Edit Content
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Report Title</label>
              <p className="text-gray-900">{getContentValue(sustainabilityReportSection, 'sustainabilityReportTitle') || 'Not set'}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Dashboard Title</label>
              <p className="text-gray-900">{getContentValue(sustainabilityReportSection, 'dashboardTitle') || 'Not set'}</p>
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium text-gray-700">Background Image</label>
              {getImagePath(sustainabilityReportSection, 'backgroundImage') ? (
                <img
                  src={getAssetPath(getImagePath(sustainabilityReportSection, 'backgroundImage'))}
                  alt="Report background"
                  className="w-full h-48 object-cover rounded-lg border border-gray-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="300"%3E%3Crect fill="%23ddd" width="800" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="14"%3ENo Image%3C/text%3E%3C/svg%3E';
                  }}
                />
              ) : (
                <p className="text-gray-400">No image set</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Report Button Text</label>
              <p className="text-gray-900">{getContentValue(sustainabilityReportSection, 'sustainabilityReportButtonText') || 'Not set'}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Report URL</label>
              <p className="text-gray-600 text-sm break-all">{getContentValue(sustainabilityReportSection, 'sustainabilityReportUrl') || 'Not set'}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Dashboard Button Text</label>
              <p className="text-gray-900">{getContentValue(sustainabilityReportSection, 'dashboardButtonText') || 'Not set'}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Dashboard URL</label>
              <p className="text-gray-600 text-sm break-all">{getContentValue(sustainabilityReportSection, 'dashboardUrl') || 'Not set'}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Overlay Color</label>
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded border border-gray-300"
                  style={{ backgroundColor: getContentValue(sustainabilityReportSection, 'overlayColor') || '#2d5234' }}
                ></div>
                <span className="text-gray-600">{getContentValue(sustainabilityReportSection, 'overlayColor') || '#2d5234'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SDG Section */}
      {activeSection === 'sdg' && sdgSection && (
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">SDG Section</h3>
              <p className="text-sm text-gray-500 mt-1">Manage SDG section content</p>
            </div>
            <button
              onClick={() => handleEditSectionContent(sdgSection)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <i className="ri-edit-line"></i>
              Edit Content
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Heading</label>
              <p className="text-gray-900">{getContentValue(sdgSection, 'heading') || 'Not set'}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Background Color</label>
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded border border-gray-300"
                  style={{ backgroundColor: getContentValue(sdgSection, 'backgroundColor') || '#7cb342' }}
                ></div>
                <span className="text-gray-600">{getContentValue(sdgSection, 'backgroundColor') || '#7cb342'}</span>
              </div>
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium text-gray-700">Description 1</label>
              <p className="text-gray-600">{getContentValue(sdgSection, 'description1') || 'Not set'}</p>
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium text-gray-700">Description 2</label>
              <p className="text-gray-600">{getContentValue(sdgSection, 'description2') || 'Not set'}</p>
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium text-gray-700">Image</label>
              {getImagePath(sdgSection, 'image') ? (
                <img
                  src={getAssetPath(getImagePath(sdgSection, 'image'))}
                  alt="SDG"
                  className="w-full h-48 object-cover rounded-lg border border-gray-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="300"%3E%3Crect fill="%23ddd" width="800" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="14"%3ENo Image%3C/text%3E%3C/svg%3E';
                  }}
                />
              ) : (
                <p className="text-gray-400">No image set</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Policies Section */}
      {activeSection === 'policies' && policiesSection && (
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Policies</h3>
              <p className="text-sm text-gray-500 mt-1">Manage ESG policies documents</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSavePoliciesOrder}
                disabled={savingPolicies}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                {savingPolicies ? <i className="ri-loader-4-line animate-spin"></i> : <i className="ri-save-line"></i>}
                Save Order
              </button>
              <button
                onClick={handleAddPolicy}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <i className="ri-add-line"></i>
                Add Policy
              </button>
            </div>
          </div>

          <DataTable
            data={policies}
            draggable
            onDragDrop={handleDragDropPolicies}
            columns={[
              {
                key: 'title',
                header: 'Policy Title',
                render: (value) => <span className="font-medium">{value}</span>
              },
              {
                key: 'link',
                header: 'Document',
                render: (_: any, item: any) => {
                  const displayLink = item.link || (item.mediaId ? item.mediaId : '');
                  return (
                    <div className="flex items-center gap-2">
                      <i className="ri-file-pdf-line text-red-500 text-xl"></i>
                      <a href={getAssetPath(displayLink)} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm truncate max-w-[200px]">
                        {item.label || 'View Document'}
                      </a>
                    </div>
                  )
                }
              },
              {
                key: 'order',
                header: 'Order',
                render: (value: any) => <span className="text-gray-500">{value}</span>
              }
            ]}
            onEdit={(item) => handleEditPolicy(item)}
            onDelete={async (item) => {
              if (window.confirm('Are you sure you want to delete this policy?')) {
                const updatedPolicies = policies.filter(p => p !== item);
                setPolicies(updatedPolicies);

                const policiesContent = policiesSection?.content?.find((c: any) => c.contentKey === 'policies');
                if (policiesContent) {
                  try {
                    await sectionContentService.update(policiesContent.id, {
                      contentValue: JSON.stringify(updatedPolicies),
                      contentType: 'json'
                    });
                    await fetchESGData();
                  } catch (error) {
                    console.error('Error deleting policy:', error);
                    alert('Failed to delete policy');
                  }
                }
              }
            }}
          />
        </div>
      )}

      {/* Governance Section */}
      {activeSection === 'governance' && governanceSection && (
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Governance Section</h3>
              <p className="text-sm text-gray-500 mt-1">Manage governance section content</p>
            </div>
            <button
              onClick={() => handleEditSectionContent(governanceSection)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <i className="ri-edit-line"></i>
              Edit Content
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Heading</label>
              <p className="text-gray-900">{getContentValue(governanceSection, 'heading') || 'Not set'}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <p className="text-gray-600 text-sm">{getContentValue(governanceSection, 'description') || 'Not set'}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Quote</label>
              <p className="text-gray-600 italic">{getContentValue(governanceSection, 'quote') || 'Not set'}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Quote Author</label>
              <p className="text-gray-600">{getContentValue(governanceSection, 'quoteAuthor') || 'Not set'}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Mission Title</label>
              <p className="text-gray-900">{getContentValue(governanceSection, 'missionTitle') || 'Not set'}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Vision Title</label>
              <p className="text-gray-900">{getContentValue(governanceSection, 'visionTitle') || 'Not set'}</p>
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium text-gray-700">Mission Description</label>
              <p className="text-gray-600 text-sm">{getContentValue(governanceSection, 'missionDescription') || 'Not set'}</p>
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium text-gray-700">Vision Description</label>
              <p className="text-gray-600 text-sm">{getContentValue(governanceSection, 'visionDescription') || 'Not set'}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Core Values Heading</label>
              <p className="text-gray-900">{getContentValue(governanceSection, 'coreValuesHeading') || 'Not set'}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Core Values Subtitle</label>
              <p className="text-gray-600">{getContentValue(governanceSection, 'coreValuesSubtitle') || 'Not set'}</p>
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium text-gray-700">Core Values</label>
              {(() => {
                try {
                  const coreValues = JSON.parse(getContentValue(governanceSection, 'coreValues') || '[]');
                  if (Array.isArray(coreValues) && coreValues.length > 0) {
                    return (
                      <div className="space-y-3 mt-2">
                        {coreValues.map((value: any, index: number) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                            <div className="flex items-start gap-3">
                              {value.icon && (
                                <img
                                  src={getAssetPath(value.icon)}
                                  alt={value.title}
                                  className="w-12 h-12 object-contain rounded"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="48" height="48"%3E%3Crect fill="%23ddd" width="48" height="48"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="8"%3EIcon%3C/text%3E%3C/svg%3E';
                                  }}
                                />
                              )}
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 mb-1">{value.title || `Core Value ${index + 1}`}</h4>
                                <p className="text-sm text-gray-600">{value.description || 'No description'}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return <p className="text-gray-400">No core values set</p>;
                } catch {
                  return <p className="text-gray-400">No core values set</p>;
                }
              })()}
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      {activeSection === 'cta' && (
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">CTA Section</h3>
              <p className="text-sm text-gray-500 mt-1">Manage CTA section content</p>
            </div>
            {ctaSection ? (
              <button
                onClick={() => handleEditSectionContent(ctaSection)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <i className="ri-edit-line"></i>
                Edit Content
              </button>
            ) : (
              <button
                onClick={async () => {
                  if (!esgPage?.id) return;
                  try {
                    const newSection = await sectionsService.create({
                      pageId: esgPage.id,
                      sectionKey: 'cta',
                      sectionType: 'content',
                      isActive: true,
                      orderIndex: 9
                    });
                    const updatedSections = await sectionsService.getByPageId(esgPage.id);
                    setSections(updatedSections);
                    handleEditSectionContent(newSection);
                  } catch (error) {
                    console.error('Error creating CTA section:', error);
                  }
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <i className="ri-add-line"></i>
                Create Section
              </button>
            )}
          </div>
          {ctaSection ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Question Title</label>
                <p className="text-gray-900">{getContentValue(ctaSection, 'questionTitle') || 'Not set'}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Question Button Text</label>
                <p className="text-gray-900">{getContentValue(ctaSection, 'questionButtonText') || 'Not set'}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Question Button Link</label>
                <p className="text-gray-600">{getContentValue(ctaSection, 'questionButtonLink') || 'Not set'}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">News Title</label>
                <p className="text-gray-900">{getContentValue(ctaSection, 'newsTitle') || 'Not set'}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">News Button Text</label>
                <p className="text-gray-900">{getContentValue(ctaSection, 'newsButtonText') || 'Not set'}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">News Button Link</label>
                <p className="text-gray-600">{getContentValue(ctaSection, 'newsButtonLink') || 'Not set'}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Careers Title</label>
                <p className="text-gray-900">{getContentValue(ctaSection, 'careersTitle') || 'Not set'}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Careers Button Text</label>
                <p className="text-gray-900">{getContentValue(ctaSection, 'careersButtonText') || 'Not set'}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Careers Button Link</label>
                <p className="text-gray-600">{getContentValue(ctaSection, 'careersButtonLink') || 'Not set'}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Background Color</label>
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded border border-gray-300"
                    style={{ backgroundColor: getContentValue(ctaSection, 'backgroundColor') || '#3b9dd6' }}
                  ></div>
                  <span className="text-gray-600">{getContentValue(ctaSection, 'backgroundColor') || '#3b9dd6'}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <i className="ri-information-line text-4xl mb-2"></i>
              <p>CTA section not found. Click "Create Section" to create it.</p>
            </div>
          )}
        </div>
      )}

      {/* SDG Cards Section */}
      {activeSection === 'sdg-cards' && (
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">UN SDGs Cards Management</h3>
              <p className="text-sm text-gray-500 mt-1">Manage UN Sustainable Development Goals cards</p>
              <p className="text-xs text-gray-400 mt-1">Total cards: {sdgCards.length}</p>
            </div>
            <button
              onClick={handleAddSDGCard}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <i className="ri-add-line"></i>
              Add SDG Card
            </button>
          </div>
          {/* Debug Info */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-4 p-3 bg-gray-100 rounded text-xs">
              <strong>Debug:</strong> Cards count: {sdgCards?.length || 0},
              Loading: {loading ? 'Yes' : 'No'},
              Data type: {Array.isArray(sdgCards) ? 'Array' : typeof sdgCards}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <i className="ri-loader-4-line animate-spin text-4xl text-gray-400 mb-4"></i>
              <p className="text-gray-500">Loading SDG cards...</p>
            </div>
          ) : sdgCards && Array.isArray(sdgCards) && sdgCards.length > 0 ? (
            <DataTable
              data={sdgCards}
              columns={[
                {
                  key: 'icon',
                  header: 'ICON',
                  render: (value, item) => {
                    const iconPath = item.icon?.filePath || item.icon?.url || item.iconId || '';
                    return (
                      <img
                        src={getAssetPath(iconPath)}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded border border-gray-200"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64"%3E%3Crect fill="%23ddd" width="64" height="64"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="9"%3ENo Icon%3C/text%3E%3C/svg%3E';
                        }}
                      />
                    );
                  }
                },
                {
                  key: 'sdgNumber',
                  header: 'SDG #',
                  render: (value) => <span className="font-medium text-gray-900">{value || '-'}</span>
                },
                {
                  key: 'title',
                  header: 'TITLE',
                  render: (value) => <span className="font-medium text-gray-900">{value || 'Untitled'}</span>
                },
                {
                  key: 'contribution',
                  header: 'CONTRIBUTION',
                  render: (value) => <span className="text-gray-600">{value || '-'}</span>
                },
                {
                  key: 'description',
                  header: 'DESCRIPTION',
                  render: (value) => <span className="text-gray-600 text-sm">{String(value || '').substring(0, 80)}...</span>
                },
                {
                  key: 'orderIndex',
                  header: 'ORDER',
                  render: (value) => <span className="text-gray-600">{value !== undefined ? value : 0}</span>
                },
                {
                  key: 'color',
                  header: 'COLOR',
                  render: (value) => (
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded border border-gray-300"
                        style={{ backgroundColor: value || '#7cb342' }}
                      ></div>
                      <span className="text-gray-600 text-xs">{value || '-'}</span>
                    </div>
                  )
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
              onEdit={handleEditSDGCard}
              onDelete={(item) => handleDelete(item, 'sdg-card')}
            />
          ) : (
            <div className="text-center py-12 text-gray-500">
              <i className="ri-stack-line text-6xl mb-4 text-gray-300"></i>
              <p className="text-lg font-medium text-gray-600 mb-2">No SDG Cards Found</p>
              <p className="text-sm text-gray-500 mb-4">Get started by adding your first UN SDG card</p>
              <button
                onClick={handleAddSDGCard}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
              >
                <i className="ri-add-line"></i>
                Add First SDG Card
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
