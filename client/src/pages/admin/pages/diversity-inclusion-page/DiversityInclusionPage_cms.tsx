import { useState, useEffect } from 'react';
import { DataTable } from '../../shared/DataTable';
import { getAssetPath } from '../../shared/utils';
import type { CMSComponentProps } from '../../shared/types';
import { pagesService, sectionsService } from '../../../../services/apiService';

interface DiversityInclusionPageProps extends Partial<CMSComponentProps> {
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

export default function DiversityInclusionPage_cms({
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
}: DiversityInclusionPageProps) {
  const [diversityPage, setDiversityPage] = useState<any>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('hero');

  // Fixed section keys that should not appear in dynamic sections
  const fixedSectionKeys = ['hero', 'be-you', 'believe', 'initiatives', 'cta'];

  useEffect(() => {
    fetchDiversityData();
  }, []);

  useEffect(() => {
    const handleRefresh = () => {
      fetchDiversityData();
    };
    window.addEventListener('cms-refresh', handleRefresh);
    return () => window.removeEventListener('cms-refresh', handleRefresh);
  }, []);

  const fetchDiversityData = async () => {
    try {
      setLoading(true);
      const page = await pagesService.getBySlug('diversity-inclusion');
      setDiversityPage(page);

      const pageSections = await sectionsService.getByPageId(page.id);
      setSections(pageSections);
    } catch (error) {
      console.error('Error fetching diversity data:', error);
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

  const handleEditFixedSection = async (targetSection: any) => {
    if (!targetSection) return;

    const contentData: any = {};

    if (targetSection.content && Array.isArray(targetSection.content)) {
      targetSection.content.forEach((item: any) => {
        if (item.contentType === 'json') {
          try {
            const parsed = JSON.parse(item.contentValue);
            
            // Special handling for beliefs - convert iconPath from /uploads/media/{id} to media ID
            if (item.contentKey === 'beliefs' && Array.isArray(parsed)) {
              const processedBeliefs = parsed.map((belief: any) => {
                const processedBelief = { ...belief };
                
                // Convert iconPath from storage format to form format
                if (processedBelief.iconPath) {
                  if (typeof processedBelief.iconPath === 'string') {
                    const iconStr = processedBelief.iconPath.trim();
                    
                    if (iconStr === '') {
                      processedBelief.iconPath = '';
                    } else if (iconStr.startsWith('/uploads/media/')) {
                      // Extract media ID from /uploads/media/{id} format
                      const mediaIdMatch = iconStr.match(/\/uploads\/media\/(\d+)/);
                      if (mediaIdMatch) {
                        processedBelief.iconPath = parseInt(mediaIdMatch[1]);
                      } else {
                        processedBelief.iconPath = iconStr; // Keep as path if can't extract
                      }
                    } else if (iconStr.startsWith('/uploads/images/') || 
                               iconStr.startsWith('http://') || 
                               iconStr.startsWith('https://')) {
                      // Direct path or URL - use as string
                      processedBelief.iconPath = iconStr;
                    } else if (/^\d+$/.test(iconStr)) {
                      // Numeric string - convert to number
                      processedBelief.iconPath = parseInt(iconStr);
                    } else {
                      // Other string - use as-is
                      processedBelief.iconPath = iconStr;
                    }
                  } else if (typeof processedBelief.iconPath === 'number' && processedBelief.iconPath > 0) {
                    // Already a media ID - keep as-is
                    processedBelief.iconPath = processedBelief.iconPath;
                  }
                }
                
                return processedBelief;
              });
              
              contentData[item.contentKey] = processedBeliefs;
            } else {
              // For other JSON content, parse normally
              contentData[item.contentKey] = parsed;
            }
          } catch {
            contentData[item.contentKey] = item.contentValue;
          }
        } else {
          // For image fields, use mediaId if available
          if (item.mediaId) {
            contentData[item.contentKey] = item.mediaId;
          } else {
            contentData[item.contentKey] = item.contentValue;
          }
        }
      });
    }

    setEditingItem(targetSection);
    setFormData(contentData);
    setModalType('edit');

    // Set entity type based on section key
    if (targetSection.sectionKey === 'hero') {
      setCurrentEntityType('section-content-hero-diversity');
    } else if (targetSection.sectionKey === 'cta') {
      setCurrentEntityType('section-content-cta-diversity');
    } else {
      setCurrentEntityType(`section-content-${targetSection.sectionKey}`);
    }

    setShowModal(true);
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  const heroSection = getSectionByKey('hero');
  const beYouSection = getSectionByKey('be-you');
  const believeSection = getSectionByKey('believe');
  const initiativesSection = getSectionByKey('initiatives');
  const ctaSection = getSectionByKey('cta');

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Diversity & Inclusion Page Management</h2>
        <button
          onClick={() => window.open('/diversity-inclusion', '_blank')}
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
            <i className="ri-image-2-line text-base"></i>
            <span className="font-medium">Hero</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'hero'
                ? 'bg-blue-200 text-blue-800'
                : 'bg-gray-200 text-gray-600'
              }`}>
              1
            </span>
          </button>

          {/* BeYou Section Tab */}
          <button
            onClick={() => setActiveSection('be-you')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'be-you'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-user-heart-line text-base"></i>
            <span className="font-medium">Be YOU</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'be-you'
                ? 'bg-blue-200 text-blue-800'
                : 'bg-gray-200 text-gray-600'
              }`}>
              1
            </span>
          </button>

          {/* Believe Section Tab */}
          <button
            onClick={() => setActiveSection('believe')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'believe'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-heart-line text-base"></i>
            <span className="font-medium">Believe</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'believe'
                ? 'bg-blue-200 text-blue-800'
                : 'bg-gray-200 text-gray-600'
              }`}>
              1
            </span>
          </button>

          {/* Initiatives Section Tab */}
          <button
            onClick={() => setActiveSection('initiatives')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'initiatives'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-lightbulb-line text-base"></i>
            <span className="font-medium">Initiatives</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'initiatives'
                ? 'bg-blue-200 text-blue-800'
                : 'bg-gray-200 text-gray-600'
              }`}>
              1
            </span>
          </button>

          {/* CTA Section Tab */}
          <button
            onClick={() => setActiveSection('cta')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'cta'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-arrow-right-circle-line text-base"></i>
            <span className="font-medium">CTA</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'cta'
                ? 'bg-blue-200 text-blue-800'
                : 'bg-gray-200 text-gray-600'
              }`}>
              1
            </span>
          </button>

          {/* Dynamic Page Sections Tabs */}
          {sections
            .filter(s => !fixedSectionKeys.includes(s.sectionKey))
            .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))
            .map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.sectionKey)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === section.sectionKey
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
              >
                <i className="ri-file-list-line text-base"></i>
                <span className="font-medium capitalize">
                  {section.sectionKey?.replace(/-/g, ' ') || 'Untitled Section'}
                </span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === section.sectionKey
                    ? 'bg-blue-200 text-blue-800'
                    : 'bg-gray-200 text-gray-600'
                  }`}>
                  {section.content?.length || 0}
                </span>
              </button>
            ))}
        </div>
      </div>

      {/* Hero Section */}
      {activeSection === 'hero' && (
        <>
          {heroSection ? (
            <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">Hero Section</h3>
                  <p className="text-sm text-gray-500 mt-1">Manage hero section content</p>
                </div>
                <button
                  onClick={() => handleEditFixedSection(heroSection)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <i className="ri-edit-line"></i>
                  Edit Content
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-medium text-gray-700">Title</label>
                  <p className="text-gray-900">{getContentValue(heroSection, 'title') || 'Not set'}</p>
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <p className="text-gray-600">{getContentValue(heroSection, 'description') || 'Not set'}</p>
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-medium text-gray-700">Background Image</label>
                  {getImagePath(heroSection, 'backgroundImage') ? (
                    <img
                      src={getAssetPath(getImagePath(heroSection, 'backgroundImage'))}
                      alt="Hero Background"
                      className="w-full h-48 object-cover rounded-lg border border-gray-200"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTdlOWViIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzljYTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==800x300?text=No+Image';
                      }}
                    />
                  ) : (
                    <p className="text-gray-400">No image set</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No Hero section found. Please create one in the database.</p>
                <button
                  onClick={async () => {
                    if (!diversityPage) return;
                    try {
                      const newSection = await sectionsService.create({
                        pageId: diversityPage.id,
                        sectionType: 'hero',
                        sectionKey: 'hero',
                        orderIndex: 0,
                        isActive: true
                      });
                      await fetchDiversityData();
                      setActiveSection('hero');
                    } catch (error) {
                      console.error('Error creating hero section:', error);
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Hero Section
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* BeYou Section */}
      {activeSection === 'be-you' && (
        <>
          {beYouSection ? (
            <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">Be YOU Section</h3>
                  <p className="text-sm text-gray-500 mt-1">Manage Be YOU section content</p>
                </div>
                <button
                  onClick={() => handleEditFixedSection(beYouSection)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <i className="ri-edit-line"></i>
                  Edit Content
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Title</label>
                  <p className="text-gray-900">{getContentValue(beYouSection, 'title') || 'Not set'}</p>
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-medium text-gray-700">Image</label>
                  {getImagePath(beYouSection, 'image') ? (
                    <img
                      src={getAssetPath(getImagePath(beYouSection, 'image'))}
                      alt="Be YOU"
                      className="w-full h-64 object-cover rounded-lg border border-gray-200"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTdlOWViIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzljYTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==800x400?text=No+Image';
                      }}
                    />
                  ) : (
                    <p className="text-gray-400">No image set</p>
                  )}
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-medium text-gray-700">Content</label>
                  {(() => {
                    try {
                      const content = JSON.parse(getContentValue(beYouSection, 'content') || '[]');
                      return (
                        <div className="space-y-2">
                          {Array.isArray(content) && content.map((para: string, idx: number) => (
                            <p key={idx} className="text-gray-600">{para}</p>
                          ))}
                        </div>
                      );
                    } catch {
                      return <p className="text-gray-600">{getContentValue(beYouSection, 'content') || 'Not set'}</p>;
                    }
                  })()}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No Be YOU section found. Please create one in the database.</p>
                <button
                  onClick={async () => {
                    if (!diversityPage) return;
                    try {
                      const newSection = await sectionsService.create({
                        pageId: diversityPage.id,
                        sectionType: 'content',
                        sectionKey: 'be-you',
                        orderIndex: 1,
                        isActive: true
                      });
                      await fetchDiversityData();
                      setActiveSection('be-you');
                    } catch (error) {
                      console.error('Error creating be-you section:', error);
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Be YOU Section
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Believe Section */}
      {activeSection === 'believe' && (
        <>
          {believeSection ? (
            <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">Believe Section</h3>
                  <p className="text-sm text-gray-500 mt-1">Manage beliefs content</p>
                </div>
                <button
                  onClick={() => handleEditFixedSection(believeSection)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <i className="ri-edit-line"></i>
                  Edit Content
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Title</label>
                  <p className="text-gray-900">{getContentValue(believeSection, 'title') || 'Not set'}</p>
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-medium text-gray-700">Beliefs</label>
                  {(() => {
                    try {
                      const beliefs = JSON.parse(getContentValue(believeSection, 'beliefs') || '[]');
                      return (
                        <div className="space-y-3">
                          {Array.isArray(beliefs) && beliefs.map((belief: any, idx: number) => (
                            <div key={idx} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                              <h4 className="font-semibold text-gray-900 mb-2">{belief.title || `Belief ${idx + 1}`}</h4>
                              <p className="text-sm text-gray-600">{belief.description || 'No description'}</p>
                            </div>
                          ))}
                        </div>
                      );
                    } catch {
                      return <p className="text-gray-400">No beliefs data</p>;
                    }
                  })()}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No Believe section found. Please create one in the database.</p>
                <button
                  onClick={async () => {
                    if (!diversityPage) return;
                    try {
                      const newSection = await sectionsService.create({
                        pageId: diversityPage.id,
                        sectionType: 'content',
                        sectionKey: 'believe',
                        orderIndex: 2,
                        isActive: true
                      });
                      await fetchDiversityData();
                      setActiveSection('believe');
                    } catch (error) {
                      console.error('Error creating believe section:', error);
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Believe Section
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Initiatives Section */}
      {activeSection === 'initiatives' && (
        <>
          {initiativesSection ? (
            <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">Initiatives Section</h3>
                  <p className="text-sm text-gray-500 mt-1">Manage initiatives content</p>
                </div>
                <button
                  onClick={() => handleEditFixedSection(initiativesSection)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <i className="ri-edit-line"></i>
                  Edit Content
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Title</label>
                  <p className="text-gray-900">{getContentValue(initiativesSection, 'title') || 'Not set'}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <p className="text-gray-600">{getContentValue(initiativesSection, 'description') || 'Not set'}</p>
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-medium text-gray-700">Slider Images</label>
                  {(() => {
                    try {
                      const sliderImages = JSON.parse(getContentValue(initiativesSection, 'sliderImages') || '[]');
                      return (
                        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                          <p className="text-xs text-gray-500 mb-2">Total: {sliderImages.length || 0} images</p>
                          {Array.isArray(sliderImages) && sliderImages.length > 0 && (
                            <div className="flex gap-2 flex-wrap">
                              {sliderImages.slice(0, 5).map((img: string, idx: number) => (
                                <img key={idx} src={img.startsWith('/uploads/') ? `http://localhost:3002${img}` : img} alt={`Slider ${idx + 1}`} className="w-16 h-16 object-cover rounded" />
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    } catch {
                      return <p className="text-gray-400">No slider images</p>;
                    }
                  })()}
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-medium text-gray-700">Initiatives</label>
                  {(() => {
                    try {
                      // Try new format first
                      let initiativesList: any[] = [];
                      const initiativesJson = getContentValue(initiativesSection, 'initiatives');
                      if (initiativesJson) {
                        initiativesList = JSON.parse(initiativesJson);
                      } else {
                        // Fallback to old format
                        const vamika = getContentValue(initiativesSection, 'vamika');
                        const kravMaga = getContentValue(initiativesSection, 'kravMaga');
                        if (vamika) {
                          try {
                            const parsed = JSON.parse(vamika);
                            initiativesList.push({ name: 'Vamika', ...parsed });
                          } catch { }
                        }
                        if (kravMaga) {
                          try {
                            const parsed = JSON.parse(kravMaga);
                            initiativesList.push({ name: 'Krav Maga', ...parsed });
                          } catch { }
                        }
                      }

                      if (initiativesList.length === 0) {
                        return <p className="text-gray-400">No initiatives</p>;
                      }

                      // Helper to resolve image URL
                      const resolveImageUrl = (img: any): string => {
                        if (typeof img === 'number') {
                          return getAssetPath(`/uploads/media/${img}`);
                        } else if (typeof img === 'string') {
                          if (img.startsWith('/uploads/')) {
                            return getAssetPath(img);
                          } else if (img.startsWith('http://') || img.startsWith('https://')) {
                            return img;
                          } else {
                            return getAssetPath(img);
                          }
                        } else if (img?.filePath) {
                          return getAssetPath(img.filePath);
                        } else if (img?.url) {
                          return img.url;
                        }
                        return '';
                      };

                      return (
                        <div className="space-y-3">
                          {initiativesList.map((init: any, idx: number) => (
                            <div key={idx} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                              <h4 className="font-semibold text-gray-900 mb-2">{init.name || `Initiative ${idx + 1}`}</h4>
                              <p className="text-sm text-gray-600 mb-2">{init.description || 'No description'}</p>
                              
                              {/* Logo Preview */}
                              {init.logo && (
                                <div className="mb-3">
                                  <p className="text-xs text-gray-500 mb-1">Logo:</p>
                                  <img 
                                    src={resolveImageUrl(init.logo)} 
                                    alt={`${init.name} Logo`}
                                    className="h-12 w-auto object-contain border border-gray-200 rounded p-1 bg-white"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                  />
                                </div>
                              )}
                              
                              {/* Images Grid Preview */}
                              {init.images && Array.isArray(init.images) && init.images.length > 0 && (
                                <div className="mb-3">
                                  <p className="text-xs text-gray-500 mb-2">Images ({init.images.length}):</p>
                                  <div className="grid grid-cols-4 gap-2">
                                    {init.images.map((img: any, imgIdx: number) => {
                                      const imgUrl = resolveImageUrl(img);
                                      const isCover = init.coverImage === img || 
                                                     (typeof init.coverImage === 'string' && typeof img === 'string' && init.coverImage === img) ||
                                                     (typeof init.coverImage === 'number' && typeof img === 'number' && init.coverImage === img);
                                      return (
                                        <div key={imgIdx} className="relative aspect-square rounded border border-gray-200 overflow-hidden bg-gray-100">
                                          <img 
                                            src={imgUrl} 
                                            alt={`Image ${imgIdx + 1}`}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                              (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%23ddd"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy=".3em" fill="%23999" font-size="10"%3EImage%3C/text%3E%3C/svg%3E';
                                            }}
                                          />
                                          {isCover && (
                                            <div className="absolute top-1 right-1 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                              <i className="ri-image-line text-xs"></i>
                                            </div>
                                          )}
                                          <div className="absolute top-1 left-1 bg-black/70 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                            {imgIdx + 1}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                              
                              {(!init.images || init.images.length === 0) && (
                                <p className="text-xs text-gray-500">No images</p>
                              )}
                            </div>
                          ))}
                        </div>
                      );
                    } catch {
                      return <p className="text-gray-400">Error parsing initiatives</p>;
                    }
                  })()}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No Initiatives section found. Please create one in the database.</p>
                <button
                  onClick={async () => {
                    if (!diversityPage) return;
                    try {
                      const newSection = await sectionsService.create({
                        pageId: diversityPage.id,
                        sectionType: 'content',
                        sectionKey: 'initiatives',
                        orderIndex: 3,
                        isActive: true
                      });
                      await fetchDiversityData();
                      setActiveSection('initiatives');
                    } catch (error) {
                      console.error('Error creating initiatives section:', error);
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Initiatives Section
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* CTA Section */}
      {activeSection === 'cta' && (
        <>
          {ctaSection ? (
            <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">CTA Section</h3>
                  <p className="text-sm text-gray-500 mt-1">Manage CTA section content</p>
                </div>
                <button
                  onClick={() => handleEditFixedSection(ctaSection)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <i className="ri-edit-line"></i>
                  Edit Content
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Background Color/Gradient</label>
                  <p className="text-gray-600 text-sm">{getContentValue(ctaSection, 'backgroundColor') || 'Not set'}</p>
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-medium text-gray-700">CTA Cards</label>
                  {(() => {
                    try {
                      const cards = JSON.parse(getContentValue(ctaSection, 'cards') || '[]');
                      return (
                        <div className="space-y-3">
                          {Array.isArray(cards) && cards.map((card: any, idx: number) => (
                            <div key={idx} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                              <h4 className="font-semibold text-gray-900 mb-2">{card.title || `Card ${idx + 1}`}</h4>
                              <p className="text-sm text-gray-600">Button: {card.buttonText} → {card.buttonLink}</p>
                            </div>
                          ))}
                        </div>
                      );
                    } catch {
                      return <p className="text-gray-400">No cards data</p>;
                    }
                  })()}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No CTA section found. Please create one in the database.</p>
                <button
                  onClick={async () => {
                    if (!diversityPage) return;
                    try {
                      const newSection = await sectionsService.create({
                        pageId: diversityPage.id,
                        sectionType: 'cta',
                        sectionKey: 'cta',
                        orderIndex: 4,
                        isActive: true
                      });
                      await fetchDiversityData();
                      setActiveSection('cta');
                    } catch (error) {
                      console.error('Error creating cta section:', error);
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create CTA Section
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Dynamic Page Sections */}
      {!fixedSectionKeys.includes(activeSection) && (() => {
        const selectedSection = sections.find(s => s.sectionKey === activeSection);
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
                onEdit={(item) => {
                  setEditingItem(item);
                  const formDataToSet: any = {
                    ...item,
                    mediaId: item.mediaId || item.media?.id || null,
                    sectionId: selectedSection.id,
                    _section: selectedSection
                  };
                  if (item.contentType === 'json' && typeof item.contentValue === 'string') {
                    try {
                      formDataToSet.contentValue = JSON.parse(item.contentValue);
                    } catch (e) { }
                  }
                  setFormData(formDataToSet);
                  setModalType('edit');
                  setCurrentEntityType(`section-content-${selectedSection.sectionKey}`);
                  setShowModal(true);
                }}
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
  );
}
