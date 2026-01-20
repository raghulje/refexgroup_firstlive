import { useState, useEffect } from 'react';
import { getAssetPath } from '../../shared/utils';
import type { CMSComponentProps } from '../../shared/types';
import { pagesService, sectionsService } from '../../../../services/apiService';

interface NewsroomProps extends Partial<CMSComponentProps> {
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

export default function Newsroom_cms({
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
}: NewsroomProps) {
  const [newsroomPage, setNewsroomPage] = useState<any>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('hero');

  // Fixed section keys that should not appear in dynamic sections
  const fixedSectionKeys = ['hero', 'cta'];

  useEffect(() => {
    fetchNewsroomData();
  }, []);

  useEffect(() => {
    const handleRefresh = () => {
      fetchNewsroomData();
    };
    window.addEventListener('cms-refresh', handleRefresh);
    return () => window.removeEventListener('cms-refresh', handleRefresh);
  }, []);

  const fetchNewsroomData = async () => {
    try {
      setLoading(true);
      const page = await pagesService.getBySlug('newsroom');
      setNewsroomPage(page);

      if (page?.id) {
        const pageSections = await sectionsService.getByPageId(page.id);
        console.log('Fetched newsroom sections:', pageSections);
        setSections(pageSections);

        // Log section details for debugging
        pageSections.forEach((section: any) => {
          console.log(`Section ${section.sectionKey}:`, {
            id: section.id,
            hasContent: !!section.content,
            contentCount: section.content?.length || 0,
            content: section.content
          });

          // Specifically log backgroundImage content
          if (section.sectionKey === 'hero') {
            const bgImage = section.content?.find((c: any) => c.contentKey === 'backgroundImage');
            console.log('Hero backgroundImage content:', {
              exists: !!bgImage,
              id: bgImage?.id,
              contentKey: bgImage?.contentKey,
              contentValue: bgImage?.contentValue,
              mediaId: bgImage?.mediaId,
              hasMedia: !!bgImage?.media,
              media: bgImage?.media
            });
          }
        });
      }
    } catch (error) {
      console.error('Error fetching newsroom data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSectionByKey = (key: string) => {
    return sections.find(s => s.sectionKey === key);
  };

  const getContentValue = (section: any, key: string) => {
    if (!section?.content) return null;
    const contentItem = section.content.find((c: any) => c.contentKey === key);
    return contentItem?.contentValue || null;
  };

  const handleCreateSection = async (sectionKey: string) => {
    if (!newsroomPage?.id) return;

    try {
      // Create the section
      const newSection = await sectionsService.create({
        pageId: newsroomPage.id,
        sectionKey: sectionKey,
        sectionType: 'content',
        isActive: true,
        orderIndex: sectionKey === 'hero' ? 0 : 1
      });

      // Refresh sections
      const updatedSections = await sectionsService.getByPageId(newsroomPage.id);
      setSections(updatedSections);

      // Now open the edit modal for the new section
      const createdSection = updatedSections.find((s: any) => s.sectionKey === sectionKey);
      if (createdSection) {
        handleEditFixedSection(createdSection);
      }
    } catch (error) {
      console.error('Error creating section:', error);
    }
  };

  const handleEditFixedSection = async (targetSection: any) => {
    if (!targetSection) {
      // If no section provided, try to find it or create it
      const sectionKey = activeSection;
      let section = getSectionByKey(sectionKey);

      if (!section && newsroomPage?.id) {
        // Create the section if it doesn't exist
        await handleCreateSection(sectionKey);
        return;
      }

      if (!section) return;
      targetSection = section;
    }

    // Fetch fresh section data to ensure we have the latest content
    try {
      const freshSection = await sectionsService.getById(targetSection.id);
      if (!freshSection) {
        console.error('Section not found');
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
            if (item.contentKey === 'backgroundImage') {
              if (item.mediaId) {
                contentData[item.contentKey] = item.mediaId;
              } else if (item.media?.id) {
                contentData[item.contentKey] = item.media.id;
              } else if (item.contentValue && (item.contentValue.startsWith('/') || item.contentValue.startsWith('http'))) {
                contentData[item.contentKey] = item.contentValue;
              } else {
                contentData[item.contentKey] = item.contentValue || '';
              }
            } else {
              contentData[item.contentKey] = item.contentValue || '';
            }
          }

          // Handle media relationships for other fields
          if (item.mediaId || item.media) {
            contentData[`${item.contentKey}Id`] = item.mediaId || item.media?.id || null;
          }
        });
      }

      setEditingItem(freshSection);
      setFormData(contentData);
      setModalType('edit');
      // Map section keys to entity types
      const entityTypeMap: { [key: string]: string } = {
        'hero': 'section-content-hero-newsroom',
        'cta': 'section-content-cta-newsroom'
      };
      setCurrentEntityType(entityTypeMap[freshSection.sectionKey] || `section-content-${freshSection.sectionKey}`);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching section data:', error);
    }
  };

  const heroSection = getSectionByKey('hero');
  const ctaSection = getSectionByKey('cta');

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <h2 className="text-2xl font-bold text-gray-800">Newsroom Page Management</h2>

