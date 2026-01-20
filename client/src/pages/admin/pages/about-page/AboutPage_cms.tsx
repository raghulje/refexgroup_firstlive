import { useState, useEffect } from 'react';
import { DataTable } from '../../shared/DataTable';
import { getAssetPath } from '../../shared/utils';
import type { CMSComponentProps } from '../../shared/types';
import { pagesService, sectionsService, leadersService, coreValuesService } from '../../../../services/apiService';

interface AboutPageProps extends Partial<CMSComponentProps> {
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

export default function AboutPage_cms({
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
}: AboutPageProps) {
  const [aboutPage, setAboutPage] = useState<any>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [leaders, setLeaders] = useState<any[]>([]);
  const [coreValues, setCoreValues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('hero-section');
  const [activePageSection, setActivePageSection] = useState<string | null>(null);
  const [draggedLeader, setDraggedLeader] = useState<number | null>(null);
  const [draggedCoreValue, setDraggedCoreValue] = useState<number | null>(null);
  const [savingOrder, setSavingOrder] = useState(false);
  const [savingCoreValueOrder, setSavingCoreValueOrder] = useState(false);

  // Fixed section keys that should not appear in dynamic sections
  const fixedSectionKeys = ['hero', 'overview', 'mission-vision', 'story', 'careers-cta'];

  useEffect(() => {
    fetchAboutData();
  }, []);

  useEffect(() => {
    const handleRefresh = () => {
      fetchAboutData();
    };
    window.addEventListener('cms-refresh', handleRefresh);
    return () => window.removeEventListener('cms-refresh', handleRefresh);
  }, []);

  const fetchAboutData = async () => {
    try {
      setLoading(true);
      const page = await pagesService.getBySlug('about-refex');
      setAboutPage(page);

      const pageSections = await sectionsService.getByPageId(page.id);
      setSections(pageSections);

      const leadersData = await leadersService.getAll(true); // Include inactive leaders for CMS
      const sortedLeaders = leadersData.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
      setLeaders(sortedLeaders);

      const coreValuesData = await coreValuesService.getAll();
      const sortedCoreValues = coreValuesData.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
      setCoreValues(sortedCoreValues);
    } catch (error) {
      console.error('Error fetching about data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSection = () => {
    setEditingItem(null);
    setFormData({
      pageId: aboutPage?.id,
      sectionKey: '',
      sectionType: 'content',
      isActive: true,
      orderIndex: sections.length
    });
    setModalType('add');
    setCurrentEntityType('section');
    setShowModal(true);
  };

  const handleEditSection = (section: any) => {
    setEditingItem(section);
    setFormData(section);
    setModalType('edit');
    setCurrentEntityType('section');
    setShowModal(true);
  };

  const handleEditSectionContent = (item: any, section: any) => {
    setEditingItem(item);
    const formDataToSet: any = {
      ...item,
      mediaId: item.mediaId || item.media?.id || null,
      sectionId: section.id,
      _section: section // Store section object for handleSubmit
    };

    // Parse JSON content if needed
    if (item.contentType === 'json' && typeof item.contentValue === 'string') {
      try {
        formDataToSet.contentValue = JSON.parse(item.contentValue);
      } catch (e) {
        // Keep as string if parsing fails
      }
    }

    setFormData(formDataToSet);
    setModalType('edit');
    setCurrentEntityType(`section-content-${section.sectionKey}`);
    setShowModal(true);
  };

  // Helper function to get section by key
  const getSectionByKey = (sectionKey: string) => {
    return sections.find(s => s.sectionKey === sectionKey);
  };

  // Helper function to edit section content (for fixed sections)
  const handleEditFixedSection = async (sectionKey: string) => {
    if (!aboutPage?.id) return;

    try {
      // Find section
      let section = getSectionByKey(sectionKey);

      // If not found, create it
      if (!section) {
        section = await sectionsService.create({
          pageId: aboutPage.id,
          sectionKey: sectionKey,
          sectionType: 'content',
          isActive: true,
          orderIndex: 0
        });

        // Refresh sections
        const updatedSections = await sectionsService.getByPageId(aboutPage.id);
        setSections(updatedSections);
        section = updatedSections.find((s: any) => s.sectionKey === sectionKey);
      }

      if (!section) return;

      // Prepare form data from section content
      const formData: any = {
        sectionId: section.id,
        _section: section
      };

      // Populate form data from content items
      console.log('Loading section for edit:', sectionKey, section);
      if (section.content && section.content.length > 0) {
        section.content.forEach((item: any) => {
          console.log('Processing content item:', item.contentKey, item);
          // If it's JSON content, parse it
          if (item.contentType === 'json') {
            try {
              formData[item.contentKey] = JSON.parse(item.contentValue);
            } catch {
              formData[item.contentKey] = item.contentValue;
            }
          } else {
            // For image fields, prioritize mediaId over contentValue
            // Image fields: backgroundImage, image, logo, timelineImage, patternImage, missionIcon, visionIcon
            const imageFields = ['backgroundImage', 'image', 'logo', 'timelineImage', 'patternImage', 'missionIcon', 'visionIcon'];
            if (imageFields.includes(item.contentKey) && item.mediaId) {
              // Use mediaId for image fields
              formData[item.contentKey] = item.mediaId;

              // Also extract positioning fields if they exist (from the content item itself)
              if (item.backgroundPositionX !== undefined && item.backgroundPositionX !== null && item.backgroundPositionX !== '') {
                formData[`${item.contentKey}PositionX`] = item.backgroundPositionX;
                formData.backgroundPositionX = item.backgroundPositionX;
                formData.backgroundImagePositionX = item.backgroundPositionX;
              }
              if (item.backgroundPositionY !== undefined && item.backgroundPositionY !== null && item.backgroundPositionY !== '') {
                formData[`${item.contentKey}PositionY`] = item.backgroundPositionY;
                formData.backgroundPositionY = item.backgroundPositionY;
                formData.backgroundImagePositionY = item.backgroundPositionY;
              }
            } else if (item.contentKey.endsWith('PositionX') || item.contentKey.endsWith('PositionY')) {
              // Handle positioning fields stored as separate content items
              const baseField = item.contentKey.replace('PositionX', '').replace('PositionY', '');
              if (imageFields.includes(baseField)) {
                if (item.contentKey.endsWith('PositionX')) {
                  formData[`${baseField}PositionX`] = item.contentValue;
                  formData.backgroundPositionX = item.contentValue;
                  formData.backgroundImagePositionX = item.contentValue;
                } else {
                  formData[`${baseField}PositionY`] = item.contentValue;
                  formData.backgroundPositionY = item.contentValue;
                  formData.backgroundImagePositionY = item.contentValue;
                }
              }
            } else {
              // For text content, use the contentValue
              formData[item.contentKey] = item.contentValue;
            }
          }
        });
      }

      console.log('Form data prepared:', formData);
      setEditingItem(section);
      setFormData(formData);
      setModalType('edit');
      setCurrentEntityType(`section-content-${sectionKey}`);
      setShowModal(true);
    } catch (error) {
      console.error('Error handling fixed section:', error);
      showNotification('Error loading section data. Please try again.', 'error');
    }
  };

  // Core Values Handlers
  const handleAddCoreValue = () => {
    setEditingItem(null);
    setFormData({
      letter: '',
      title: '',
      description: '',
      icon: '',
      orderIndex: coreValues.length,
      isActive: true
    });
    setModalType('add');
    setCurrentEntityType('core-value');
    setShowModal(true);
  };

  const handleEditCoreValue = (value: any) => {
    setEditingItem(value);
    setFormData({
      ...value,
      icon: value.iconId || value.icon?.id || value.icon?.url || value.icon || ''
    });
    setModalType('edit');
    setCurrentEntityType('core-value');
    setShowModal(true);
  };

  const handleDragDropCoreValue = (draggedId: number, targetId: number) => {
    const draggedIndex = coreValues.findIndex(v => v.id === draggedId);
    const targetIndex = coreValues.findIndex(v => v.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newValues = [...coreValues];
    const [draggedValue] = newValues.splice(draggedIndex, 1);
    newValues.splice(targetIndex, 0, draggedValue);

    const updatedValues = newValues.map((value, index) => ({
      ...value,
      orderIndex: index
    }));

    setCoreValues(updatedValues);
  };

  const handleSaveCoreValueOrder = async () => {
    try {
      setSavingCoreValueOrder(true);
      const sortedValues = [...coreValues].sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
      const valuesToUpdate = sortedValues.map((value, index) => ({
        id: value.id,
        orderIndex: index
      }));

      await Promise.all(
        valuesToUpdate.map(value =>
          coreValuesService.update(value.id, { orderIndex: value.orderIndex })
        )
      );

      const valuesData = await coreValuesService.getAll();
      const refreshedSorted = valuesData.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
      setCoreValues(refreshedSorted);

      window.dispatchEvent(new CustomEvent('cms-refresh'));
      showNotification('Core Values order saved successfully!', 'success');
    } catch (error: any) {
      console.error('Error saving core values order:', error);
      showNotification('Failed to save order. Please try again.', 'error');
    } finally {
      setSavingCoreValueOrder(false);
    }
  };

  const handleAddLeader = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      position: '',
      bio: '',
      image: '',
      linkedinUrl: '',
      orderIndex: leaders.length,
      isActive: true
    });
    setModalType('add');
    setCurrentEntityType('leader');
    setShowModal(true);
  };

  const handleEditLeader = (leader: any) => {
    setEditingItem(leader);
    setFormData({
      ...leader,
      image: leader.imageId || leader.image?.id || leader.image?.url || leader.image || '',
      linkedinUrl: leader.linkedinUrl || ''
    });
    setModalType('edit');
    setCurrentEntityType('leader');
    setShowModal(true);
  };

  const handleDragDrop = (draggedId: number, targetId: number) => {
    const draggedIndex = leaders.findIndex(l => l.id === draggedId);
    const targetIndex = leaders.findIndex(l => l.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newLeaders = [...leaders];
    const [draggedLeader] = newLeaders.splice(draggedIndex, 1);
    newLeaders.splice(targetIndex, 0, draggedLeader);

    // Update orderIndex for all leaders
    const updatedLeaders = newLeaders.map((leader, index) => ({
      ...leader,
      orderIndex: index + 1
    }));

    setLeaders(updatedLeaders);
  };

  const handleSaveOrder = async () => {
    try {
      setSavingOrder(true);
      // Use the current order of leaders (already sorted by orderIndex)
      const sortedLeaders = [...leaders].sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
      const leadersToUpdate = sortedLeaders.map((leader, index) => ({
        id: leader.id,
        orderIndex: index + 1
      }));

      // Update each leader individually
      await Promise.all(
        leadersToUpdate.map(leader =>
          leadersService.update(leader.id, { orderIndex: leader.orderIndex })
        )
      );

      // Refresh data
      const leadersData = await leadersService.getAll();
      const refreshedSorted = leadersData.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
      setLeaders(refreshedSorted);

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
        <h2 className="text-2xl font-bold text-gray-800">About Page Management</h2>
        <button
          onClick={() => window.open('/about', '_blank')}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          <i className="ri-eye-line"></i>
          Preview Page
        </button>
      </div>

      {/* Single Row Tabs - All Categories */}
      <div className="bg-white rounded-xl shadow-lg px-4 py-3">
        <div
          className="flex space-x-2 overflow-x-auto items-center"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Hero Section Tab */}
          <button
            onClick={() => {
              setActiveSection('hero-section');
              setActivePageSection(null);
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'hero-section'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-image-2-line text-base"></i>
            <span className="font-medium">Hero Section</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'hero-section'
                ? 'bg-blue-200 text-blue-800'
                : 'bg-gray-200 text-gray-600'
              }`}>
              1
            </span>
          </button>

          {/* Overview Section Tab */}
          <button
            onClick={() => {
              setActiveSection('overview-section');
              setActivePageSection(null);
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'overview-section'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-file-text-line text-base"></i>
            <span className="font-medium">Overview Section</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'overview-section'
                ? 'bg-blue-200 text-blue-800'
                : 'bg-gray-200 text-gray-600'
              }`}>
              1
            </span>
          </button>

          {/* Core Values Tab */}
          <button
            onClick={() => {
              setActiveSection('core-values');
              setActivePageSection(null);
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'core-values'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-heart-line text-base"></i>
            <span className="font-medium">Core Values (PACE)</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'core-values'
                ? 'bg-blue-200 text-blue-800'
                : 'bg-gray-200 text-gray-600'
              }`}>
              {coreValues.length}
            </span>
          </button>

          {/* Leadership Team Tab */}
          <button
            onClick={() => {
              setActiveSection('leaders');
              setActivePageSection(null);
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'leaders'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-team-line text-base"></i>
            <span className="font-medium">Leadership Team</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'leaders'
                ? 'bg-blue-200 text-blue-800'
                : 'bg-gray-200 text-gray-600'
              }`}>
              {leaders.length}
            </span>
          </button>

          {/* Mission & Vision Tab */}
          <button
            onClick={() => {
              setActiveSection('mission-vision');
              setActivePageSection(null);
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'mission-vision'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-eye-line text-base"></i>
            <span className="font-medium">Mission & Vision</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'mission-vision'
                ? 'bg-blue-200 text-blue-800'
                : 'bg-gray-200 text-gray-600'
              }`}>
              1
            </span>
          </button>

          {/* Story/Timeline Tab */}
          <button
            onClick={() => {
              setActiveSection('story-timeline');
              setActivePageSection(null);
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'story-timeline'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-time-line text-base"></i>
            <span className="font-medium">Story/Timeline</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'story-timeline'
                ? 'bg-blue-200 text-blue-800'
                : 'bg-gray-200 text-gray-600'
              }`}>
              1
            </span>
          </button>

          {/* Careers CTA Tab */}
          <button
            onClick={() => {
              setActiveSection('careers-cta');
              setActivePageSection(null);
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'careers-cta'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-briefcase-4-line text-base"></i>
            <span className="font-medium">Careers CTA</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'careers-cta'
                ? 'bg-blue-200 text-blue-800'
                : 'bg-gray-200 text-gray-600'
              }`}>
              1
            </span>
          </button>

          {/* Dynamic Page Sections Tabs - Exclude fixed sections */}
          {sections
            .filter(section => !fixedSectionKeys.includes(section.sectionKey))
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

      {/* Leadership Team Section */}
      {activeSection === 'leaders' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-800">Leadership Team</h3>
            <div className="flex gap-2">
              <button
                onClick={handleAddLeader}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <i className="ri-add-line"></i>
                Add Leader
              </button>
              {leaders.length > 1 && (
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

          {/* Drag and Drop Leaders List */}
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-12"></th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">PREVIEW</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">NAME</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">POSITION</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">BIO PREVIEW</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ORDER</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">STATUS</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leaders
                    .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))
                    .map((leader) => {
                      const imagePath = leader.image?.url || leader.image?.filePath || leader.image || '';

                      return (
                        <tr
                          key={leader.id}
                          draggable
                          onDragStart={(e) => {
                            setDraggedLeader(leader.id);
                            e.dataTransfer.effectAllowed = 'move';
                          }}
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.dataTransfer.dropEffect = 'move';
                            const target = e.currentTarget;
                            if (draggedLeader !== leader.id) {
                              target.classList.add('opacity-50');
                            }
                          }}
                          onDragLeave={(e) => {
                            e.currentTarget.classList.remove('opacity-50');
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            e.currentTarget.classList.remove('opacity-50');
                            if (draggedLeader !== null && draggedLeader !== leader.id) {
                              handleDragDrop(draggedLeader, leader.id);
                            }
                            setDraggedLeader(null);
                          }}
                          onDragEnd={() => {
                            setDraggedLeader(null);
                            document.querySelectorAll('tr').forEach(row => {
                              row.classList.remove('opacity-50');
                            });
                          }}
                          className={`cursor-move hover:bg-gray-50 transition-colors ${draggedLeader === leader.id ? 'opacity-50' : ''}`}
                        >
                          <td className="px-4 py-4 whitespace-nowrap">
                            <i className="ri-drag-move-2-line text-gray-400 text-xl"></i>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <img
                              src={getAssetPath(imagePath)}
                              alt={leader.name || 'Leader'}
                              className="w-20 h-20 object-cover rounded-full border-2 border-gray-200"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect fill="%23ddd" width="80" height="80"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="12"%3ENo Image%3C/text%3E%3C/svg%3E';
                              }}
                            />
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="font-medium text-gray-900">{leader.name || 'N/A'}</span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="text-gray-600">{leader.position || 'N/A'}</span>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-gray-600 text-sm max-w-xs truncate block">
                              {leader.bio || 'N/A'}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="text-gray-600">{leader.orderIndex || 0}</span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${leader.isActive
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-600'
                              }`}>
                              {leader.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditLeader(leader)}
                                className="text-blue-600 hover:text-blue-900"
                                title="Edit"
                              >
                                <i className="ri-edit-line"></i>
                              </button>
                              <button
                                onClick={() => handleDelete(leader, 'leader')}
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
          </div>
        </div>
      )}

      {/* Hero Section */}
      {activeSection === 'hero-section' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Hero Section</h3>
                <p className="text-gray-500 mt-1">Manage hero section content</p>
              </div>
              <button
                onClick={() => handleEditFixedSection('hero')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <i className="ri-edit-line"></i>
                Edit Content
              </button>
            </div>

            {(() => {
              const section = getSectionByKey('hero');
              if (!section) {
                return (
                  <div className="text-center py-8">
                    <i className="ri-image-2-line text-4xl text-gray-400 mb-2"></i>
                    <p className="text-gray-500 italic">No hero section found. Please create one in the database.</p>
                  </div>
                );
              }

              const title = section.content?.find((c: any) => c.contentKey === 'title')?.contentValue;
              const description = section.content?.find((c: any) => c.contentKey === 'description')?.contentValue;
              const backgroundImage = section.content?.find((c: any) => c.contentKey === 'backgroundImage');
              const backgroundImagePath = backgroundImage?.media?.url || backgroundImage?.media?.filePath || '';

              return (
                <div className="prose max-w-none">
                  {backgroundImagePath && (
                    <div className="mb-4">
                      <img
                        src={getAssetPath(backgroundImagePath)}
                        alt="Hero Background"
                        className="w-full max-w-md h-48 object-cover rounded border border-gray-200"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="192"%3E%3Crect fill="%23ddd" width="400" height="192"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="14"%3ENo Image%3C/text%3E%3C/svg%3E';
                        }}
                      />
                    </div>
                  )}
                  {title && <h3 className="text-lg font-bold mb-2">{title}</h3>}
                  {description ? (
                    <p className="text-gray-600 whitespace-pre-wrap">{description}</p>
                  ) : (
                    <p className="text-gray-400 italic">No content yet. Click edit to add content.</p>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Overview Section */}
      {activeSection === 'overview-section' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Overview Section</h3>
                <p className="text-gray-500 mt-1">Manage overview section content</p>
              </div>
              <button
                onClick={() => handleEditFixedSection('overview')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <i className="ri-edit-line"></i>
                Edit Content
              </button>
            </div>

            {(() => {
              const section = getSectionByKey('overview');
              if (!section) {
                return (
                  <div className="text-center py-8">
                    <i className="ri-file-text-line text-4xl text-gray-400 mb-2"></i>
                    <p className="text-gray-500 italic">No overview section found. Please create one in the database.</p>
                  </div>
                );
              }

              const heading = section.content?.find((c: any) => c.contentKey === 'heading')?.contentValue;
              const tagline = section.content?.find((c: any) => c.contentKey === 'tagline')?.contentValue;
              const yearsInBusiness = section.content?.find((c: any) => c.contentKey === 'yearsInBusiness')?.contentValue;
              const peopleImpacted = section.content?.find((c: any) => c.contentKey === 'peopleImpacted')?.contentValue;
              const description = section.content?.find((c: any) => c.contentKey === 'description')?.contentValue;
              const logo = section.content?.find((c: any) => c.contentKey === 'logo');
              const logoPath = logo?.media?.url || logo?.media?.filePath || '';
              const image = section.content?.find((c: any) => c.contentKey === 'image');
              const imagePath = image?.media?.url || image?.media?.filePath || '';

              return (
                <div className="prose max-w-none space-y-4">
                  {heading && <h3 className="text-lg font-bold mb-2">{heading}</h3>}
                  {tagline && (
                    <p className="text-gray-500 italic text-lg mb-4">{tagline}</p>
                  )}
                  {(yearsInBusiness || peopleImpacted) && (
                    <div className="flex gap-8 mb-4">
                      {yearsInBusiness && (
                        <div>
                          <p className="text-2xl font-bold text-[#6bba29]">{yearsInBusiness}+</p>
                          <p className="text-gray-600 text-sm">Years in Business</p>
                        </div>
                      )}
                      {peopleImpacted && (
                        <div>
                          <p className="text-2xl font-bold text-[#6bba29]">{peopleImpacted}M</p>
                          <p className="text-gray-600 text-sm">People Impacted</p>
                        </div>
                      )}
                    </div>
                  )}
                  {logoPath && (
                    <div className="mb-4">
                      <img
                        src={getAssetPath(logoPath)}
                        alt="Logo"
                        className="h-12 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="48"%3E%3Crect fill="%23ddd" width="200" height="48"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="12"%3ENo Logo%3C/text%3E%3C/svg%3E';
                        }}
                      />
                    </div>
                  )}
                  {description ? (
                    <p className="text-gray-600 whitespace-pre-wrap">{description}</p>
                  ) : (
                    <p className="text-gray-400 italic">No description yet. Click edit to add content.</p>
                  )}
                  {imagePath && (
                    <div className="mt-4">
                      <img
                        src={getAssetPath(imagePath)}
                        alt="Office Group Photo"
                        className="w-full max-w-2xl rounded-lg shadow-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="450"%3E%3Crect fill="%23ddd" width="800" height="450"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="14"%3ENo Image%3C/text%3E%3C/svg%3E';
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Core Values Section */}
      {activeSection === 'core-values' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-800">Core Values (PACE)</h3>
            <div className="flex gap-2">
              <button
                onClick={handleAddCoreValue}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <i className="ri-add-line"></i>
                Add Core Value
              </button>
              {coreValues.length > 1 && (
                <button
                  onClick={handleSaveCoreValueOrder}
                  disabled={savingCoreValueOrder}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i className={savingCoreValueOrder ? 'ri-loader-4-line animate-spin' : 'ri-save-line'}></i>
                  {savingCoreValueOrder ? 'Saving...' : 'Save Order'}
                </button>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-12"></th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ICON</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">LETTER</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">TITLE</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">DESCRIPTION</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ORDER</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">STATUS</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {coreValues
                    .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))
                    .map((value) => {
                      const iconPath = value.icon?.url || value.icon?.filePath || value.icon || '';

                      return (
                        <tr
                          key={value.id}
                          draggable
                          onDragStart={(e) => {
                            setDraggedCoreValue(value.id);
                            e.dataTransfer.effectAllowed = 'move';
                          }}
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.dataTransfer.dropEffect = 'move';
                            const target = e.currentTarget;
                            if (draggedCoreValue !== value.id) {
                              target.classList.add('opacity-50');
                            }
                          }}
                          onDragLeave={(e) => {
                            e.currentTarget.classList.remove('opacity-50');
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            e.currentTarget.classList.remove('opacity-50');
                            if (draggedCoreValue !== null && draggedCoreValue !== value.id) {
                              handleDragDropCoreValue(draggedCoreValue, value.id);
                            }
                            setDraggedCoreValue(null);
                          }}
                          onDragEnd={() => {
                            setDraggedCoreValue(null);
                            document.querySelectorAll('tr').forEach(row => {
                              row.classList.remove('opacity-50');
                            });
                          }}
                          className={`cursor-move hover:bg-gray-50 transition-colors ${draggedCoreValue === value.id ? 'opacity-50' : ''}`}
                        >
                          <td className="px-4 py-4 whitespace-nowrap">
                            <i className="ri-drag-move-2-line text-gray-400 text-xl"></i>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            {iconPath ? (
                              <img
                                src={getAssetPath(iconPath)}
                                alt={value.title || 'Icon'}
                                className="w-12 h-12 object-contain rounded border border-gray-200"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="48" height="48"%3E%3Crect fill="%23ddd" width="48" height="48"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="10"%3ENo Icon%3C/text%3E%3C/svg%3E';
                                }}
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                                <i className="ri-image-line text-gray-400"></i>
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="font-bold text-lg text-gray-900">{value.letter || 'N/A'}</span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="font-medium text-gray-900">{value.title || 'N/A'}</span>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-gray-600 text-sm max-w-xs truncate block">
                              {value.description || 'N/A'}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="text-gray-600">{value.orderIndex || 0}</span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${value.isActive
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-600'
                              }`}>
                              {value.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditCoreValue(value)}
                                className="text-blue-600 hover:text-blue-900"
                                title="Edit"
                              >
                                <i className="ri-edit-line"></i>
                              </button>
                              <button
                                onClick={() => handleDelete(value, 'core-value')}
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
          </div>

          {/* Core Values Section Settings */}
          <div className="bg-white rounded-xl shadow-lg p-8 mt-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Core Values Section Settings</h3>
                <p className="text-gray-500 mt-1">Manage background color and pattern image for the core values section</p>
              </div>
              <button
                onClick={() => handleEditFixedSection('corevalues')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <i className="ri-edit-line"></i>
                Edit Settings
              </button>
            </div>

            {(() => {
              const section = getSectionByKey('corevalues');
              if (!section) {
                return (
                  <div className="text-center py-8">
                    <i className="ri-palette-line text-4xl text-gray-400 mb-2"></i>
                    <p className="text-gray-500 italic">No core values section settings found. Click edit to create.</p>
                  </div>
                );
              }

              const backgroundColor = section.content?.find((c: any) => c.contentKey === 'backgroundColor')?.contentValue || '#247b6b';
              const patternImage = section.content?.find((c: any) => c.contentKey === 'patternImage');
              const patternImagePath = patternImage?.media?.url || patternImage?.media?.filePath || '';
              const title = section.content?.find((c: any) => c.contentKey === 'title')?.contentValue || 'Our Core Values';
              const subtitle = section.content?.find((c: any) => c.contentKey === 'subtitle')?.contentValue || '';

              return (
                <div className="prose max-w-none">
                  <div className="mb-4">
                    <span className="text-sm font-medium text-gray-700">Background Color: </span>
                    <span className="inline-block w-8 h-8 rounded border-2 border-gray-300 ml-2" style={{ backgroundColor }}></span>
                    <span className="ml-2 text-gray-600">{backgroundColor}</span>
                  </div>
                  {patternImagePath && (
                    <div className="mb-4">
                      <span className="text-sm font-medium text-gray-700 block mb-2">Pattern Image:</span>
                      <img
                        src={getAssetPath(patternImagePath)}
                        alt="Pattern"
                        className="w-full max-w-md h-48 object-cover rounded border border-gray-200"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="192"%3E%3Crect fill="%23ddd" width="400" height="192"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="14"%3ENo Image%3C/text%3E%3C/svg%3E';
                        }}
                      />
                    </div>
                  )}
                  {title && <h3 className="text-lg font-bold mb-2">{title}</h3>}
                  {subtitle ? (
                    <p className="text-gray-600 whitespace-pre-wrap">{subtitle}</p>
                  ) : (
                    <p className="text-gray-400 italic text-sm">No subtitle yet. Click edit to add content.</p>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Mission & Vision Section */}
      {activeSection === 'mission-vision' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Mission & Vision Section</h3>
                <p className="text-gray-500 mt-1">Manage mission and vision content</p>
              </div>
              <button
                onClick={() => handleEditFixedSection('mission-vision')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <i className="ri-edit-line"></i>
                Edit Content
              </button>
            </div>

            {(() => {
              const section = getSectionByKey('mission-vision');
              if (!section) {
                return (
                  <div className="text-center py-8">
                    <i className="ri-eye-line text-4xl text-gray-400 mb-2"></i>
                    <p className="text-gray-500 italic">No mission & vision section found. Please create one in the database.</p>
                  </div>
                );
              }

              const missionTitle = section.content?.find((c: any) => c.contentKey === 'missionTitle')?.contentValue;
              const missionText = section.content?.find((c: any) => c.contentKey === 'missionText')?.contentValue;
              const visionTitle = section.content?.find((c: any) => c.contentKey === 'visionTitle')?.contentValue;
              const visionText = section.content?.find((c: any) => c.contentKey === 'visionText')?.contentValue;

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    {missionTitle && <h4 className="text-lg font-bold mb-2">{missionTitle}</h4>}
                    {missionText ? (
                      <p className="text-gray-600 whitespace-pre-wrap">{missionText}</p>
                    ) : (
                      <p className="text-gray-400 italic text-sm">No mission content yet.</p>
                    )}
                  </div>
                  <div>
                    {visionTitle && <h4 className="text-lg font-bold mb-2">{visionTitle}</h4>}
                    {visionText ? (
                      <p className="text-gray-600 whitespace-pre-wrap">{visionText}</p>
                    ) : (
                      <p className="text-gray-400 italic text-sm">No vision content yet.</p>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Story/Timeline Section */}
      {activeSection === 'story-timeline' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Story/Timeline Section</h3>
                <p className="text-gray-500 mt-1">Manage story and timeline content</p>
              </div>
              <button
                onClick={() => handleEditFixedSection('story')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <i className="ri-edit-line"></i>
                Edit Content
              </button>
            </div>

            {(() => {
              const section = getSectionByKey('story');
              if (!section) {
                return (
                  <div className="text-center py-8">
                    <i className="ri-time-line text-4xl text-gray-400 mb-2"></i>
                    <p className="text-gray-500 italic">No story/timeline section found. Please create one in the database.</p>
                  </div>
                );
              }

              const heading = section.content?.find((c: any) => c.contentKey === 'heading')?.contentValue;
              const description = section.content?.find((c: any) => c.contentKey === 'description')?.contentValue;
              const timeline = section.content?.find((c: any) => c.contentKey === 'timeline');
              let timelineData: any[] = [];
              if (timeline && timeline.contentType === 'json') {
                try {
                  timelineData = JSON.parse(timeline.contentValue || '[]');
                } catch (e) {
                  // Keep empty array
                }
              }

              return (
                <div className="prose max-w-none">
                  {heading && <h3 className="text-lg font-bold mb-2">{heading}</h3>}
                  {description && <p className="text-gray-600 whitespace-pre-wrap mb-4">{description}</p>}
                  {timelineData.length > 0 ? (
                    <div className="space-y-4">
                      {timelineData.map((item: any, index: number) => (
                        <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                          {item.year && <span className="font-bold text-blue-600">{item.year}</span>}
                          {item.title && <h4 className="font-semibold mt-1">{item.title}</h4>}
                          {item.description && <p className="text-gray-600 text-sm mt-1">{item.description}</p>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 italic">No timeline data yet. Click edit to add timeline items.</p>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Careers CTA Section */}
      {activeSection === 'careers-cta' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Careers CTA Section</h3>
                <p className="text-gray-500 mt-1">Manage careers call-to-action content</p>
              </div>
              <button
                onClick={() => handleEditFixedSection('careers-cta')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <i className="ri-edit-line"></i>
                Edit Content
              </button>
            </div>

            {(() => {
              const section = getSectionByKey('careers-cta');
              if (!section) {
                return (
                  <div className="text-center py-8">
                    <i className="ri-briefcase-4-line text-4xl text-gray-400 mb-2"></i>
                    <p className="text-gray-500 italic">No careers CTA section found. Please create one in the database.</p>
                  </div>
                );
              }

              const title = section.content?.find((c: any) => c.contentKey === 'title')?.contentValue;
              const description = section.content?.find((c: any) => c.contentKey === 'description')?.contentValue;
              const buttonText = section.content?.find((c: any) => c.contentKey === 'buttonText')?.contentValue;
              const buttonLink = section.content?.find((c: any) => c.contentKey === 'buttonLink')?.contentValue;

              return (
                <div className="prose max-w-none">
                  {title && <h3 className="text-lg font-bold mb-2">{title}</h3>}
                  {description ? (
                    <p className="text-gray-600 whitespace-pre-wrap mb-4">{description}</p>
                  ) : (
                    <p className="text-gray-400 italic mb-4">No description yet.</p>
                  )}
                  {buttonText && (
                    <div className="mt-4">
                      <span className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md">
                        {buttonText} {buttonLink && <span className="text-xs">→ {buttonLink}</span>}
                      </span>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
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
                    onClick={() => {
                      setEditingItem(null);
                      setFormData({
                        sectionId: selectedSection.id,
                        contentKey: '',
                        contentType: 'text',
                        contentValue: '',
                        mediaId: null
                      });
                      setModalType('add');
                      setCurrentEntityType(`section-content-${selectedSection.sectionKey}`);
                      setShowModal(true);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <i className="ri-add-line"></i>
                    Add Content
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
                          if (item.mediaId && item.media) {
                            const mediaPath = item.media.url || item.media.filePath || '';
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
                          return <span className="text-gray-400 text-xs">No media</span>;
                        }
                      }
                    ]}
                    onEdit={(item) => handleEditSectionContent(item, selectedSection)}
                    onDelete={(item) => handleDelete(item, 'section-content')}
                  />
                ) : (
                  <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <i className="ri-file-list-line text-4xl text-gray-400 mb-2"></i>
                    <p className="text-gray-600 mb-4">No content items in this section</p>
                    <button
                      onClick={() => {
                        setEditingItem(null);
                        setFormData({
                          sectionId: selectedSection.id,
                          contentKey: '',
                          contentType: 'text',
                          contentValue: '',
                          mediaId: null
                        });
                        setModalType('add');
                        setCurrentEntityType(`section-content-${selectedSection.sectionKey}`);
                        setShowModal(true);
                      }}
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
    </div>
  );
}
