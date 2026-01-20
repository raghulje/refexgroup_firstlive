import { useState, useEffect } from 'react';
import { DataTable } from '../../shared/DataTable';
import { getAssetPath } from '../../shared/utils';
import type { CMSComponentProps } from '../../shared/types';
import { pagesService, sectionsService } from '../../../../services/apiService';

interface RefexRenewablesPageProps extends Partial<CMSComponentProps> {
  setShowModal: (show: boolean) => void;
  setModalType: (type: 'add' | 'edit') => void;
  setEditingItem: (item: any) => void;
  setFormData: (data: any) => void;
  handleDelete: (item: any, entityType?: string) => void;

  setCurrentEntityType: (type: string) => void;
}

export default function RefexRenewablesPage_cms({
  setShowModal,
  setModalType,
  setEditingItem,
  setFormData,
  handleDelete,

  setCurrentEntityType
}: RefexRenewablesPageProps) {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('hero');

  // Fixed section keys that should not appear in dynamic sections
  const fixedSectionKeys = ['hero', 'category-cards', 'benefits', 'featured-projects', 'cta'];

  useEffect(() => {
    fetchRenewablesData();
  }, []);

  useEffect(() => {
    const handleRefresh = () => {
      fetchRenewablesData();
    };
    window.addEventListener('cms-refresh', handleRefresh);
    return () => window.removeEventListener('cms-refresh', handleRefresh);
  }, []);

  const fetchRenewablesData = async () => {
    try {
      setLoading(true);
      const page = await pagesService.getBySlug('refex-renewables');

      const pageSections = await sectionsService.getByPageId(page.id);
      setSections(pageSections);
    } catch (error) {
      console.error('Error fetching renewables data:', error);
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
            contentData[item.contentKey] = JSON.parse(item.contentValue);
          } catch {
            contentData[item.contentKey] = item.contentValue;
          }
        } else {
          // For image fields (backgroundImage, sunIcon), use mediaId if available
          // Also convert /uploads/media/{id} paths back to mediaId for ImageUpload component
          if (item.mediaId) {
            contentData[item.contentKey] = item.mediaId;
          } else if (item.contentValue && typeof item.contentValue === 'string') {
            // Check if contentValue is a /uploads/media/{id} path and convert to mediaId
            if (item.contentValue.startsWith('/uploads/media/')) {
              const mediaIdMatch = item.contentValue.match(/\/uploads\/media\/(\d+)/);
              if (mediaIdMatch) {
                contentData[item.contentKey] = parseInt(mediaIdMatch[1]);
              } else {
                contentData[item.contentKey] = item.contentValue;
              }
            } else {
              contentData[item.contentKey] = item.contentValue;
            }
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
      setCurrentEntityType('section-content-hero-renewables');
    } else if (targetSection.sectionKey === 'category-cards') {
      setCurrentEntityType('section-content-category-cards');
    } else if (targetSection.sectionKey === 'benefits') {
      setCurrentEntityType('section-content-benefits');
    } else if (targetSection.sectionKey === 'featured-projects') {
      setCurrentEntityType('section-content-featured-projects');
    } else if (targetSection.sectionKey === 'cta') {
      setCurrentEntityType('section-content-cta-renewables');
    } else {
      setCurrentEntityType(`section-content-${targetSection.sectionKey}`);
    }

    setShowModal(true);
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  const heroSection = getSectionByKey('hero');
  const categoryCardsSection = getSectionByKey('category-cards');
  const benefitsSection = getSectionByKey('benefits');
  const projectsSection = getSectionByKey('featured-projects');
  const ctaSection = getSectionByKey('cta');

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Refex Renewables Page Management</h2>
        <button
          onClick={() => window.open('/refex-renewables', '_blank')}
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

          {/* Category Cards Tab */}
          <button
            onClick={() => setActiveSection('category-cards')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'category-cards'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-layout-grid-line text-base"></i>
            <span className="font-medium">Category Cards</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'category-cards'
                ? 'bg-blue-200 text-blue-800'
                : 'bg-gray-200 text-gray-600'
              }`}>
              1
            </span>
          </button>

          {/* Benefits Tab */}
          <button
            onClick={() => setActiveSection('benefits')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'benefits'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-star-line text-base"></i>
            <span className="font-medium">Benefits</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'benefits'
                ? 'bg-blue-200 text-blue-800'
                : 'bg-gray-200 text-gray-600'
              }`}>
              1
            </span>
          </button>

          {/* Featured Projects Tab */}
          <button
            onClick={() => setActiveSection('featured-projects')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'featured-projects'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-building-line text-base"></i>
            <span className="font-medium">Featured Projects</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'featured-projects'
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
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Tagline</label>
              <p className="text-gray-900">{getContentValue(heroSection, 'tagline') || 'Not set'}</p>
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium text-gray-700">Title</label>
              <p className="text-gray-900">{getContentValue(heroSection, 'title') || 'Not set'}</p>
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <p className="text-gray-600">{getContentValue(heroSection, 'description') || 'Not set'}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Button Text</label>
              <p className="text-gray-600">{getContentValue(heroSection, 'buttonText') || 'Not set'}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Button Link</label>
              <p className="text-gray-600">{getContentValue(heroSection, 'buttonLink') || 'Not set'}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Stat 1</label>
              <p className="text-gray-900">{getContentValue(heroSection, 'stat1Value') || '0'}+ {getContentValue(heroSection, 'stat1Label') || ''}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Stat 2</label>
              <p className="text-gray-900">{getContentValue(heroSection, 'stat2Value') || '0'}+ {getContentValue(heroSection, 'stat2Label') || ''}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Stat 3</label>
              <p className="text-gray-900">{getContentValue(heroSection, 'stat3Value') || '0'}+ {getContentValue(heroSection, 'stat3Label') || ''}</p>
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
      )}

      {/* Category Cards Section */}
      {activeSection === 'category-cards' && categoryCardsSection && (
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Category Cards Section</h3>
              <p className="text-sm text-gray-500 mt-1">Manage category cards</p>
            </div>
            <button
              onClick={() => handleEditFixedSection(categoryCardsSection)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <i className="ri-edit-line"></i>
              Edit Content
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium text-gray-700">Category Cards</label>
              {(() => {
                try {
                  const categories = JSON.parse(getContentValue(categoryCardsSection, 'categories') || '[]');
                  return (
                    <div className="grid grid-cols-3 gap-4">
                      {Array.isArray(categories) && categories.map((category: any, idx: number) => (
                        <div key={idx} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                          <h4 className="font-semibold text-gray-900 mb-2">{category.title || `Category ${idx + 1}`}</h4>
                          {category.image && (
                            <img
                              src={getAssetPath(category.image)}
                              alt={category.title}
                              className="w-full h-32 object-cover rounded border border-gray-200"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTdlOWViIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzljYTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
                              }}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  );
                } catch {
                  return <p className="text-gray-400">No categories data</p>;
                }
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Benefits Section */}
      {activeSection === 'benefits' && benefitsSection && (
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Benefits Section</h3>
              <p className="text-sm text-gray-500 mt-1">Manage benefits content</p>
            </div>
            <button
              onClick={() => handleEditFixedSection(benefitsSection)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <i className="ri-edit-line"></i>
              Edit Content
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium text-gray-700">Title</label>
              <p className="text-gray-900">{getContentValue(benefitsSection, 'title') || 'Not set'}</p>
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium text-gray-700">Benefits</label>
              {(() => {
                try {
                  const benefits = JSON.parse(getContentValue(benefitsSection, 'benefits') || '[]');
                  return (
                    <div className="grid grid-cols-3 gap-4">
                      {Array.isArray(benefits) && benefits.map((benefit: any, idx: number) => (
                        <div key={idx} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                          <h4 className="font-semibold text-gray-900 mb-2">{benefit.title || `Benefit ${idx + 1}`}</h4>
                          <p className="text-sm text-gray-600">{benefit.description || 'No description'}</p>
                        </div>
                      ))}
                    </div>
                  );
                } catch {
                  return <p className="text-gray-400">No benefits data</p>;
                }
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Featured Projects Section */}
      {activeSection === 'featured-projects' && projectsSection && (
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Featured Projects Section</h3>
              <p className="text-sm text-gray-500 mt-1">Manage featured projects</p>
            </div>
            <button
              onClick={() => handleEditFixedSection(projectsSection)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <i className="ri-edit-line"></i>
              Edit Content
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Title</label>
              <p className="text-gray-900">{getContentValue(projectsSection, 'title') || 'Not set'}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <p className="text-gray-600">{getContentValue(projectsSection, 'description') || 'Not set'}</p>
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium text-gray-700">Background Image</label>
              {getImagePath(projectsSection, 'backgroundImage') ? (
                <img
                  src={getAssetPath(getImagePath(projectsSection, 'backgroundImage'))}
                  alt="Projects Background"
                  className="w-full h-48 object-cover rounded-lg border border-gray-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTdlOWViIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzljYTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==800x300?text=No+Image';
                  }}
                />
              ) : (
                <p className="text-gray-400">No image set</p>
              )}
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium text-gray-700">Projects</label>
              {(() => {
                try {
                  const projects = JSON.parse(getContentValue(projectsSection, 'projects') || '[]');
                  return (
                    <div className="space-y-4">
                      {Array.isArray(projects) && projects.map((project: any, idx: number) => (
                        <div key={idx} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                          <h4 className="font-semibold text-gray-900 mb-2">{project.name || `Project ${idx + 1}`}</h4>
                          <p className="text-sm text-gray-600 mb-1"><strong>Location:</strong> {project.location || 'N/A'}</p>
                          <p className="text-sm text-gray-600 mb-1"><strong>Capacity:</strong> {project.capacity || 'N/A'}</p>
                          <p className="text-sm text-gray-600 mb-1">{project.description || 'No description'}</p>
                          <p className="text-sm text-gray-600 mb-1">{project.details || 'No details'}</p>
                          {project.extraDetails && <p className="text-sm text-gray-600">{project.extraDetails}</p>}
                          <p className="text-xs text-gray-500 mt-2">Images: {project.images?.length || 0} images</p>
                        </div>
                      ))}
                    </div>
                  );
                } catch {
                  return <p className="text-gray-400">No projects data</p>;
                }
              })()}
            </div>
          </div>
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
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium text-gray-700">Title</label>
              <p className="text-gray-900">{getContentValue(ctaSection, 'title') || 'Not set'}</p>
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <p className="text-gray-600">{getContentValue(ctaSection, 'description') || 'Not set'}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Button Text</label>
              <p className="text-gray-600">{getContentValue(ctaSection, 'buttonText') || 'Not set'}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Button Link</label>
              <p className="text-gray-600">{getContentValue(ctaSection, 'buttonLink') || 'Not set'}</p>
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium text-gray-700">Background Image</label>
              {getImagePath(ctaSection, 'backgroundImage') ? (
                <img
                  src={getAssetPath(getImagePath(ctaSection, 'backgroundImage'))}
                  alt="CTA Background"
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
