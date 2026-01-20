import { useState, useEffect } from 'react';
import { DataTable } from '../../shared/DataTable';
import { getAssetPath } from '../../shared/utils';
import type { CMSComponentProps } from '../../shared/types';
import { pagesService, sectionsService } from '../../../../services/apiService';

interface RefexAshCoalHandlingPageProps extends Partial<CMSComponentProps> {
  setShowModal: (show: boolean) => void;
  setModalType: (type: 'add' | 'edit') => void;
  setEditingItem: (item: any) => void;
  setFormData: (data: any) => void;
  handleDelete: (item: any, entityType?: string) => void;
  setCurrentEntityType: (type: string) => void;
}

export default function RefexAshCoalHandlingPage_cms({
  setShowModal,
  setModalType,
  setEditingItem,
  setFormData,
  handleDelete,
  setCurrentEntityType
}: RefexAshCoalHandlingPageProps) {
  const [page, setPage] = useState<any>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('hero-section');
  const [activePageSection, setActivePageSection] = useState<string | null>(null);

  // Fixed section keys that should not appear in the dynamic list
  const fixedSectionKeys = ['hero-section', 'overview', 'services', 'cta-section'];

  useEffect(() => {
    fetchPageData();
  }, []);

  useEffect(() => {
    const handleRefresh = () => {
      fetchPageData();
    };
    window.addEventListener('cms-refresh', handleRefresh);
    return () => window.removeEventListener('cms-refresh', handleRefresh);
  }, []);

  const fetchPageData = async () => {
    try {
      setLoading(true);
      const output = await pagesService.getBySlug('refex-ash-coal-handling');
      setPage(output);

      const sectionsData = await sectionsService.getByPageId(output.id);
      setSections(sectionsData);
    } catch (error) {
      console.error('Error fetching page data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSectionContent = (item: any, section: any) => {
    setEditingItem(item);
    const formDataToSet: any = {
      ...item,
      mediaId: item.mediaId || item.media?.id || null,
      sectionId: section.id,
      _section: section // Store section object for handleSubmit
    };

    if (item.contentType === 'json' && typeof item.contentValue === 'string') {
      try {
        formDataToSet.contentValue = JSON.parse(item.contentValue);
      } catch (e) { }
    }

    setFormData(formDataToSet);
    setModalType('edit');
    setCurrentEntityType(`section-content-${section.sectionKey}`);
    setShowModal(true);
  };

  const handleEditFixedSection = async (sectionKey: string) => {
    if (!page?.id) return;

    try {
      setLoading(true);

      // Find section
      let section = sections.find(s => s.sectionKey === sectionKey);

      // If not found, create it
      if (!section) {
        section = await sectionsService.create({
          pageId: page.id,
          sectionKey: sectionKey,
          sectionType: 'content',
          isActive: true,
          orderIndex: 0
        });

        // Refresh sections locally or fetch
        const updatedSections = await sectionsService.getByPageId(page.id);
        setSections(updatedSections);
        section = updatedSections.find((s: any) => s.sectionKey === sectionKey);
      }

      if (!section) return;

      // Prepare form data
      const formData: any = {
        sectionId: section.id,
        _section: section
      };

      // Populate form data from content
      if (section.content && section.content.length > 0) {
        section.content.forEach((item: any) => {
          // If it's JSON content, parse it
          if (item.contentType === 'json') {
            try {
              const parsed = JSON.parse(item.contentValue);
              // For features array, process iconPath values to convert /uploads/media/{id} to mediaId (number)
              if (item.contentKey === 'features' && Array.isArray(parsed)) {
                const processedFeatures = parsed.map((feature: any) => {
                  if (feature.iconPath && typeof feature.iconPath === 'string' && feature.iconPath.startsWith('/uploads/media/')) {
                    // Extract media ID from path like /uploads/media/123
                    const mediaIdMatch = feature.iconPath.match(/\/uploads\/media\/(\d+)/);
                    if (mediaIdMatch) {
                      return { ...feature, iconPath: parseInt(mediaIdMatch[1]) };
                    }
                  }
                  // Otherwise, keep the direct path as-is (e.g., /uploads/images/general/general/...)
                  return feature;
                });
                formData[item.contentKey] = processedFeatures;
              } else {
                formData[item.contentKey] = parsed;
              }
            } catch {
              formData[item.contentKey] = item.contentValue;
            }
          } else {
            // For image/media fields, use mediaId if available
            // Also convert /uploads/media/{id} paths back to mediaId for ImageUpload component
            if (item.mediaId) {
              formData[item.contentKey] = item.mediaId;
            } else if (item.contentValue && typeof item.contentValue === 'string' && item.contentValue.startsWith('/uploads/media/')) {
              // Convert /uploads/media/{id} path back to mediaId
              const mediaIdMatch = item.contentValue.match(/\/uploads\/media\/(\d+)/);
              if (mediaIdMatch) {
                formData[item.contentKey] = parseInt(mediaIdMatch[1]);
              } else {
              formData[item.contentKey] = item.contentValue;
            }
          } else {
            formData[item.contentKey] = item.contentValue;
          }
          }
        });
      }

      setEditingItem(section);
      setFormData(formData);
      setModalType('edit');

      // Use specific entity types so Dashboard can render custom forms
      if (sectionKey === 'hero-section') {
        setCurrentEntityType('section-content-hero-ash-coal');
      } else if (sectionKey === 'overview') {
        setCurrentEntityType('section-content-overview-ash-coal');
      } else if (sectionKey === 'services') {
        setCurrentEntityType('section-content-services-ash-coal');
      } else if (sectionKey === 'cta-section') {
        setCurrentEntityType('section-content-cta-ash-coal');
      } else {
        setCurrentEntityType(`section-content-${sectionKey}`);
      }
      setShowModal(true);

    } catch (error) {
      console.error('Error handling fixed section:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Refex Ash & Coal Handling Page Management</h2>
        <button
          onClick={() => window.open('/refex-ash-coal-handling', '_blank')}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          <i className="ri-eye-line"></i>
          Preview Page
        </button>
      </div>

      {/* Section Tabs */}
      <div className="bg-white rounded-xl shadow-lg px-4 py-3">
        <div
          className="flex space-x-2 overflow-x-auto items-center"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Hero Section Tab */}
          <button
            onClick={() => setActiveSection('hero-section')}
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

          {/* Overview Tab */}
          <button
            onClick={() => setActiveSection('overview')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'overview'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-file-text-line text-base"></i>
            <span className="font-medium">Overview</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'overview'
                ? 'bg-blue-200 text-blue-800'
                : 'bg-gray-200 text-gray-600'
              }`}>
              1
            </span>
          </button>

          {/* Services Tab */}
          <button
            onClick={() => setActiveSection('services')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'services'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-service-line text-base"></i>
            <span className="font-medium">Services</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'services'
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
            .filter(s => !fixedSectionKeys.includes(s.sectionKey))
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

      {/* Hero Section */}
      {activeSection === 'hero-section' && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Hero Section</h3>
              <p className="text-gray-500 mt-1">Manage the main banner content</p>
            </div>
            <button
              onClick={() => handleEditFixedSection('hero-section')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <i className="ri-edit-line"></i>
              Edit Content
            </button>
          </div>

          {(() => {
            const section = sections.find(s => s.sectionKey === 'hero-section');
            const tagline = section?.content?.find((c: any) => c.contentKey === 'tagline')?.contentValue;
            const title = section?.content?.find((c: any) => c.contentKey === 'title')?.contentValue;
            const description = section?.content?.find((c: any) => c.contentKey === 'description')?.contentValue;
            const buttonText = section?.content?.find((c: any) => c.contentKey === 'buttonText')?.contentValue;
            const buttonLink = section?.content?.find((c: any) => c.contentKey === 'buttonLink')?.contentValue;
            const bgImage = section?.content?.find((c: any) => c.contentKey === 'backgroundImage');

            return (
              <div className="border rounded-lg overflow-hidden">
                <div className="h-56 bg-gray-100 flex items-center justify-center relative">
                  {bgImage?.media ? (
                    <img
                      src={getAssetPath(bgImage.media.url || bgImage.media.filePath)}
                      alt="Hero Background"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-gray-400">
                      <i className="ri-image-line text-4xl mb-2"></i>
                      <p>No background image</p>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center px-6 text-center space-y-3">
                    {tagline && (
                      <p className="text-sm font-medium text-gray-600 tracking-wide">
                        {tagline}
                      </p>
                    )}
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                      {title || 'Current Hero Title'}
                    </h2>
                    {description && (
                      <p className="text-sm md:text-base text-gray-700 max-w-3xl mx-auto">
                        {description}
                      </p>
                    )}
                    {buttonText && (
                      <a
                        href={buttonLink || '#explore'}
                        className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-700 transition-colors"
                      >
                        {buttonText}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Overview */}
      {activeSection === 'overview' && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Overview Section</h3>
              <p className="text-gray-500 mt-1">Manage overview text and content</p>
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
            const section = sections.find(s => s.sectionKey === 'overview');
            const heading = section?.content?.find((c: any) => c.contentKey === 'heading')?.contentValue;
            const description = section?.content?.find((c: any) => c.contentKey === 'description')?.contentValue;
            const imageItem = section?.content?.find((c: any) => c.contentKey === 'image');
            const featuresItem = section?.content?.find((c: any) => c.contentKey === 'features');

            let features: Array<{ title: string; description: string }> = [];
            if (featuresItem) {
              try {
                features = Array.isArray(featuresItem.contentValue)
                  ? featuresItem.contentValue
                  : JSON.parse(featuresItem.contentValue || '[]');
              } catch {
                features = [];
              }
            }

            return (
              <div className="grid gap-8 lg:grid-cols-2">
                {/* Left column: heading, paragraph, image */}
                <div className="space-y-4">
                  {heading && <h3 className="text-lg font-bold mb-2">{heading}</h3>}
                  {description ? (
                    <p className="text-gray-600 whitespace-pre-wrap">{description}</p>
                  ) : (
                    <p className="text-gray-400 italic">No content yet. Click edit to add content.</p>
                  )}

                  {imageItem && imageItem.media && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Left image (Why us)</p>
                      <img
                        src={getAssetPath(imageItem.media.url || imageItem.media.filePath)}
                        alt="Why us"
                        className="w-full max-w-md rounded-lg border border-gray-200 object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Right column: features list */}
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-gray-800">Right column features</h4>
                  {features.length > 0 ? (
                    <div className="border border-gray-200 rounded-lg divide-y divide-gray-200 bg-gray-50">
                      {features.map((feature, index) => (
                        <div key={index} className="p-4">
                          <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                            Feature {index + 1}
                          </p>
                          <p className="font-semibold text-gray-900 mb-1">{feature.title}</p>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {feature.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 italic">
                      No features configured yet. Click edit to manage the right column items.
                    </p>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Services */}
      {activeSection === 'services' && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Services Section</h3>
              <p className="text-gray-500 mt-1">Manage services content</p>
            </div>
            <button
              onClick={() => handleEditFixedSection('services')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <i className="ri-edit-line"></i>
              Edit Content
            </button>
          </div>
          {(() => {
            const section = sections.find(s => s.sectionKey === 'services');
            const heading = section?.content?.find((c: any) => c.contentKey === 'heading')?.contentValue;
            const flyAsh = section?.content?.find((c: any) => c.contentKey === 'flyAshDescription')?.contentValue;
            const coalYard = section?.content?.find((c: any) => c.contentKey === 'coalYardDescription')?.contentValue;
            const coalTrading = section?.content?.find((c: any) => c.contentKey === 'coalTradingDescription')?.contentValue;

            return (
              <div className="space-y-6">
                {heading && <h3 className="text-lg font-bold mb-2">{heading}</h3>}

                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <h4 className="font-semibold text-gray-900 mb-2">Handling &amp; Disposal of Fly Ash</h4>
                    {flyAsh ? (
                      <p className="text-gray-600 whitespace-pre-wrap text-sm leading-relaxed">{flyAsh}</p>
                    ) : (
                      <p className="text-gray-400 italic text-sm">No content yet for this subsection.</p>
                    )}
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <h4 className="font-semibold text-gray-900 mb-2">Coal Yard Management</h4>
                    {coalYard ? (
                      <p className="text-gray-600 whitespace-pre-wrap text-sm leading-relaxed">{coalYard}</p>
                    ) : (
                      <p className="text-gray-400 italic text-sm">No content yet for this subsection.</p>
                    )}
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <h4 className="font-semibold text-gray-900 mb-2">Coal Trading</h4>
                    {coalTrading ? (
                      <p className="text-gray-600 whitespace-pre-wrap text-sm leading-relaxed">{coalTrading}</p>
                    ) : (
                      <p className="text-gray-400 italic text-sm">No content yet for this subsection.</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* CTA Section */}
      {activeSection === 'cta-section' && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">CTA Section</h3>
              <p className="text-gray-500 mt-1">Manage call to action content</p>
            </div>
            <button
              onClick={() => handleEditFixedSection('cta-section')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <i className="ri-edit-line"></i>
              Edit Content
            </button>
          </div>
          {(() => {
            const section = sections.find(s => s.sectionKey === 'cta-section');
            const title = section?.content?.find((c: any) => c.contentKey === 'title')?.contentValue;
            const description = section?.content?.find((c: any) => c.contentKey === 'description')?.contentValue;
            const buttonText = section?.content?.find((c: any) => c.contentKey === 'buttonText')?.contentValue;
            const buttonLink = section?.content?.find((c: any) => c.contentKey === 'buttonLink')?.contentValue;
            const bgImage = section?.content?.find((c: any) => c.contentKey === 'backgroundImage');

            return (
              <div className="border rounded-lg overflow-hidden">
                <div className="relative h-56 bg-gray-100 flex items-center justify-center">
                  {bgImage?.media ? (
                    <img
                      src={getAssetPath(bgImage.media.url || bgImage.media.filePath)}
                      alt="CTA Background"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-gray-400 w-full h-full flex flex-col items-center justify-center">
                      <i className="ri-image-line text-4xl mb-2"></i>
                      <p>No background image</p>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center px-6 text-center space-y-3">
                    <h4 className="text-2xl md:text-3xl font-bold text-gray-900">
                      {title || 'Refex Industries Limited'}
                    </h4>
                    {description && (
                      <p className="text-sm md:text-base text-gray-700 max-w-2xl mx-auto">
                        {description}
                      </p>
                    )}
                    {buttonText && (
                      <a
                        href={buttonLink || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-white text-gray-900 hover:bg-black hover:text-white px-6 py-2 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        {buttonText}
                        <i className="ri-arrow-right-line text-lg" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

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
                        render: (_value, item) => {
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