      {/* Info Message about Press Releases and Events */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <i className="ri-information-line text-2xl text-blue-600"></i>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Press Releases & Events</h3>
            <p className="text-blue-800 mb-3">
              To create or manage press releases and events, please go to the <strong>Home Page CMS</strong> → <strong>Newsroom Section</strong>.
            </p>
            <p className="text-sm text-blue-700">
              All press releases and events created there will automatically appear on the Newsroom page.
            </p>
          </div>
        </div>
      </div>

      {/* Section Tabs */}
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
        </div>
      </div>

      {/* Hero Section */}
      {activeSection === 'hero' && heroSection && (
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
              {(() => {
                const bgImage = heroSection.content?.find((c: any) => c.contentKey === 'backgroundImage');
                if (!bgImage) {
                  return <p className="text-gray-400">No image set</p>;
                }

                // Debug logging
                console.log('Background image content item:', {
                  id: bgImage.id,
                  contentKey: bgImage.contentKey,
                  contentValue: bgImage.contentValue,
                  mediaId: bgImage.mediaId,
                  hasMedia: !!bgImage.media,
                  media: bgImage.media
                });

                // Try multiple sources for the image path
                let imagePath = '';
                if (bgImage.media?.filePath) {
                  imagePath = bgImage.media.filePath;
                } else if (bgImage.media?.url) {
                  imagePath = bgImage.media.url;
                } else if (bgImage.contentValue && bgImage.contentValue.trim() !== '') {
                  imagePath = bgImage.contentValue;
                }

                console.log('Resolved image path:', imagePath);

                if (imagePath) {
                  const finalPath = getAssetPath(imagePath);
                  console.log('Final asset path:', finalPath);
                  return (
                    <div>
                      <img
                        src={finalPath}
                        alt="Hero Background"
                        className="w-full h-48 object-cover rounded-lg border border-gray-200"
                        onError={(e) => {
                          console.error('Failed to load image:', {
                            originalPath: imagePath,
                            finalPath: finalPath,
                            contentValue: bgImage.contentValue,
                            mediaId: bgImage.mediaId
                          });
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                        onLoad={() => {
                          console.log('Image loaded successfully:', finalPath);
                        }}
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Media ID: {bgImage.mediaId || 'None'} | Path: {imagePath}
                      </p>
                    </div>
                  );
                }
                return (
                  <div>
                    <p className="text-gray-400">No image set</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Debug: contentValue={bgImage.contentValue || 'empty'}, mediaId={bgImage.mediaId || 'none'}
                    </p>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {activeSection === 'hero' && !heroSection && (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <i className="ri-image-2-line text-4xl text-gray-400 mb-4"></i>
          <p className="text-gray-600 mb-4">No hero section found. Create one to start managing the hero content.</p>
          <button
            onClick={() => handleCreateSection('hero')}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
          >
            <i className="ri-add-line"></i>
            Create Hero Section
          </button>
        </div>
      )}

      {/* CTA Section */}
      {activeSection === 'cta' && ctaSection && (
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
              <label className="text-sm font-medium text-gray-700">Background Gradient From</label>
              <p className="text-gray-600">{getContentValue(ctaSection, 'bgGradientFrom') || 'Not set'}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Background Gradient To</label>
              <p className="text-gray-600">{getContentValue(ctaSection, 'bgGradientTo') || 'Not set'}</p>
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium text-gray-700">CTA Cards</label>
              {(() => {
                try {
                  const cardsData = getContentValue(ctaSection, 'cards');
                  let cards: any[] = [];

                  if (Array.isArray(cardsData)) {
                    cards = cardsData;
                  } else if (typeof cardsData === 'string' && cardsData) {
                    cards = JSON.parse(cardsData);
                  }

                  // Fallback to individual card fields
                  if (cards.length === 0) {
                    const card1Title = getContentValue(ctaSection, 'card1Title');
                    const card2Title = getContentValue(ctaSection, 'card2Title');
                    if (card1Title) {
                      cards.push({
                        title: card1Title,
                        buttonText: getContentValue(ctaSection, 'card1ButtonText') || '',
                        buttonLink: getContentValue(ctaSection, 'card1ButtonLink') || ''
                      });
                    }
                    if (card2Title) {
                      cards.push({
                        title: card2Title,
                        buttonText: getContentValue(ctaSection, 'card2ButtonText') || '',
                        buttonLink: getContentValue(ctaSection, 'card2ButtonLink') || ''
                      });
                    }
                  }

                  if (cards.length === 0) {
                    return <p className="text-gray-400">No cards configured</p>;
                  }

                  return (
                    <div className="space-y-3">
                      {cards.map((card: any, idx: number) => (
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
      )}

      {activeSection === 'cta' && !ctaSection && (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <i className="ri-arrow-right-circle-line text-4xl text-gray-400 mb-4"></i>
          <p className="text-gray-600 mb-4">No CTA section found. Create one to start managing the CTA content.</p>
          <button
            onClick={() => handleCreateSection('cta')}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
          >
            <i className="ri-add-line"></i>
            Create CTA Section
          </button>
        </div>
      )}
    </div>
  );
}
